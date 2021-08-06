import handler from './getDemandById';
jest.mock('../../global/postgres')

import client from '../../global/postgres'
import { APIGatewayProxyEvent } from 'aws-lambda';
const input: unknown = { pathParameters: { clientDemandId: 1 } }

// Written by BWK
describe('Get Demand by ID Handler', () => {
    it('should fail with 400, from an invalid path parameter', async () => {
        const res = await handler({} as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
    })

    it('should succeed with 200, from a valid input', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} })
        const res = await handler(input as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })

    it('should fail with 500, from a database connection error', async () => {
        (client.connect as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler(input as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(500);
    })

    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler(input as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })
})