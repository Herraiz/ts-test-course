import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { IncomingMessage, ServerResponse } from "http";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../app/server_app/model/ServerModel";
import { Account } from "../../../app/server_app/model/AuthModel";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => {
  return {
    getRequestBody: () => getRequestBodyMock(),
  };
});

let sut: LoginHandler;

const request = {
  method: undefined,
  userName: undefined,
  password: undefined,
};

const responseMock = {
  statusCode: 0,
  writeHead: jest.fn(),
  write: jest.fn(),
};

const authorizerMock = {
  login: jest.fn(),
};

const someAccount: Account = {
  id: "",
  userName: "someUserName",
  password: "somePassword",
};

const accountWithNoUserName: Account = {
  id: "",
  userName: "",
  password: "somePassword",
};

const accountWithNoPassword: Account = {
  id: "",
  userName: "someUserName",
  password: "",
};

const someId = "1234";

beforeEach(() => {
  sut = new LoginHandler(
    request as any as IncomingMessage,
    responseMock as any as ServerResponse,
    authorizerMock as any as Authorizer
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("LoginHandler test suite", () => {
  test("Should return error text if invalid user", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(accountWithNoUserName);
    await sut.handleRequest();
    expect(request.userName).toBeUndefined();
    // maybe we need to check if the password toBeDefined?
    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.BAD_REQUEST,
      {
        "Content-Type": "application/json",
      }
    );
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("userName and password required")
    );
  });

  test("Should return error text if invalid password", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(accountWithNoPassword);
    await sut.handleRequest();
    expect(request.password).toBeUndefined();
    // maybe we need to check if the password toBeDefined?
    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.BAD_REQUEST,
      {
        "Content-Type": "application/json",
      }
    );
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("userName and password required")
    );
  });

  test("Should return token if valid user", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(someId);

    await sut.handleRequest();

    expect(authorizerMock.login).toHaveBeenCalledWith(
      someAccount.userName,
      someAccount.password
    );
    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify({ token: someId })
    );
  });

  test("Should not return token if invalid user", async () => {
    request.method = HTTP_METHODS.POST;
    const invalidAccount = {
      userName: "invalidUser",
      password: "invalidPassword",
    };
    getRequestBodyMock.mockResolvedValueOnce(invalidAccount);
    authorizerMock.login.mockResolvedValueOnce(undefined);

    await sut.handleRequest();

    expect(authorizerMock.login).toHaveBeenCalledWith(
      invalidAccount.userName,
      invalidAccount.password
    );

    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("wrong username or password")
    );
    expect(responseMock.write).not.toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String) })
    );
  });

  test("Should return error message if no user or password provided", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce({});
    await sut.handleRequest();
    expect(getRequestBodyMock).toHaveBeenCalledTimes(1);
  });

  test("Should return nothing if invalid method", async () => {
    request.method = HTTP_METHODS.GET;
    await sut.handleRequest();

    expect(responseMock.writeHead).not.toHaveBeenCalled();
    expect(responseMock.write).not.toHaveBeenCalled();
    expect(getRequestBodyMock).not.toHaveBeenCalled();
  });
});
