import { HTTPResponse } from '../../global/objects';
import pgClient from '../../global/postgres';

// Postgres query
const text = 'SELECT * FROM client';

/**
 * Get All Clients Handler - Gets all clients in the database
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Jared Burkamper
 */
export default async function handler() {
  // Get the data from the db
  try {
    const res = await pgClient.query(text);
    return new HTTPResponse(200, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      message: 'The database rejected the query',
      err
    });
  }
}
