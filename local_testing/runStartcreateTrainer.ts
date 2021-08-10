import { APIGatewayProxyEvent } from 'aws-lambda'
import createTrainer from '../src/trainer/createTrainerFn/createTrainer'
import { trainer } from '../src/global/mockTable'

createTrainer({ body: JSON.stringify(trainer) } as APIGatewayProxyEvent)