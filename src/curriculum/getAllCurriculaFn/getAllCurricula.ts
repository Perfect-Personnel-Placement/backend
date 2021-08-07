import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM curriculum';

// Written by MJS
export default async function handler() {
  // Return data or error provided by the database
  try {
    const res = await client.query(text);
    return new HTTPResponse(200, res.rows);
  } catch (err) {
    return new HTTPResponse(400, {
      Message: 'Unable to Query the information',
      err
    });
  }
}
