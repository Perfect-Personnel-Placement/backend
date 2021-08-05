import { APIGatewayProxyEvent } from 'aws-lambda';
import deleteCurriculum from '../src/curriculum/deleteCurriculumFn/deleteCurriculum';
const input: unknown = { pathParameters: { curriculumId: 8 } };

deleteCurriculum(input as APIGatewayProxyEvent).then((res) => console.log(res));
