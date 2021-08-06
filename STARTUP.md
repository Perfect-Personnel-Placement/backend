# Startup Guide for Developers

## Setup CodePipline

- **_!!! TO BE ADDED LATER !!!_**
- IF YOU SEE THIS IN MAIN, YELL AT MARC.

## Deploy SAM script

_Not needed if CodePipeline is setup._

SAM script is `template.yml`.
This will create the database, API Gateway, and Lambda functions.

- Install AWS SAM on your computer: See
  [AWS SAM documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Run the following commands:
  ```bash
  sam build
  sam deploy --guided
  ```

**_!!! WILL NEED REVISION WITH FINAL SAM SETUP !!!_**

NOTE: Once pipeline is setup, this will no longer be necessary.

## Setup the Database

- All scripts are in the folder `SQL Scripts`.
- Using a PostgreSQL client (such as DBeaver), connect to the created RDS.
- Run `Project 3 Backend Tables.sql` to create tables.
- Optionally run `Project 3 Backend Data.sql` put in dummy data for development.
- Database should end up looking like the SQL Diagram in the SQL Scripts folder.

NOTE: There is also a `Project 3 Backend Drop Tables.sql` if you need to reset
the database. **_Use with caution._**
