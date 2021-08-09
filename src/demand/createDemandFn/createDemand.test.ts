jest.mock('../../global/postgres')
import client from '../../global/postgres'
import { demand } from '../../global/mockTable'
import { APIGatewayProxyEvent } from 'aws-lambda';
import handler from './createDemand';

describe('Testing CreateDemand  Handler', () => {
    it('should succeed with 201, from a valid input', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            return { rows: demand } // look into mockReturn
        })
        const res = await handler({ body: JSON.stringify(demand) } as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(201);
    })

    it('should fail with 400, from a null body', async () => {
        const res = await handler({} as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400);
    })

    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({ body: JSON.stringify(demand) } as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })

})