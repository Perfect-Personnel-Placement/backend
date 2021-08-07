import { APIGatewayProxyEvent } from 'aws-lambda'
import getAllBatches from '../src/batch/getAllBatchesFn/getAllBatches'

getAllBatches({} as APIGatewayProxyEvent).then(res => console.log(res))