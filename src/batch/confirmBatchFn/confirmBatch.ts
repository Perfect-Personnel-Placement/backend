import { APIGatewayProxyEvent } from 'aws-lambda';
import { updateBatchData } from 'src/global/mockTable';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
import {CreateTopicCommand, PublishCommand, SubscribeCommand } from "@aws-sdk/client-sns";
import {snsClient } from "../../global/snsClient";

let updateBatchQuery = 'UPDATE batch SET confirmed = true WHERE batchid = $1';
let checkTrainerQuery = 'SELECT confirmed, trainerid, curriculumid, startdate FROM batch WHERE batchid = $1';
let getTrainerEmailQuery = 'SELECT email FROM trainer WHERE trainerid = $1';
const getCurricNameQuery = 'SELECT curriculumname FROM curriculum WHERE curriculumid = $1';

/**
 * Insert Curriculum Handler - Used to create a new curriculum in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Mohamed Hassan
 */
export default async function handler(event: APIGatewayProxyEvent) { 

    //Pull data from event body
    if(event.pathParameters) {
        const batchId = event.pathParameters.batchId;
        console.log(batchId);
        
        //Make initial query to see if trainer exists
        const res = await pgClient.query(checkTrainerQuery, [batchId]);
        console.log(res.rows); //Returns undefined if trainer DNE

        const trainerId = res.rows[0].trainerid;
        const curriculumId = res.rows[0].curriculumid;
        const startDate = res.rows[0].startdate;
        const confirmed = res.rows[0].confirmed;

        if(res.rows && !confirmed) {
            //Update batch status to confirmed on postgres table batch
            await pgClient.query(updateBatchQuery, [batchId]);

            //We're going to hand notifications to trainer who's batch was confirmed
            const trainerResult = await pgClient.query(getTrainerEmailQuery, [trainerId]);
            const trainerEmail = trainerResult.rows[0].email;

            //Get curric name
            const curricNameResult = await pgClient.query(getCurricNameQuery, [curriculumId]);
            const curricName = curricNameResult.rows[0].curriculumname;

            //Declare SNS params
            //Create a topic --> subscribe individual trainer --> publish message
            //const topicParams = { Name: "OnBatchConfirm" }; //TOPIC_NAME
            const subscriberParams = {
                Protocol: "email" /* required */,
                TopicArn: process.env.SNS_TOPIC_ARN, 
                Endpoint: trainerEmail, //EMAIL_ADDRESS
              };
            const publishParams = {
              Message: `A batch for ${curricName} has been confirmed. Planned start date: ${startDate}`, 
              TopicArn: process.env.SNS_TOPIC_ARN
            };

            const run = async () => {
                try {
                   // const data = await snsClient.send(new CreateTopicCommand(topicParams));
                    const subscribeData = await snsClient.send(new SubscribeCommand(subscriberParams));
                    const publishedData = await snsClient.send(new PublishCommand(publishParams));

                    console.log("Success.",  subscribeData, publishedData);
                    return publishedData; // For unit tests.
                } catch (err) {
                    console.log("Error", err.stack);
                }
            };
            run();


            return new HTTPResponse(200, "Batch confirmed successfully");
        
        } else {
        return new HTTPResponse(400, "Batch unable to be confirmed");
    }

} else { 
    return new HTTPResponse(400, "Invalid path parameters");
}
}

