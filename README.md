# Perfect Personnel Placement Backend

![Built and Deployed by SAM](https://img.shields.io/badge/BUILT%20%26%20DEPLOYED%20BY-SAM-orange?style=for-the-badge&logo=amazonaws)
![Serverless Stack](https://img.shields.io/badge/SERVERLESS%20STACK-CLOUDFORMATION-orange?style=for-the-badge&logo=amazonaws)
![CI/CD by AWS CodePipeline](https://img.shields.io/badge/CI%2FCD-CODEPIPELINE-orange?style=for-the-badge&logo=amazonaws)

NOTE: This repo only contains the back-end of our project.
The interface used can be found at
[Perfect-Personnel-Placement/frontend](https://github.com/Perfect-Personnel-Placement/frontend).

## Project Description

The Serverless Training planner is a serverless mobile app that Revature
managers can use to look at important information regarding clientele demands
and batch output for the company. This service visualizes all current
batches planned along with any associated information. It also visualizes that
batch output alongside the client demand for associates. Managers may input
information for clients, their demands, and batches which consist of a
curriculum composed of skills, the number of associates, a trainer, and the
dates for the batch. This service helps ease the management of supply and demand
for the company and is an organizational aid.

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
- Jest

## Getting Started

See STARTUP.md (in the current folder) for instructions on how to get the
application up and running.
Once running, use according to the instructions below.

Potential improvements have been noted in IMPROVE.md (in the current folder).

## Features & Usage

The following API calls can be made. The list below applies to ALL endpoints:

- A `:` in front of a portion of the path means to replace that section with
  your desired value.
- Unless otherwise indicated, no body should be included.
- All request/response bodies must be in JSON.
- Any dates must be sent as a string in
  [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
  For example, Friday 6 August 2021 would be sent as `'2021-08-06'`.

### HTTP Codes to Expect

| Code | Meaning               | Usage                                                                                                                                                                                            |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200  | OK                    | Should be returned on everything but `POST` requests                                                                                                                                             |
| 201  | Created               | Should only be returned on `POST` requests)                                                                                                                                                      |
| 400  | Bad Request           | Will be returned if there is an error with your syntax, an error in the types you used in the body of the message, or if you violated a database constraint (such as a foreign key relationship) |
| 500  | Internal Server Error | Will be returned if the database is unreachable                                                                                                                                                  |

_Any code returned not in this list indicates that something has gone wrong._

### Batch

- `GET` to `/batch` will get all batches
- `POST` to `/batch` will create a new batch (will be unconfirmed);
  requires the following body:
  ```JSON
  {
    "batchSize": number,
    "curriculumId": number,
    "endDate": string,
    "startDate": string,
    "trainerId": number | null,
    "clientId": number | null,
  }
  ```
- `PUT` to `/batch` will update an existing batch;
  requires the following body:
  ```JSON
  {
    "batchSize": number,
    "batchId": number,
    "curriculumId": number,
    "endDate": string,
    "startDate": string,
    "trainerId": number | null,
    "clientId": number | null,
  }
  ```
- `GET` to `/batch/curriculum/:curriculumId` will get all batches
  with the specified curriculum
- `GET` to `/batch/id/:batchId` will get the batch with the specified ID
- `PATCH` to `/batch/id/:batchId` will confirm a batch.
  (Note: Make sure a trainer has been assigned to a batch first.
  The `PUT` to `/batch` request can be used for this if necessary.)
- `DELETE` to `/batch/id/:batchId` will delete the specified batch
- `GET` to `/batch/trainer/:trainerId` will get all the batches assigned
  to a specified trainer

### Client

- `GET` to `/client` will get all clients
- `POST` to `/client` will create a new client;
  requires the following body:
  ```JSON
  {
    "clientName": string
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
    "skillIdArr": number[]
  }
  ```
- `GET` to `/curriculum/id/:curriculumId` will get a specific curriculum
- `DELETE` to `/curriculum/id/:curriculumId` will delete a specific curriculum

### Demand (number of associates requested per curriculum)

- `GET` to `/demand` will get all demands
- `POST` to `/demand` will create a new demand;
  requires the following body:
  ```JSON
  {
    "clientid": number,
    "curriculumid": number,
    "needby": string,
    "quantitydemanded": number
  }
  ```
- `GET` to `/demand/client/:clientId` will get all demand from a specific client
- `GET` to `/demand/curriculum/:curriculumId` will get all demand for a specific
  curriculum
- `GET` to `/demand/curriculum/:curriculumId/:startDate/:endDate` will get all
  demand for a specific curriculum within the specified date range
- `GET` to `/demand/date/:startDate/:endDate` will get all demand within the
  specified date range
- `GET` to `/demand/id/:demandId` will get a specific demand

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
    "trainerlast": string,
    "curriculaIdArr": number[]
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

[![MIT](https://img.shields.io/github/license/RevatureRobert/2106Jun07RNCN-2-p2-be?style=for-the-badge)](https://github.com/Perfect-Personnel-Placement/backend/blob/cce792fb7b2227d101d330f048cc7a3d8ff762ec/LICENSE)
