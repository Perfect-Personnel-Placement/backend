import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';

// Postgres query
const text =
  'SELECT c.*, json_agg(s.skillid) as skillIdArr, json_agg(s.skillname) as skillNameArr ' +
  'FROM curriculum c ' +
  'JOIN curriculum_skill cs ON cs.curriculumid = c.curriculumid ' +
  'JOIN skill s ON s.skillid = cs.skillid ' +
  'GROUP BY c.curriculumid';

/**
 * Get All Curicula Handler - Gets the complete list of curricula in the table
 * @returns {HTTPResponse} - HTTP response with status code and body
 * @author Marc Skwarczynski, Jared Burkamper
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
      db_error: displayError,
    });
  }
}
