import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';
const text = 'UPDATE batch' + 'SET batchSize = $1, curriculumId = $2, endDate = $3, ' + 
    'startDate = $4, trainerId = $5, clientId = $6, confirmed = $7 WHERE batchId =  $8 RETURNING *';

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

//Utility function
// const dateString2Date = (dateString: string) => {
//     var dt  = dateString.split(/\-|\s/);
//     return new Date(dt.slice(0,3).reverse().join('-') + ' ' + dt[3]);
//   }

// Written by MH
export default async function handler(event: APIGatewayProxyEvent) {
    // Return an error if no body provided
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    const batch: setBatch = JSON.parse(event.body);


    // Connect to the db
    try {
        await pgClient.connect();
    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }

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
         await pgClient.end();
         return new HTTPResponse(400, 'Unable to Query the information');
    }

    //Return the the udated row
    await pgClient.end()
    return new HTTPResponse(200, res.rows)
}