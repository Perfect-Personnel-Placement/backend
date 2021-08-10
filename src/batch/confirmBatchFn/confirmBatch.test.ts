import handler from './confirmBatch';
jest.mock('../../global/postgres')
import client from '../../global/postgres'
import { APIGatewayProxyEvent } from 'aws-lambda';
import { batch } from '../../global/mockTable';
const input: unknown = { pathParameters: { batchId : 11210034 } }

// Written by BWK
describe('Get Batch by ID Handler', () => {
    it('should fail with 400, from an invalid path parameter', async () => {
        const res = await handler({} as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
    })

    it('should succeed with 200, from a valid input', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} })
        const res = await handler(input as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })

    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler(input as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })
})