import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'UPDATE trainer SET email=$1, trainerfirst=$2, trainerlast=$3 WHERE trainerid = $4 RETURNING *';

//Comments written by Samuel Smetzer
export interface updateTrainer {
    trainerid: number,
    email: string;
    trainerfirst: string;
    trainerlast: string;
}
export default async function handler(event: APIGatewayProxyEvent) {
    // Check if body is null
    if (!event.body) {
        return new HTTPResponse(400, "No body is given")
    }
    const trainer: updateTrainer = JSON.parse(event.body)

    //Data to be inserted into the INSERT query
    const trainerData = [trainer.email, trainer.trainerfirst, trainer.trainerlast, trainer.trainerid];
    let res;
    try {
        res = await client.query(text, trainerData)
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the the udated row
    return new HTTPResponse(200, res.rows)
};