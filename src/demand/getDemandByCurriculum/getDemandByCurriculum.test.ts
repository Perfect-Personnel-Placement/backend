import handler from './getDemandByCurriculum';
jest.mock('../../global/postgres')

import client from '../../global/postgres'
import { APIGatewayProxyEvent } from 'aws-lambda';
const testDate = new Date('8/6/2021').toISOString().substring(0, 10);

const inputWithoutDates: unknown = { pathParameters: { curriculumId: 1 } }
const inputWithDates: unknown = { pathParameters: {
    curriculumId: 1,
    startDate: testDate,
    endDate: testDate,
} }
const inputWithStartDate: unknown = { pathParameters: {
    curriculumId: 1,
    startDate: testDate,
} }
const inputWithEndDate: unknown = { pathParameters: {
    curriculumId: 1,
    endDate: testDate,
} }

// Written by BWK
describe('Get Demand by Curriculum Handler', () => {
    it('should fail with 400, from an invalid path parameter', async () => {
        const res = await handler({} as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
    })

    it('should succeed with 200, from a valid dateless input', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} })
        const res = await handler(inputWithoutDates as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })

    it('should succeed with 200, from a valid dated input', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} })
        const res = await handler(inputWithDates as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(200);
    })


    it('should fail with 400, from a database query error', async () => {
        (client.query as jest.Mock).mockImplementationOnce(() => {
            throw "error"
        })
        const res = await handler(inputWithoutDates as APIGatewayProxyEvent)
        expect(res.statusCode).toEqual(400)
    })

    it('should fail with 400, due to missing end date', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} })
        const res = await handler(inputWithStartDate as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
    })

    it('should fail with 400, due to missing start date', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: {} })
        const res = await handler(inputWithEndDate as APIGatewayProxyEvent);
        expect(res.statusCode).toEqual(400);
    })
})