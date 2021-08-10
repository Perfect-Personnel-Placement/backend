import { APIGatewayProxyEvent } from 'aws-lambda'
import getTrainersById from '../src/trainer/getTrainerByIdFn/getTrainerById'
import { trainer } from 'src/global/mockTable'

const input: unknown = { pathParameters: trainer }


getTrainersById(input as APIGatewayProxyEvent).then(res => console.log(res))