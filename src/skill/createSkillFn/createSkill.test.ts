import handler from './createSkill';
jest.mock('../../global/postgres')

import client from '../../global/postgres'
import { skill } from '../../global/mockTable'
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Create the Skill Handler', () => {
    it('should succeed with 201, from a valid input', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            return { rows: skill } // look into mockReturn
        })
        const res = await handler({ body: JSON.stringify(skill) } as APIGatewayProxyEvent);
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
        const res = await handler({ body: JSON.stringify(skill) } as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })

})