import { APIGatewayProxyEvent } from 'aws-lambda';
import { updateBatchData } from 'src/global/mockTable';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
import {CreateTopicCommand, SubscribeCommand } from "@aws-sdk/client-sns";
import {snsClient } from "../../global/snsClient";

let updateBatchQuery = 'UPDATE batch SET confirmed = true WHERE batchid = $1';
let checkTrainerQuery = 'SELECT trainerid FROM batch WHERE batchid = $1 RETURNING *';
let getTrainerEmailQuery = 'SELECT email FROM trainer WHERE trainerid = $1';

export default async function handler(event: APIGatewayProxyEvent) { 

    //Pull data from event body
    if(event.pathParameters) {
        const batchId = event.pathParameters.batchId;
        console.log(batchId);
        
        //Make initial query to see if trainer exists
        const res = await pgClient.query(checkTrainerQuery, [batchId]);
        
        //const trainerId = res.rows[0].trainerId;
        console.log(res.rows); //Returns undefined if trainer DNE
        if(res.rows) {
            //Update batch status on postgres table batch
            await pgClient.query(updateBatchQuery, [batchId]);

            //We're going to hand notifications to trainer who's batch was confirmed

            //Declare SNS params
            const topicParams = { Name: "OnBatchConfirm" }; //TOPIC_NAME
            const subscriberParams = {
                Protocol: "email" /* required */,
                TopicArn: "TOPIC_ARN", //TOPIC_ARN
                Endpoint: "EMAIL_ADDRESS", //EMAIL_ADDRESS
              };

            const run = async () => {
            try {
                const data = await snsClient.send(new CreateTopicCommand(topicParams));
                console.log("Success.",  data);
                return data; // For unit tests.
            } catch (err) {
                console.log("Error", err.stack);
            }
            };


            return new HTTPResponse(200, "Batch confirmed successfully");

            
        } else {
            return new HTTPResponse(400, "Batch unable to be confirmed; No trainer assigned");
        }


    } else {
        return new HTTPResponse(400, "Batch unable to be confirmed");
    }

    
}
