import { APIGatewayProxyEvent } from 'aws-lambda'
import getTrainersByFirstName from '../src/trainer/getTrainersByFirstNameFn/getTrainersByFirstName'
import { trainer } from 'src/global/mockTable'

const input: unknown = { pathParameters: trainer }

getTrainersByFirstName(input as APIGatewayProxyEvent).then(res => console.log(res))