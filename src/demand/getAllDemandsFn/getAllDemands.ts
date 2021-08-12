import { HTTPResponse } from '../../global/objects';
import { APIGatewayProxyEvent } from 'aws-lambda';

import client from '../../global/postgres';
const text = 'SELECT * FROM demand';

/**
 * Get All Demands Handler - Used to get all demands from the database.
 * @param {APIGatewayProxyEvent} event - HTTP request from API Gateway
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Daguinson Fleurantin, Nick Wang
 */
export default async function handler() {
  // Assign data or return error provided by the database
  let res;
  try {
    res = await client.query(text);
    //return the data
    return new HTTPResponse(200, res.rows);
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
