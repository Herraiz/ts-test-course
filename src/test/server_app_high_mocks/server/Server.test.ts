import { Server } from "../../../app/server_app/server/Server";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { HTTP_CODES } from "../../../app/server_app/model/ServerModel";

jest.mock("../../../app/server_app/auth/Authorizer");
jest.mock("../../../app/server_app/data/ReservationsDataAccess");
jest.mock("../../../app/server_app/handlers/LoginHandler");
jest.mock("../../../app/server_app/handlers/RegisterHandler");
jest.mock("../../../app/server_app/handlers/ReservationsHandler");

const requestMock = {
  url: "",
  headers: {
    "user-agent": "jest-test",
  },
};

const responseMock = {
  end: jest.fn(),
  writeHead: jest.fn(),
};

const serverMock = {
  listen: jest.fn(),
  close: jest.fn(),
};

// const serverMock = {
//   listen: jest.fn(),
//   close: jest.fn((callback) => callback()),
// };

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestMock, responseMock);
    return serverMock;
  },
}));

describe("Server test suite", () => {
  let sut: Server;

  beforeEach(() => {
    sut = new Server();
    expect(Authorizer).toHaveBeenCalledTimes(1);
    expect(ReservationsDataAccess).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should start server on port 8080 and end the request", async () => {
    await sut.startServer();

    expect(serverMock.listen).toHaveBeenCalledWith(8080);

    console.log("time called res.end()");
    expect(responseMock.end).toHaveBeenCalledTimes(1);
  });

  test("Should handle register request", async () => {
    requestMock.url = "localhost:8080/register";
    // We need to call handleRequest() con RequestHandler:
    const handleRequestSpy = jest.spyOn(
      RegisterHandler.prototype,
      "handleRequest"
    );

    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(RegisterHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  test("Should handle login request", async () => {
    requestMock.url = "localhost:8080/login";
    // We need to call handleRequest() con LoginHandler:
    const handleRequestSpy = jest.spyOn(
      LoginHandler.prototype,
      "handleRequest"
    );

    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(LoginHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  test("Should handle reservations request", async () => {
    requestMock.url = "localhost:8080/reservation";
    // We need to call handleRequest() con ReservationsHandler:
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );

    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(ReservationsHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer),
      expect.any(ReservationsDataAccess)
    );
  });

  test("Should not handle invalid route request", async () => {
    requestMock.url = "localhost:8080/test";
    const validateTokenSpy = jest.spyOn(Authorizer.prototype, "validateToken");

    await sut.startServer();

    expect(validateTokenSpy).not.toHaveBeenCalled();
  });

  test("Should send text error if error catched", async () => {
    requestMock.url = "localhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    handleRequestSpy.mockRejectedValueOnce(new Error("Some error"));

    await sut.startServer();

    expect(responseMock.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      JSON.stringify("Internal server error: Some error")
    );
  });

  it("should stop the server if started", async () => {
    serverMock.close.mockImplementationOnce((cb: Function) => {
      cb();
    });
    await sut.startServer();
    await sut.stopServer();
    expect(serverMock.close).toHaveBeenCalledTimes(1);
  });

  it("should reject closing server if error", async () => {
    const mockError = new Error("error closing server");
    serverMock.close.mockImplementationOnce((cb: Function) => {
      cb(mockError);
    });

    await sut.startServer();
    await expect(sut.stopServer()).rejects.toThrow("error closing server");

    expect(serverMock.close).toHaveBeenCalledTimes(1);
  });
});
