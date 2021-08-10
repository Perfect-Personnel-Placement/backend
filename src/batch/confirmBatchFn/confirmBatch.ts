import { APIGatewayProxyEvent } from 'aws-lambda';
import { updateBatchData } from 'src/global/mockTable';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
import { CreateTopicCommand, SubscribeCommand } from '@aws-sdk/client-sns';
import { snsClient } from '../../global/snsClient';

let updateBatchQuery = 'UPDATE batch SET confirmed = true WHERE batchid = $1';
let checkTrainerQuery = 'SELECT trainerid FROM batch WHERE batchid = $1';
let getTrainerEmailQuery = 'SELECT email FROM trainer WHERE trainerid = $1';

export default async function handler(event: APIGatewayProxyEvent) {
  // Pull data from event body
  if (event.pathParameters) {
    const batchId = event.pathParameters.batchId;
    console.log(batchId);

    // Make initial query to see if trainer exists
    const res = await pgClient.query(checkTrainerQuery, [batchId]);

    // Check that a trainer is assigned
    if (res.rows[0]) {
      // Update batch status on postgres table batch
      await pgClient.query(updateBatchQuery, [batchId]);
      const res2 = await pgClient.query(getTrainerEmailQuery, res.rows);
      const EMAIL_ADDRESS = res2.rows[0].email;
      // We're going to hand notifications to trainer who's batch was confirmed

      // Declare SNS params
      const topicParams = { Name: 'OnBatchConfirm' };
      const subscriberParams = {
        Protocol: 'email' /* required */,
        TopicArn:
          'arn:aws:sns:us-east-1:625432597367:P3_Emailer:b527ea64-e3e1-4a11-89a9-dea78f75c945', //TOPIC_ARN
        Endpoint: EMAIL_ADDRESS
      };

      (async () => {
        try {
          const data1 = await snsClient.send(
            new CreateTopicCommand(topicParams)
          );
          const data2 = await snsClient.send(
            new SubscribeCommand(subscriberParams)
          );
          console.log('Success.', data1, data2);
          return [data1, data2]; // For unit tests.
        } catch (err: any) {
          console.log('Error', err.stack);
        }
      })();

      return new HTTPResponse(200, 'Batch confirmed successfully');
    } else {
      return new HTTPResponse(
        400,
        'Batch unable to be confirmed: no trainer assigned'
      );
    }
  } else {
    return new HTTPResponse(
      400,
      'Batch unable to be confirmed: parameter not given/malformed'
    );
  }
}
