import { APIGatewayProxyEvent } from 'aws-lambda'
import createSkill from '../src/skill/createSkillFn/createSkill';
import { skill } from '../src/global/mockTable'

createSkill({ body: JSON.stringify(skill) } as APIGatewayProxyEvent)