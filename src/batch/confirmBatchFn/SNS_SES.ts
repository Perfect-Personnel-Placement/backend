import { SendEmailCommand, SendEmailCommandInput, } from "@aws-sdk/client-ses"
import { snsClient } from "../../global/snsClient";
import { sesClient } from "../../global/sesClient";
import { PublishCommand, PublishCommandInput } from "@aws-sdk/client-sns";



export const sendEmailToTrainer = async (params: SendEmailCommandInput ) => {
    try {
        const data = await sesClient.send(new SendEmailCommand(params));
        console.log(data);
        console.log(data);
      } catch (err) {
        console.log("Error", err);
      }

}

export const sendMessageBySNS = async (publishParams: PublishCommandInput) => {
    try {
        const publishedData = await snsClient.send(new PublishCommand(publishParams));
        console.log("Success.", publishedData);
    } catch (err) {
        console.log("Error", err);
        
    }
}