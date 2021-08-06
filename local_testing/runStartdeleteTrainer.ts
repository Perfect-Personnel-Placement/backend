import { APIGatewayProxyEvent } from 'aws-lambda'
import deleteTrainer from '../src/trainer/deleteTrainerFn/deleteTrainer'
import { trainer } from 'src/global/mockTable'

const input: unknown = { pathParameters: trainer }
deleteTrainer(input as APIGatewayProxyEvent).then(res => console.log(res))