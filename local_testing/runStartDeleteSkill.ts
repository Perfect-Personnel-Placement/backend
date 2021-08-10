import { APIGatewayProxyEvent } from 'aws-lambda'
import deleteSkill from '../src/skill/deleteSkillFn/deleteSkill';
import { skill } from '../src/global/mockTable'
const input: unknown = { pathParameters: skill }

deleteSkill(input as APIGatewayProxyEvent).then(res => console.log(res))