import { APIGatewayProxyEvent } from 'aws-lambda';
import getCurriculum from '../src/curriculum/getCurriculumFn/getCurriculum';
const input: unknown = { pathParameters: { curriculumId: 2 } };

getCurriculum(input as APIGatewayProxyEvent).then((res) => console.log(res));
