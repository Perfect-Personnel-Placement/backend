import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text =
  'INSERT INTO trainer (email, trainerfirst, trainerlast)' +
  ' VALUES ($1, $2, $3) RETURNING *';

//Expected input from HTTP Request Body
export interface CreateTrainer {
  email: string;
  trainerfirst: string;
  trainerlast: string;
}

/**
 * Insert Trainer Handler - Used to create a new trainer in the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Samuel Smetzer
 * @author Daguinson Fleurantin
 */
export default async function handler(event: APIGatewayProxyEvent) {
  // Check if body is null
  if (!event.body) {
    return new HTTPResponse(400, {
      error: 'No body was given; nothing to do. Body must formatted as follows',
      body: {
        email: 'string',
        trainerfirst: 'string',
        trainerlast: 'string'
      }
    });
  }
  const trainer: CreateTrainer = JSON.parse(event.body);

  // Check that data has expected key-value pairs
  if (
    typeof trainer.email != 'string' ||
    typeof trainer.trainerfirst != 'string' ||
    typeof trainer.trainerlast != 'string'
  ) {
    return new HTTPResponse(400, {
      error: 'Body was missing information. Body must be formatted as follows:',
      body: {
        email: 'string',
        trainerfirst: 'string',
        trainerlast: 'string'
      }
    });
  }

  // Set up query values into an array as required by postgres
  const trainerData = [
    trainer.email,
    trainer.trainerfirst,
    trainer.trainerlast
  ];

  //Try the querying the Database
  try {
    const res = await client.query(text, trainerData);
    return new HTTPResponse(201, res.rows);
  } catch (err: any) {
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
}
