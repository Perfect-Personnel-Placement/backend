import { APIGatewayProxyEvent } from 'aws-lambda'
import getAllTrainers from '../src/trainer/getAllTrainersFn/getAllTrainers'

getAllTrainers({} as APIGatewayProxyEvent).then(res => console.log(res))