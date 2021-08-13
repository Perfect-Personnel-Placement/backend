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
    // Check that data was provided, then assign the data to a variable
    if (!event.body) {
        return new HTTPResponse(400, {
            error:
                'No body was given; nothing to do. Body must formatted as follows',
            body: {
                trainerid: 'number',
                email: 'string',
                trainerfirst: 'string',
                trainerlast: 'string',
                curriculaIdArr: 'number[]'
            }
        });
    }
    const trainer: updateTrainer = JSON.parse(event.body)

    // Check that data has expected key-values pairs
    if (
        typeof trainer.trainerid != 'number' ||
        typeof trainer.email != 'string' ||
        typeof trainer.trainerfirst != 'string' ||
        typeof trainer.trainerlast != 'string' ||
        !trainer.curriculaIdArr
    ) {
        return new HTTPResponse(400, {
            error: 'Body was missing information. Body must be formatted as follows:',
            body: {
                trainerid: 'number',
                email: 'string',
                trainerfirst: 'string',
                trainerlast: 'string',
                curriculaIdArr: 'number[]'
            }
        });
    }

    //Data to be inserted into the INSERT query
    const trainerData = [trainer.email, trainer.trainerfirst, trainer.trainerlast, trainer.trainerid];

    try {
        const res = await client.query(text, trainerData)
        console.log(trainer.curriculaIdArr[0])
        if (trainer.curriculaIdArr) {
            // added the logic for the trainer-curriculum join table
            for (let elem of trainer.curriculaIdArr) {
                const skillData = [trainer.trainerid, elem];
                await client.query(curriculaQuery, skillData);
            }
        }
        return new HTTPResponse(200, res.rows)
    } catch (err) {
        console.log(err);
        let displayError: string;
        if (err.detail) {
            displayError = err.detail;
        } else {
            displayError = 'Unknown error.';
        }
        return new HTTPResponse(400, {
            error: 'The database has rejected the query.',
            db_error: displayError
        });
    }
};