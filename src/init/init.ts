import pgClient from "../global/postgres";
import fs from "fs";
import { HTTPResponse } from "../global/objects";

// Written by JB
export default async function handler() {

    // Load the SQL script from file system
    let createScript = "";
    try {
        createScript = fs.readFileSync("/p3/handler/create.sql").toString();
    } catch (err) {
        console.log(err);
        return new HTTPResponse(500, {message: "Failed to load DB create script"});
    }

    // Run the SQL script on the database
    try {
        await pgClient.query(createScript);
    } catch (err) {
        console.log(err);
        return new HTTPResponse(500, {message: "Failed to run DB create script on RDS instance"});
    }

    // Indicate success
    return new HTTPResponse(200, {message: "Database initialized successfully"});

}

/**
 * A cautionary tale.
 * 
 * It would be much more elegant to run this function as a CloudFormation custom resource.
 * That way, it would run automatically during 'sam deploy' and you wouldn't have to ever think about it.
 * I spent a good 10 hours trying to get that method to work. Technically it did, but since
 * the lambda functions in this stack have no access to the larger internet, there was no way
 * for the lambda to send the HTTP request required to tell CloudFormation that the creation
 * or deletion of the custom resource was successful or not. I fiddled with nat gateways,
 * public subnets, internet gateways, and various different ways to send HTTP requests for
 * the better part of a weekend, but I could never get this specific lambda to send an HTTP request. 
 * The script was run on the database, but since the confirmation never came through to CloudFormation, 
 * you would have to wait an hour for the request to time out and then another hour to wait for the 
 * rollback delete request to time out. Why does CloudFormation expect an HTTP request? Why can't
 * the function just return the response that CloudFormation is looking for?
 * 
 * Can you guess how many times I had to wait those two hours?
 * 
 * I kinda wish Jeff Bezos had never been born.
 */