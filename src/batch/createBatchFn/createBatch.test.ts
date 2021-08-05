import handler from './createBatch';
jest.mock('../../global/postgres')

import client from '../../global/postgres'
import * as batch from '../../global/mockTable'
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Create the Batch Handler', () => {
    it('should succeed with 201, from a valid input', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            return { rows: batch } // look into mockReturn
        })
        const res = await handler({ body: JSON.stringify(batch) } as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(201);
    })

    it('should fail with 400, from a null body', async () => {
        const res = await handler({} as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400);
    })

    it('should fail with 500, from a database connection error', async () => {
        (client.connect as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({ body: JSON.stringify(batch) } as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(500);
    })

    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({ body: JSON.stringify(batch) } as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })

})
