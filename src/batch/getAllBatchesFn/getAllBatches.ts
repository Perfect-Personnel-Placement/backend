import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM batch';

/**
 * Get All Batches Handler - Used to get all batches in the database.
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Tyler Yates
 * @author Mohamed Hassan
 */
export default async function handler() {
  //Try querying the database
  let res;
  try {
    res = await client.query(text);
    return new HTTPResponse(200, res.rows);
  } catch (err: any) {
    let displayError: string;
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = 'Unknown error.';
    }
    return new HTTPResponse(400, {
      error: 'The database rejected the query.',
      db_error: displayError
    });
  }
}
