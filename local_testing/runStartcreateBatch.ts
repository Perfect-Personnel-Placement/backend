import { APIGatewayProxyEvent } from 'aws-lambda'
import createBatch from '../src/batch/createBatchFn/createBatch'
import * as batch from '../src/global/mockTable'

createBatch({ body: JSON.stringify(batch) } as APIGatewayProxyEvent)