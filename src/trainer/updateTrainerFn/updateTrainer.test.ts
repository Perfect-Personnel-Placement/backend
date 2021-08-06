jest.mock('../../global/postgres')
import client from '../../global/postgres'
import { trainer } from '../../global/mockTable'
import { APIGatewayProxyEvent } from 'aws-lambda';
import handler from './updateTrainer';

describe('Testing UpdateTrainer  Handler', () => {
    it('should succeed with 200, from a valid input', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            return { rows: trainer } // look into mockReturn
        })
        const res = await handler({ body: JSON.stringify(trainer) } as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })

    it('should fail with 400, from a null body', async () => {
        const res = await handler({} as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400);
    })

    it('should fail with 500, from a database connection error', async () => {
        (client.connect as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({ body: JSON.stringify(trainer) } as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(500);
    })

    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({ body: JSON.stringify(trainer) } as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })

})
