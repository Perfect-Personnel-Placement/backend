import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM trainer';

/**
 * Get All Trainer Handler - Gets the complete list of trainer in the table.
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Samuel Smetzer
 * @author Daguinson Fleurantin
 */
export default async function handler() {
  // Return data or error provided by the database
  try {
    const res = await client.query(text);
    return new HTTPResponse(200, res.rows);
  } catch (err: any) {
    let displayError: string;
    if (err.detail) {
      displayError = err.detail;
    } else {
      displayError = 'Unknown error.';
    }
    return new HTTPResponse(400, {
      Message: 'The database rejected the query.',
      db_error: displayError
    });
  }
}
