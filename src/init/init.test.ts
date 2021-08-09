jest.mock("../global/postgres", () => {
    return {
        connect: jest.fn(),
        query: jest.fn()
    }
});
jest.mock("fs", () => {
    return {
        readFileSync: jest.fn()
    }
});

import fs from "fs";
import pgClient from "../global/postgres";
import handler from "./init";

describe("Function handler for init database function", () => {
    it("Should run successfully without errors", async () => {
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
            return {
                toString: () => {return "bigfoot"}
            }
        });
        const response = await handler();
        expect(response.statusCode).toEqual(200);
    });

    it("Should fail gracefully if FS fails", async () => {
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {throw "error"});
        const response = await handler();
        expect(response.statusCode).toEqual(500);
    });

    it("Should fail gracefully if PG fails", async () => {
        (pgClient.query as jest.Mock).mockImplementationOnce(() => {throw "error"});
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
            return {
                toString: () => {return "bigfoot"}
            }
        });
        const response = await handler();
        expect(response.statusCode).toEqual(500);
    });
})