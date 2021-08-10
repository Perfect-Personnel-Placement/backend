import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'UPDATE trainer SET email=$1, trainerfirst=$2, trainerlast=$3 WHERE trainerid = $4 RETURNING *';

const curriculaQuery = 
  'INSERT INTO trainer_curriculum' + 
  ' (trainerid, curriculumid)' + 
  ' Values ($1, $2) RETURNING *';

//Comments written by Samuel Smetzer
export interface updateTrainer {
    trainerid: number,
    email: string;
    trainerfirst: string;
    trainerlast: string;
    curriculaIdArr: number[];
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
        console.log(trainer.curriculaIdArr[0])
        if (trainer.curriculaIdArr) {
            // added the logic for the skill-curriculum join table
            for (let elem of trainer.curriculaIdArr) {
                const skillData = [trainer.trainerid, elem];
                await client.query(curriculaQuery, skillData);
            }
        }
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the the udated row
    return new HTTPResponse(200, res.rows)
};