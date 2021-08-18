# Startup Guide for Developers

## Setup SES SMTP credentials for email sending in the Confirm Batch Handler

- Go to the AWS console (in the web browser)
- Go to the Simple Email Service (SES) dashboard
- Set up a verified identity w/ email you can send from, follow prompts
- Go to Account Dashboard, scroll down and click "Create SMTP Credentials"
- Replace the SMTP_USER and SMTP_PASS in the SAM Template with your new
  credentials

## Deploy SAM script

The SAM script is named `template.yml`.
This script will create the database, API Gateway, and Lambda functions.

- Install AWS SAM on your computer: See
  [AWS SAM documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Compile the TypeScript into JavaScript
  ```bash
  npm run build
  ```
- Build an ECR Repository
  - In the AWS Console (website), set up a private ECR repository.
- Run the following commands:

  ```bash
  sam build
  sam deploy --guided
  ```

  During `sam deploy --guided`, set the following options:

  - Stack Name: PerfectPersonnelPlacement
  - AWS Region: {your region}
  - For Image Repositories: can be the same for every lambda
  - Confirm changes before deploy: N
  - Allow SAM CLI IAM role creation: Y
  - For authorization not defined error: mark as ok with Y
  - Save arguments to configuration file: Y

  _The `--guided` flag can be omitted from future runs of `sam deploy`._

NOTE: Once the pipeline is set up, this setup will no longer be necessary.

## Setup the Database

- Use the newly created endpoint `/database/init`
- Sending a `POST` request with no additional information runs
  the `createTables.sql` script.
- Sending a `POST` request with the following body resets the table by running
  the `dropTables.sql` script followed by the `createTables.sql` script:
  ```JSON
  {
    refresh: true
  }
  ```
- Sending a `POST` request with the following body runs the `sampleData.sql`
  script after running the `createTables.sql` script:
  ```JSON
  {
    sampleData: true
  }
  ```
- Sending a `POST` request with the following body resets the table by running
  the `dropTables.sql` script followed by the `createTables.sql` script, then
  running the `sampleData.sql` script:
  ```JSON
  {
    refresh: true,
    sampleData: true
  }
  ```

Additional information:

- All scripts are in the folder `SQLScripts`.
- `createTables.sql` creates all of the tables needed in the database
- `sampleData.sql` puts in dummy data for development.
- Database should end up looking like the SQL Diagram in the SQL Scripts folder.

NOTE: There is also a `dropTables.sql` if you need to reset the database.
**_Use with caution._**

## Setup CodePipline

- Create a new pipeline in AWS. Accept defaults except as indicated below.
  Side Note: Configure as it makes sense for YOU. This document only outlines
  what we did.

### Choose Pipeline Settings

- Setup service role with necessary permissions.

### Add Source Stage

- Set the source provider to GitHub v2, connect to your PERSONAL GitHub, and
  manually type the account/repo-name. AWS will NOT autocomplete this for you.
- Select the main branch.

### Add Test Stage

- Build provider: AWS CodeBuild
- Region: we used US East (N. Virginia) - may vary
- Click "Create Project" and follow the prompts.
  - When creating this, change buildspec name to `buildspec-test.yml`

### Add Build Stage

- Build provider: AWS CodeBuild
- Region: we used US East (N. Virginia) - may vary
- Click "Create Project" and follow the prompts.

### Add Deploy Stage

- Skip

## Sonar Cloud Setup, Postman Documentation, and TypeDoc

- Sonar Cloud Settings are PDFS in the docs2 folder
- Postman documentation is available as a JSON in the docs2 folder
- The TypeDoc (JSDoc) generated HTML documentation is in the docs folder
