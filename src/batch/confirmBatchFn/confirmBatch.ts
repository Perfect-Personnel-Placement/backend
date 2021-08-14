import { PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { snsClient } from '../../global/snsClient';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
import mailTransport from '../../global/nodemailer';
import Mail from 'nodemailer/lib/mailer';

// Postgres queries
const selectQuery =
  'SELECT b.confirmed, b.startdate, t.email, c.curriculumname ' +
  'FROM batch b ' +
  'LEFT JOIN trainer t ON t.trainerid = b.trainerid ' +
  'JOIN curriculum c ON c.curriculumid = b.curriculumid ' +
  'WHERE b.batchid = $1';
const updateQuery = 'UPDATE batch SET confirmed = true WHERE batchid = $1';

/**
 * Confirm Batch Handler - Used to confirm a batch in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan, Marc Skwarczynski, Jared Burkamper
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Pull data from event body after checking if the path parameters were null
  if (!event.pathParameters || !event.pathParameters.batchId) {
    return new HTTPResponse(
      400,
      'No path parameter was given; expected batchId as a number.'
    );
  }
  const batchId = event.pathParameters.batchId;

  // Query database for batch, trainer, and curriculum information
  let batchData;
  try {
    batchData = await pgClient.query(selectQuery, [batchId]);
  } catch (err) {
    console.log('Postgres error:\n', err);
    let displayError = '';
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = 'Unkown Error';
    }
    return new HTTPResponse(400, {
      error: 'Initial query rejected.',
      db_error: displayError,
    });
  }

  // Validate that batch can be confirmed
  if (
    !(
      batchData.rows[0] &&
      batchData.rows[0].email &&
      !batchData.rows[0].confirmed
    )
  ) {
    return new HTTPResponse(400, {
      error: 'Batch was ineligible for confirmation. All must be true.',
      batchExists: !!batchData.rows[0],
      batchHasTrainer: batchData.rows[0] && batchData.rows[0].email,
      batchNotConfirmed: batchData.rows[0] && batchData.rows[0].confirmed,
    });
  }

  // Assign variables for ease of use
  const currName = batchData.rows[0].curriculumname;
  const startDate = batchData.rows[0].startDate;
  const trainerEmail = batchData.rows[0].email;
  const responseBody: any = {
    message: 'Batch confirmed successfully.',
    snsStatus: '',
    emailStatus: '',
  };

  // Message to be used for SNS and confirmation email
  const confirmMsg =
    `A batch for ${currName} has been confirmed. ` +
    `Planned start date: ${startDate}`;

  // Publish to SNS topic
  // SNS_TOPIC_ARN should be exported as a variable to the command line.
  // This will be determined by your AWS configuration.
  const snsParams: PublishCommandInput = {
    Message: confirmMsg,
    TopicArn: process.env.SNS_TOPIC_ARN,
  };
  try {
    await snsClient.send(new PublishCommand(snsParams));
    responseBody.snsStatus = 'Success';
  } catch (err) {
    console.log('SNS error:\n', err);
    responseBody.snsStatus = 'Failed to publish to SNS topic';
  }

  // Send confirmation email to trainer using SMTP through SES
  // Read AWS documentation on SES sandboxing b/c it's severely handicapped
  // prior to production. Only emails configured by 2106RNCN are:
  // perfectpersonnelplacement@outlook.com for sending messages
  // perfectpersonnelplacement@gmail.com for receiving messages
  // DO NOT ATTEMPT TO USE GMAIL TO SEND. IT'S A BAD TIME. WE SPENT DAYS.
  const nodemailerParams: Mail.Options = {
    from: 'perfectpersonnelplacement@outlook.com',
    to: trainerEmail,
    subject: 'New batch confirmed.',
    text: confirmMsg,
  };
  try {
    await mailTransport.sendMail(nodemailerParams);
    responseBody.emailStatus = 'Success';
  } catch (err) {
    console.log('SES error:\n', err);
    responseBody.emailStatus = 'Failed to send email';
  }

  // Finally, update the batch in the database
  try {
    await pgClient.query(updateQuery, [batchId]);
  } catch (err) {
    console.log('Postgres error:\n', err);
    let displayError = '';
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = 'Unknown Error';
    }
    return new HTTPResponse(400, {
      error: 'Update query rejected.',
      db_error: displayError,
    });
  }

  // Indicate success to the user
  return new HTTPResponse(200, responseBody);
}
