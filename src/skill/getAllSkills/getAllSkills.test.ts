import handler from './getAllSkills';
jest.mock('../../global/postgres')

import client from '../../global/postgres'
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Create the Skill Delete Handler', () => {
    it('should succeed with 200, from a valid input', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} });
        const res = await handler({} as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })

    it('should fail with 500, from a database connection error', async () => {
        (client.connect as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({} as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(500);
    })

    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({} as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })

})
