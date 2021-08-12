import handler from './confirmBatch';
jest.mock('../../global/postgres')
jest.mock('../../global/snsClient')
jest.mock('../../global/sesClient')

import client from '../../global/postgres'
import { snsClient } from '../../global/snsClient';
import { sesClient } from '../../global/sesClient';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { batch } from '../../global/mockTable';
const input: unknown = { pathParameters: { batchId : 11210034 } }
const wronginput: unknown = { pathParameters: { wrongProperty : "WrongPathParam" } }
const wrongInput2: unknown = { pathParameters: { batchId : "11210034" } }



// Written by BWK
describe('ConfirmBatch handler', () => {
    it('should fail with 400, from an invalid path parameter', async () => {
        const res = await handler({} as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
    })

    it('should succeed with 200, from a valid input', async () => { 
        (client.query as jest.Mock).mockResolvedValue({ rows: [{
            trainerid : 22,
            curriculumid : 33,
            startdate : "1/1/21",
            enddate : "3/3/23",
            confirmed : false,
            email: "sample@test.com"
        }] })
        const res = await handler(input as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })

    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler({} as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })

    it('should fail with 400, from an invalid path parameter', async () => {
        const res = await handler(wronginput as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
      });
    
    it('should pass with 200 but indicating snsError', async () => {
        (snsClient.send as jest.Mock).mockResolvedValueOnce( () => {
            throw "error";
        })
        const res = await handler(input as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);

    })

    it('should pass with 400 but indicates sesError', async () => {
        (sesClient.send as jest.Mock).mockResolvedValue( () => {
            throw "error";
        })
        const res = await handler(input as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);

    })

    it('should fail with 400, from a true confirmed', async () => { 
        (client.query as jest.Mock).mockResolvedValue({ rows: [{
            trainerid : 22,
            curriculumid : 33,
            startdate : "1/1/21",
            enddate : "3/3/23",
            confirmed : true,
            email: "sample@test.com"
        }] })
        const res = await handler(input as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
    })


    it('should fail with 400, from a database query error', async () => {
        const err = { detail: 'normal error from testing' };
        (client.query as jest.Mock).mockImplementationOnce(() => {
          throw err;
        });
        const res = await handler({} as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
      });
})