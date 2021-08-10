import  { SNSClient } from "@aws-sdk/client-sns";
// Create SNS service object.
const snsClient = new SNSClient({});
export  { snsClient };
