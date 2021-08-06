import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT * FROM batches';
//YTyler
export default async function handler(event: APIGatewayProxyEvent) {

    //Try querying the DataBase
    let res;
    try {
        res = await client.query(text)
    } catch (err) {
        console.log(err);
        return new HTTPResponse(400, "Unable to Query the information")
    }
    //Return the all the rows in trainer
    return new HTTPResponse(200, res.rows)
};