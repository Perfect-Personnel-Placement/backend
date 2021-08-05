
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HTTPResponse } from '../../global/objects';
import client from '../../global/postgres';
const text = 'SELECT (skillname) FROM skill';

export interface getAllSkills {
    skillname: string
}



export default async function handler(event: APIGatewayProxyEvent) {
    try {
        await client.connect();
    } catch (err) {
        console.log(err)
        return new HTTPResponse(500, "Unable to Connect to the Database")
    }

    let res;

    try {
        res = await client.query(text)

    } catch (err) {
        console.log(err);
        await client.end()
        return new HTTPResponse(400, "Unable to Query the information")
    }

    await client.end()
    return new HTTPResponse(200, res.rows)
};