import { APIGatewayProxyEvent } from 'aws-lambda'
import getTrainersByLastName from '../src/trainer/getTrainersByLastNameFn/getTrainersByLastName'
import { trainer } from 'src/global/mockTable'

const input: unknown = { pathParameters: trainer }

getTrainersByLastName(input as APIGatewayProxyEvent).then(res => console.log(res))