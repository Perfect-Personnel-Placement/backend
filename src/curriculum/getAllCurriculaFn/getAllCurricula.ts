import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM curriculum';

// Written by MJS
export default async function handler() {
  // Attempt to connect to the database
  try {
    await client.connect();
  } catch (err) {
    console.log(err);
    return new HTTPResponse(500, 'Unable to Connect to the Database');
  }

  // Assign data or return error provided by the database
  let res;
  try {
    res = await client.query(text);
  } catch (err) {
    console.log(err);
    await client.end();
    return new HTTPResponse(400, 'Unable to Query the information');
  }

  // Close the database connection and return the data
  await client.end();
  return new HTTPResponse(200, res.rows);
}
