import confirmBatch from '../src/batch/confirmBatchFn/confirmBatch';
import { APIGatewayProxyEvent } from 'aws-lambda';

const input: unknown = { pathParameters: { batchId: 789 } };

confirmBatch(input as APIGatewayProxyEvent).then((res) => console.log(res));
