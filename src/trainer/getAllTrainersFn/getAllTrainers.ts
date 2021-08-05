import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM trainer';

//Comments written by Samuel Smetzer
export default async function handler(event: APIGatewayProxyEvent) {
    //Try connecting to the Databse
    try {
        await client.connect();
    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }
    //Try querying the DataBase
    let res;
    try {
        res = await client.query(text)
    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the all the rows in trainer
    await client.end()
    return new HTTPResponse(200, res.rows)
};