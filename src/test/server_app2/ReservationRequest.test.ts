import { DataBase } from "../../app/server_app/data/DataBase";
import { Reservation } from "../../app/server_app/model/ReservationModel";
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
  createServer: (cb: any) => {
    cb(requestWrapper, responseWrapper);
    return fakeServer;
  },
}));

const someReservation: Reservation = {
  id: "",
  endDate: "someEndDate",
  startDate: "someStartDate",
  room: "someRoom",
  user: "someUser",
};

const someId = "someId";

const jsonHeader = { "Content-Type": "application/json" };

describe("Reservation requests", () => {
  const insertSpy = jest.spyOn(DataBase.prototype, "insert");
  const getBySpy = jest.spyOn(DataBase.prototype, "getBy");
  const getAllElementsSpy = jest.spyOn(DataBase.prototype, "getAllElements");
  const updateSpy = jest.spyOn(DataBase.prototype, "update");
  const deleteSpy = jest.spyOn(DataBase.prototype, "delete");

  beforeEach(() => {
    requestWrapper.headers["user-agent"] = "jest tests";
    requestWrapper.headers["authorization"] = "someToken";
    // authenticate calls:
    getBySpy.mockResolvedValueOnce({
      valid: true,
    });
  });

  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
    jest.clearAllMocks();
  });

  describe("POST requests", () => {
    test("should create reservation from valid request", async () => {
      requestWrapper.method = HTTP_METHODS.POST;
      requestWrapper.body = someReservation;
      requestWrapper.url = "localhost:8080/reservation";
      insertSpy.mockResolvedValueOnce(someId);

      await new Server().startServer();

      await new Promise(process.nextTick); // this solves timing issues,

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
      expect(responseWrapper.body).toEqual({
        reservationId: someId,
      });
      expect(responseWrapper.headers).toContainEqual(jsonHeader);
    });

    test("should not create reservation from invalid request", async () => {
      requestWrapper.method = HTTP_METHODS.POST;
      requestWrapper.body = {};
      requestWrapper.url = "localhost:8080/reservation";

      await new Server().startServer();

      await new Promise(process.nextTick); // this solves timing issues,

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseWrapper.body).toEqual("Incomplete reservation!");
    });
  });

  describe("GET requests", () => {
    test("should return all reservations", async () => {
      requestWrapper.method = HTTP_METHODS.GET;
      requestWrapper.url = "localhost:8080/reservation/all";
      getAllElementsSpy.mockResolvedValueOnce([
        someReservation,
        someReservation,
      ]);

      await new Server().startServer();

      await new Promise(process.nextTick); // this solves timing issues,

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(responseWrapper.body).toEqual([someReservation, someReservation]);
      expect(responseWrapper.headers).toContainEqual(jsonHeader);
    });

    test("should return specific reservations", async () => {
      requestWrapper.method = HTTP_METHODS.GET;
      requestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(someReservation);

      await new Server().startServer();

      await new Promise(process.nextTick); // this solves timing issues,

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(responseWrapper.body).toEqual(someReservation);
      expect(responseWrapper.headers).toContainEqual(jsonHeader);
    });
  });
});
