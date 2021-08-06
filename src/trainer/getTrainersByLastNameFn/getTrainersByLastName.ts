import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM trainer WHERE (trainerlast = $1) RETURNING *';

//Comments written by Samuel Smetzer
export default async function handler(event: APIGatewayProxyEvent) {
    //Check if the path parameters were null
    if (!event.pathParameters || !event.pathParameters.trainerlast) {
        return new HTTPResponse(400, "No path parameters")
    }
    const trainer = event.pathParameters.trainerId
    //Try connecting to the Databse
    try {
        await client.connect();

    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the DataBase")
    }
    const trainerData = [trainer];
    let res;
    //Try querying the DataBase
    try {
        res = await client.query(text, trainerData)

    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the rows with the last name
    await client.end()
    return new HTTPResponse(200, res.rows)
};