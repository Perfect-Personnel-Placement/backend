jest.mock('../../global/postgres')
import client from '../../global/postgres'
import { batch } from '../../global/mockTable'
import { APIGatewayProxyEvent } from 'aws-lambda';
import handler from './getBatchById';

const input: unknown = { pathParameters: { batchId : 123 } }
describe('Testing getBatchById Handler', () => {
    it('should succeed with status code 200', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            return { rows: batch }
        })
        const res = await handler(input as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })

    it('should fail with 400, from a pathparamaters is null', async () => {
        const res = await handler({} as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400);
    })

/*     it('should fail with 500, from a database connection error', async () => {
        (client.connect as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler(input as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(500);
    }) */

    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler(input as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })

})