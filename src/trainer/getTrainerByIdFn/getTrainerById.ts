import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM trainer WHERE (trainerid = $1) RETURNING *';
const curriculumQuery = 'SELECT * FROM trainer_curriculum WHERE trainerid = $1'

//Comments written by Samuel Smetzer
export default async function handler(event: APIGatewayProxyEvent) {
    //Check if the path parameters were null
    if (!event.pathParameters || !event.pathParameters.trainerId) {
        return new HTTPResponse(400, "No path parameters")
    }
    const trainer = event.pathParameters.trainerId

    const trainerData = [trainer];
    let res;
    //Try querying the DataBase
    try {
        res = await client.query(text, trainerData)
        const curriculumArray = await client.query(curriculumQuery, [trainer])
        res.rows[0].curriculaIdArr = curriculumArray.rows
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the row
    return new HTTPResponse(200, res.rows)
};