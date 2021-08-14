import { SESClient } from '@aws-sdk/client-ses';
// Create SES service object.
const sesClient = new SESClient({
  maxAttempts: 1,
});
export { sesClient };
