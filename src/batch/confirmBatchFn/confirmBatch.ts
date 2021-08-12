import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
import { PublishCommand } from "@aws-sdk/client-sns";
import { snsClient } from "../../global/snsClient";
import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { sesClient } from "../../global/sesClient";
import { trainer } from 'src/global/mockTable';


//Postgres queries
let updateBatchQuery = 'UPDATE batch SET confirmed = true WHERE batchid = $1';
let checkTrainerQuery = 'SELECT confirmed, trainerid, curriculumid, startdate FROM batch WHERE batchid = $1';
let getTrainerEmailQuery = 'SELECT email FROM trainer WHERE trainerid = $1';
const getCurricNameQuery = 'SELECT curriculumname FROM curriculum WHERE curriculumid = $1';


let responseBody : any = {
    message: "Batch confirmed successfully!",
    snsStatus: "",
    sesStatus: ""
}
/**
 * Insert Curriculum Handler - Used to create a new curriculum in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan
 */


export default async function handler(event: APIGatewayProxyEvent) {

    //Pull data from event body
    if (!event.pathParameters || !event.pathParameters.batchId) { //Check if the path parameters were null
        return new HTTPResponse(
            400,
            'No path parameter was given; expected batchId as a number.'
        );
    }
    const batchId = event.pathParameters.batchId;

    //Make initial query to see if trainer exists
    const res = await pgClient.query(checkTrainerQuery, [batchId]);
    const trainerId = res.rows[0].trainerid;
    const curriculumId = res.rows[0].curriculumid;
    const startDate = res.rows[0].startdate;
    const confirmed = res.rows[0].confirmed;

    if (res.rows && !confirmed) {
        //Update batch status to confirmed on postgres table batch
        await pgClient.query(updateBatchQuery, [batchId]);

        //We're going to hand notifications to trainer who's batch was confirmed
        //Grab trainer details
        const trainerResult = await pgClient.query(getTrainerEmailQuery, [trainerId]);
        const trainerEmail = trainerResult.rows[0].email;

        //Get curric name
        const curricNameResult = await pgClient.query(getCurricNameQuery, [curriculumId]);
        const curricName = curricNameResult.rows[0].curriculumname;

        //Declare SNS params
        const publishParams = {
            Message: `A batch for ${curricName} has been confirmed. Planned start date: ${startDate}`,
            TopicArn: process.env.SNS_TOPIC_ARN
        };

        //SNS 
        try {
            const publishedData = await snsClient.send(new PublishCommand(publishParams));
            responseBody.snsStatus = "Successful SNS call."
            console.log("Success.", publishedData);
        } catch (err) {
            responseBody.snsStatus = "Failed to publish to SNS.";
            console.log("Error", err);
            
        }

        //SES
        const params: SendEmailCommandInput = {
            Destination: {
                /* required */
                ToAddresses: [
                    trainerEmail, //RECEIVER_ADDRESS
                    /* more To-email addresses */
                ],
            },
            Message: {
                /* required */
                Body: {
                    /* required */
                    
                    Text: {
                        Charset: "UTF-8",
                        Data: `A batch for ${curricName} has been confirmed. Planned start date: ${startDate}`,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "New batch confirmed.",
                },
            },
            Source: "perfectpersonnelplacement@outlook.com", // SENDER_ADDRESS
        };

        try {
            const data = await sesClient.send(new SendEmailCommand(params));
            responseBody.sesStatus = "Successfully sent email."
            console.log("Success", data);
          } catch (err) {
            console.log("Error", err);
            responseBody.sesStatus = "Failed to send SES email."
          }




        return new HTTPResponse(200, responseBody);

    } else {
        console.log("Line122");
        return new HTTPResponse(400, "Batch unable to be confirmed");
    }


}

