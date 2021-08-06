import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'UPDATE batch' + 'SET batchsize = $1, curriculumid = $2, enddate = $3, ' + 
    'startdate = $4, trainerid = $5, clientid = $6, confirmed = $7 WHERE batchId =  $8 RETURNING *';

export interface setBatch {
    batchSize : number,
    batchId : number,
    curriculumId : number,
    endDate : string,
    startDate : string,
    trainerId : number | null,
    clientId : number | null,
    confirmed : boolean

}

// Written by MH
export default async function handler(event: APIGatewayProxyEvent) {
    // Return an error if no body provided
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    const batch: setBatch = JSON.parse(event.body);


    // Set up query values into an array as required by postgres
    const batchData = [
        batch.batchSize,
        batch.curriculumId,
        batch.endDate,
        batch.startDate,
        batch.trainerId,
        batch.clientId,
        batch.confirmed,
        batch.batchId,
    ];
    let res;

    // Assign data or return error provided by the database
    try {
        res = await pgClient.query(text, batchData);
    } catch (err) {
         console.log(err);
         return new HTTPResponse(400, 'Unable to Query the information');
    }

    //Return the the udated row
    return new HTTPResponse(200, res.rows)
}