jest.mock("../../global/postgres");
import client from "../../global/postgres";
import { demand } from "../../global/mockTable";
import { APIGatewayProxyEvent } from "aws-lambda";
import handler from "./getDemandByDate";
const input: unknown = {
  pathParameters: {
    start: new Date("7/4/2021").toISOString().substring(0, 10),
    end: new Date("8/12/2021").toISOString().substring(0, 10),
  },
};

// Written by NW
describe("Testing GetDemandByDate  Handler", () => {
  it("should succeed with status code 200", async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      return { rows: demand }; // look into mockReturn
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(200);
  });

  it("should fail with 400, from a pathparmaters is null", async () => {
    const res = await handler({} as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });

  it("should fail with 400, from an unknown database query error", async () => {
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw "error";
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
  it("should fail with 400, from a database query error", async () => {
    const err = { detail: "normal error from testing" };
    (client.query as jest.Mock).mockImplementationOnce(() => {
      throw err;
    });
    const res = await handler(input as APIGatewayProxyEvent);
    expect(res.statusCode).toEqual(400);
  });
});
