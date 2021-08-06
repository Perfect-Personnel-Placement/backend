import handler from './getAllTrainers';
jest.mock('../../global/postgres')

import client from '../../global/postgres'
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Test GetAllTrainers', () => {
    it('should succeed with 200, from a valid input', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} })
        const res = await handler({} as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })


    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({} as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })
})