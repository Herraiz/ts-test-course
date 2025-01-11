import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../app/server_app/model/ServerModel";
import { Reservation } from "../../../app/server_app/model/ReservationModel";

const isOperationAuthorized = jest.fn();

const getRequestBody = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => {
  return {
    isOperationAuthorized: () => isOperationAuthorized(),
    getRequestBody: () => getRequestBody(),
  };
});

describe("ReservationsHandler test suite", () => {
  let sut: ReservationsHandler;

  const request = {
    method: undefined,
    headers: {
      authorization: undefined,
    },
    url: undefined,
  };

  const someId = "1234";

  const someReservation: Reservation = {
    id: "1234",
    room: "1234",
    user: "1234",
    startDate: "someDate",
    endDate: "someDate",
  };

  const responseMock = {
    statusCode: 0,
    write: jest.fn(),
    writeHead: jest.fn(),
  };

  const authorizerMock = {
    validateToken: jest.fn(),
  };

  const reservationsDataAccessMock = {
    createReservation: jest.fn(),
    getAllReservations: jest.fn(),
    getReservation: jest.fn(),
    updateReservation: jest.fn(),
    deleteReservation: jest.fn(),
  };

  beforeEach(() => {
    sut = new ReservationsHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer,
      reservationsDataAccessMock as any as ReservationsDataAccess
    );

    (sut as any).isValidPartialReservation = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return false if operation if not tokenId", async () => {
    request.headers.authorization = undefined;
    const actual = await (sut as any).isOperationAuthorized();

    expect(actual).toBe(false);
  });

  test("Should return false if operation don't have a valid tokenId", async () => {
    request.headers.authorization = someId;
    isOperationAuthorized.mockResolvedValueOnce(false);
    authorizerMock.validateToken.mockResolvedValueOnce(false);
    const tokenId = await isOperationAuthorized();

    const actual = await authorizerMock.validateToken(tokenId);

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(tokenId);
    expect(actual).toBe(false);
  });

  test("Should return true if operation have a valid tokenId", async () => {
    request.headers.authorization = someId;
    isOperationAuthorized.mockResolvedValueOnce(true);
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    const tokenId = await isOperationAuthorized();

    const actual = await authorizerMock.validateToken(tokenId);

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(tokenId);
    expect(actual).toBe(true);
  });

  test("Should return error if operation is unauthorized", async () => {
    request.headers.authorization = someId;
    authorizerMock.validateToken.mockResolvedValueOnce(false);
    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("Unauthorized operation!")
    );
  });

  // ************ POST ************

  test("Should return error if post method with a incomplete reservation", async () => {
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.POST;
    authorizerMock.validateToken.mockResolvedValueOnce(true);

    const response = getRequestBody.mockResolvedValueOnce(request);

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("Incomplete reservation!")
    );
  });

  test("Should return false for invalid reservation", () => {
    const invalidReservation: any = {};

    const actual = (sut as any).isValidReservation(invalidReservation);
    expect(actual).toBe(false);
  });

  test("Should write reservationId if post method with a valid reservation", async () => {
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.POST;
    authorizerMock.validateToken.mockResolvedValueOnce(true);

    const requestBody = someReservation;

    getRequestBody.mockResolvedValueOnce(requestBody);

    await sut.handleRequest();

    const reservationId =
      reservationsDataAccessMock.createReservation.mockResolvedValueOnce(
        "newReservationId"
      );

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);

    expect(reservationsDataAccessMock.createReservation).toHaveBeenCalledTimes(
      1
    );
    expect(reservationsDataAccessMock.createReservation).toHaveBeenCalledWith(
      requestBody
    );
    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify({ reservationId })
    );
  });

  // ************ FINISH POST TESTS ************

  // ************ GET ************

  test("Should write allReservations if get method with id all", async () => {
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.GET;
    request.url = "/reservations/all";
    authorizerMock.validateToken.mockResolvedValueOnce(true);

    const allReservations = [someReservation];
    reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce(
      allReservations
    );

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(reservationsDataAccessMock.getAllReservations).toHaveBeenCalledTimes(
      1
    );
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify(allReservations)
    );
  });

  test("Should return error if get method without id", async () => {
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.GET;
    request.url = "/reservations";
    authorizerMock.validateToken.mockResolvedValueOnce(true);

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("Please provide an ID!")
    );
  });

  test("Should return error if get method with id is not a valid reservation id", async () => {
    const invalidId = "1234567";
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.GET;
    request.url = `/reservations/${invalidId}`;
    authorizerMock.validateToken.mockResolvedValueOnce(true);

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify(`Reservation with id ${invalidId} not found`)
    );
  });

  test("Should write reservation if get method with valid reservation id", async () => {
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.GET;
    request.url = `/reservations/${someReservation.id}`;
    authorizerMock.validateToken.mockResolvedValueOnce(true);

    const reservation = someReservation;
    reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
      reservation
    );

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(reservationsDataAccessMock.getReservation).toHaveBeenCalledTimes(1);
    expect(reservationsDataAccessMock.getReservation).toHaveBeenCalledWith(
      someReservation.id
    );
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify(reservation)
    );
  });

  // ************ FINISH GET TESTS ************

  // ************ PUT ************

  test("Should return error if put method with no id", async () => {
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.PUT;
    request.url = "/reservations/"; // no id
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    const id = (sut as any).getIdFromUrl();

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);

    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("Please provide an ID!")
    );
  });

  test("Should return error if put method a invalid reservation id", async () => {
    const invalidId = "1234567";
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.PUT;
    request.url = `/reservations/${invalidId}`;
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    const id = (sut as any).getIdFromUrl();

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify(`Reservation with id ${invalidId} not found`)
    );
  });

  test("Should return error if put method with a invalid partial reservation", async () => {
    const invalidReservation = {};
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.PUT;
    request.url = `/reservations/${someId}`;
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
      someReservation
    );

    getRequestBody.mockResolvedValueOnce(
      invalidReservation as any as Reservation
    );

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);

    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("Please provide valid fields to update!")
    );
  });

  test("Should return 200 and updated reservation info if put method with valid partial reservation", async () => {
    const partialReservation = {
      room: "newRoom",
      user: "newUser",
    };
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.PUT;
    request.url = `/reservations/${someId}`;
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
      partialReservation as Partial<Reservation>
    );

    getRequestBody.mockResolvedValueOnce(partialReservation);

    (sut as any).isValidPartialReservation.mockReturnValueOnce(true);

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);

    expect(reservationsDataAccessMock.getReservation).toHaveBeenCalledTimes(1);
    expect(reservationsDataAccessMock.getReservation).toHaveBeenCalledWith(
      someId
    );

    expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledTimes(
      2
    );
    expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(
      someId,
      "room",
      partialReservation.room
    );
    expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(
      someId,
      "user",
      partialReservation.user
    );
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify(
        `Updated ${Object.keys(partialReservation)} of reservation ${someId}`
      )
    );
  });

  // ************ FINISH PUT TESTS ************

  // ************ DELETE ************

  test("Should return error if delete method with no id", async () => {
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.DELETE;
    request.url = "/reservations/"; // no id
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    const id = (sut as any).getIdFromUrl();

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("Please provide an ID!")
    );
  });
  test("Should return 200 and deleted id of message if delete method with id", async () => {
    const correctId = "5678";
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.DELETE;
    request.url = `/reservations/${correctId}`;
    authorizerMock.validateToken.mockResolvedValueOnce(true);
    const id = (sut as any).getIdFromUrl();

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify(`Deleted reservation with id ${id}`)
    );
  });

  // ************ FINISH DELETE TESTS ************

  test("Should return false if partial reservation if empty", async () => {
    const partialReservation = {};
    // Remove the mock to use the real implementation
    delete (sut as any).isValidPartialReservation;
    const actual = (sut as any).isValidPartialReservation(
      partialReservation as Partial<Reservation>
    );
    expect(actual).toBe(false);
  });

  test("Should return false if has not valid keys on partial reservation", async () => {
    const partialReservationWithInvalidKeys = {
      invalidKey: "invalidValue",
    };
    delete (sut as any).isValidPartialReservation;
    const actual = (sut as any).isValidPartialReservation(
      partialReservationWithInvalidKeys as Partial<Reservation>
    );
    expect(actual).toBe(false);
  });

  test("Should return true if has right keys on partial reservation", async () => {
    const partialReservation = {
      endDate: "someDate",
    };
    delete (sut as any).isValidPartialReservation;
    const actual = (sut as any).isValidPartialReservation(
      partialReservation as Partial<Reservation>
    );
    expect(actual).toBe(true);
  });

  test("Should not process request if method is not post, get, put or delete", async () => {
    request.headers.authorization = someId;
    request.method = HTTP_METHODS.OPTIONS;
    authorizerMock.validateToken.mockResolvedValueOnce(true);

    await sut.handleRequest();

    expect(authorizerMock.validateToken).toHaveBeenCalledTimes(1);
    expect(authorizerMock.validateToken).toHaveBeenCalledWith(someId);
    expect(responseMock.writeHead).not.toHaveBeenCalled();
    expect(responseMock.write).not.toHaveBeenCalled();
  });
});
