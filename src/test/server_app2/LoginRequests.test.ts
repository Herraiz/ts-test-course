import { DataBase } from "../../app/server_app/data/DataBase";
import { Account } from "../../app/server_app/model/AuthModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";

jest.mock("../../app/server_app/data/DataBase");

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();
const fakeServer = {
  listen: () => {},
  close: () => {},
};
jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestWrapper, responseWrapper);
    return fakeServer;
  },
}));

const someAccount: Account = {
  id: "",
  userName: "someUserName",
  password: "somePassword",
};

const someToken = "1234";

const jsonHeader = { "Content-Type": "application/json" };

describe("Login requests test suite", () => {
  const insertSpy = jest.spyOn(DataBase.prototype, "insert");
  const getBySpy = jest.spyOn(DataBase.prototype, "getBy");

  beforeEach(() => {
    requestWrapper.headers["user-agent"] = "jest tests";
  });

  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
    jest.clearAllMocks();
  });

  test("should login user with valid credentials", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {
      userName: "someUserName",
      password: "somePassword",
    };
    requestWrapper.url = "localhost:8080/login";
    insertSpy.mockResolvedValueOnce(someToken);
    getBySpy.mockResolvedValueOnce(someAccount);

    await new Server().startServer();

    await new Promise(process.nextTick); // solve timing issues

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseWrapper.headers).toContainEqual(jsonHeader);
    expect(responseWrapper.body).toEqual({ token: someToken });
  });

  test("should return error with valid credentials", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {
      userName: "someUserName",
      password: "notThePassword",
    };
    requestWrapper.url = "localhost:8080/login";
    insertSpy.mockResolvedValueOnce(someToken);
    getBySpy.mockResolvedValueOnce(someAccount);

    await new Server().startServer();

    await new Promise(process.nextTick); // solve timing issues

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseWrapper.body).toEqual("wrong username or password");
  });

  test("should return error login bad request", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {
      userName: "someUserName",
    };
    requestWrapper.url = "localhost:8080/login";
    insertSpy.mockResolvedValueOnce(someToken);
    getBySpy.mockResolvedValueOnce(someAccount);

    await new Server().startServer();

    await new Promise(process.nextTick); // solve timing issues

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseWrapper.headers).toContainEqual(jsonHeader);
    expect(responseWrapper.body).toEqual("userName and password required");
  });
});
