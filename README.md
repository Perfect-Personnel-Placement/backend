# Perfect Personnel Placement Backend

![Built and Deployed by SAM](https://img.shields.io/badge/BUILT%20%26%20DEPLOYED%20BY-SAM-orange?style=for-the-badge&logo=amazonaws)
![Serverless Stack](https://img.shields.io/badge/SERVERLESS%20STACK-CLOUDFORMATION-orange?style=for-the-badge&logo=amazonaws)
![CI/CD by AWS CodePipeline](https://img.shields.io/badge/CI%2FCD-CODEPIPELINE-orange?style=for-the-badge&logo=amazonaws)

NOTE: This repo only contains the back-end of our project.
The interface used can be found at
[Perfect-Personnel-Placement/frontend](https://github.com/Perfect-Personnel-Placement/frontend).

## Project Description

## Technologies Used

- AWS SAM
- AWS CloudFormation
- AWS Lambda
- AWS API Gateway
- AWS S3
- AWS CodePipeline
- AWS RDS
- PostgreSQL
- NodeJS
- Jest (w/ Dynalite)

## Features

## Getting Started

## Usage

The following API calls can be made. The list below applies to ALL endpoints:

- A `:` in front of a portion of the path means to replace that section with
  your desired value.
- Unless otherwise indicated, no body should be included.
- All request/response bodies must be in JSON.
- Any dates must be sent as a string in
  [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
  For example, Friday 6 August 2021 would be sent as `'2021-08-06'`.

### Batch

### Client

- `GET` to `/client` will get all clients
- `POST` to `/client` will create a new client;
  requires the following body:
  ```JSON
  {
    "clientname": string
  }
  ```
- `GET` to `/client/id/:clientId` will get a specific client by id
- `GET` to `/client/name/:clientName` will get a specific client by name

### Curriculum

- `GET` to `/curriculum` will get all curricula
- `POST` to `/curriculum` will create a new curriculum;
  requires the following body:
  ```JSON
  {
    "createdby": string,
    "createdon": string (in ISO 8601 format -- see above),
    "curriculumname": string,
  }
  ```
- `GET` to `/curriculum/id/:curriculumId` will get a specific curriculum
- `DELETE` to `/curriculum/id/:curriculumId` will delete a specific curriculum

### Demand

### Skill

- `GET` to `/skill` will get all skills
- `POST` to `/skill` will create a new skill;
  requires the following body:
  ```JSON
  {
    "skillName": string
  }
  ```
- `GET` to `/skill/id/:skillId` will get a specific skill by id
- `DELETE` to `/skill/id/:skillId` will delete a specific skill
- `GET` to `/skill/name/:skillName` will get a specific skill by name

### Trainer

- `GET` to `/trainer` will get all trainers
- `POST` to `/trainer` will create a new trainer;
  requires the following body:
  ```JSON
  {
    "email": string,
    "trainerfirst": string,
    "trainerlast": string
  }
  ```
- `PUT` to `/trainer` will update a trainer's information;
  requires the following body:
  ```JSON
  {
    "trainerid": number,
    "email": string,
    "trainerfirst": string,
    "trainerlast": string
  }
  ```
- `GET` to `/trainer/id/:trainerId` will get the information about
  a specific trainer
- `DELETE` to `/trainer/id/:trainerId` will delete a specific trainer
- `GET` to `/trainer/firstname/:trainerFirstName` will get all trainers with
  the requested first name
- `GET` to `/trainer/lastname/:trainerLastName` will get all trainers with
  the requested last name

## Contributors

- [Jared Burkamper](https://github.com/Drelek)
- [Daguinson Fleurantin](https://github.com/Dague04)
- [Mohamed Hassan](https://github.com/MohamedOne)
- [Brandon Kirsch](https://github.com/Brandon-Kirsch)
- [Jacob Kula](https://github.com/J19kula)
- [Marc Skwarczynski](https://github.com/marcski55)
- [Samuel Smetzer](https://github.com/Kamuela96)
- [Matthew Terry](https://github.com/mat2718)
- [Nick Wang](https://github.com/nickwanguu)
- [Tyler Yates](https://github.com/YTyler)

## License

[![MIT](https://img.shields.io/github/license/RevatureRobert/2106Jun07RNCN-2-p2-be?style=for-the-badge)](https://github.com/RevatureRobert/2106Jun07RNCN-2-p2-be/blob/417cce5cafa0f36f638b138d9709e1a17a31215a/LICENSE)
