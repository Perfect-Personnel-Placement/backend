# Potential Improvements (in no particular order)

[ ] Refactor back-end to be more modular (separate out HTTP error checks into global functions). However, this may not be desirable. Consult https://medium.com/@john_freeman/querying-data-across-microservices-8d7a4667668a as it may be helpful and make a decision as a group.

[ ] Consider connecting to the database outside the Lambda handler. Need to research AWS DB connect for more information. This would increase performance.

[ ] Add Cognito authentication (coordinate with front-end?)
