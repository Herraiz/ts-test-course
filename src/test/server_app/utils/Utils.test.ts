import { IncomingMessage } from "http";
import { getRequestBody } from "../../../app/server_app/utils/Utils";

const requestMock = {
  on: jest.fn(),
};

const someObject = {
  name: "someName",
  age: 42,
  city: "someCity",
};

const someoObjectString = JSON.stringify(someObject);

describe("getRequestBody test suite", () => {
  test("Should return object for valid JSON", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "data") {
        cb(someoObjectString);
      } else {
        cb();
      }
    });
    const actual = await getRequestBody(requestMock as any as IncomingMessage);

    expect(actual).toEqual(someObject);
  });

  test("Should throw an error for invalid JSON", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "data") {
        cb("a" + someoObjectString);
      } else {
        cb();
      }
    });

    // Important, this is async
    await expect(
      getRequestBody(requestMock as any as IncomingMessage)
    ).rejects.toThrow(
      'Unexpected token \'a\', "a{"name":""... is not valid JSON'
    );
  });

  test("Should error for unexpected error", async () => {
    const someError = new Error("Something went wrong");
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "error") {
        cb(someError);
      }
    });
    await expect(getRequestBody(requestMock as any)).rejects.toThrow(
      someError.message
    );
  });
});
