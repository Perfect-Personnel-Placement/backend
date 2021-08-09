import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'INSERT INTO trainer (email, trainerfirst, trainerlast)' +
    ' VALUES ($1, $2, $3,) RETURNING *';

//All comments Written by Samuel Smetzer
export interface createTrainer {
    email: string;
    trainerfirst: string;
    trainerlast: string;
}

export default async function handler(event: APIGatewayProxyEvent) {
    // Check if body is null
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    const trainer: createTrainer = JSON.parse(event.body)

    //Data to be inserted into the INSERT query
    const trainerData = [trainer.email, trainer.trainerfirst, trainer.trainerlast];
    let res;
    //Try the querying the Database
    try {
        res = await client.query(text, trainerData)

    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return created user
    return new HTTPResponse(201, res.rows)
};