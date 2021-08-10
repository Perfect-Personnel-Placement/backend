import  { SESClient }  from  "@aws-sdk/client-ses";
// Create SES service object.
const sesClient = new SESClient({});
export  { sesClient };