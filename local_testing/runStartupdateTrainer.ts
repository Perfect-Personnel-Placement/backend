import { APIGatewayProxyEvent } from 'aws-lambda'
import updateTrainer from '../src/trainer/updateTrainerFn/updateTrainer'
import { trainer } from 'src/global/mockTable'

updateTrainer({ body: JSON.stringify(trainer) } as APIGatewayProxyEvent).then(res => console.log(res))