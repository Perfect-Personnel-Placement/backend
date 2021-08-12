import { APIGatewayProxyEvent } from 'aws-lambda';
import insertCurriculum from '../src/curriculum/insertCurriculumFn/insertCurriculum';
import { curriculum } from '../src/global/mockTable';

insertCurriculum({
  body: JSON.stringify(curriculum)
} as APIGatewayProxyEvent).then((res) => console.log(res));
