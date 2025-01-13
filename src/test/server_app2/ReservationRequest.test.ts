import { DataBase } from "../../app/server_app/data/DataBase";
import { Account } from "../../app/server_app/model/AuthModel";
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

const someReservation: Reservation = {
  id: "",
  room: "someRoom",
  user: "someUser",
  startDate: "someStartDate",
  endDate: "someEndDate",
};

const someToken = "1234";

const someId = "1234";

const jsonHeader = { "Content-Type": "application/json" };

describe("General - Reservation requests test suite", () => {
  const insertSpy = jest.spyOn(DataBase.prototype, "insert");
  const getBySpy = jest.spyOn(DataBase.prototype, "getBy");
  const getAllElementsSpy = jest.spyOn(DataBase.prototype, "getAllElements");
  const updateSpy = jest.spyOn(DataBase.prototype, "update");
  const deleteSpy = jest.spyOn(DataBase.prototype, "delete");

  beforeEach(() => {
    requestWrapper.headers["user-agent"] = "jest tests";
    requestWrapper.headers["authorization"] = someToken;
    // authenticate calles
    getBySpy.mockResolvedValueOnce({ valid: true });
  });

  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
    jest.clearAllMocks();
  });

  describe("POST requests", () => {
    test("Should create reservation from valid request", async () => {
      requestWrapper.method = HTTP_METHODS.POST;
      requestWrapper.body = someReservation;
      requestWrapper.url = "localhost:8080/reservation";
      insertSpy.mockResolvedValueOnce("1234");

      await new Server().startServer();

      await new Promise(process.nextTick); // solve timing issues

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
      expect(responseWrapper.headers).toContainEqual(jsonHeader);
      expect(responseWrapper.body).toEqual({ reservationId: "1234" });
    });

    test("Should not create reservation from a not authorized request", async () => {
      requestWrapper.method = HTTP_METHODS.POST;
      requestWrapper.body = someReservation;
      requestWrapper.url = "localhost:8080/reservation";
      getBySpy.mockReset();
      insertSpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();

      await new Promise(process.nextTick); // solve timing issues

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
      expect(responseWrapper.body).toEqual("Unauthorized operation!");
    });

    test("Should not create reservation from invalid request", async () => {
      requestWrapper.method = HTTP_METHODS.POST;
      requestWrapper.body = {};
      requestWrapper.url = "localhost:8080/reservation";

      insertSpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();

      await new Promise(process.nextTick); // solve timing issues

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseWrapper.body).toEqual("Incomplete reservation!");
    });

    test("Should not create reservation without authorization", async () => {
      requestWrapper.method = HTTP_METHODS.POST;
      requestWrapper.body = someReservation;
      requestWrapper.url = "localhost:8080/reservation";
      requestWrapper.headers["authorization"] = undefined;

      insertSpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();

      await new Promise(process.nextTick); // solve timing issues

      expect(responseWrapper.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
      expect(responseWrapper.body).toEqual("Unauthorized operation!");
      expect(getBySpy).not.toHaveBeenCalled();
    });

    describe("GET requests", () => {
      test("should return all reservations if authorized - GET", async () => {
        requestWrapper.method = HTTP_METHODS.GET;
        requestWrapper.url = "localhost:8080/reservation/all";
        getAllElementsSpy.mockResolvedValueOnce([someReservation]);

        await new Server().startServer();

        await new Promise(process.nextTick); // solve timing issues

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
        expect(responseWrapper.headers).toContainEqual(jsonHeader);
        expect(responseWrapper.body).toEqual([someReservation]);
      });

      it("should return specific reservations", async () => {
        requestWrapper.method = HTTP_METHODS.GET;
        requestWrapper.url = `localhost:8080/reservation/${someId}`;
        getBySpy.mockImplementation((table: string, id: string) => {
          if (table === "tokens") {
            return Promise.resolve({ valid: true });
          }
          if (table === "reservations") {
            return Promise.resolve(someReservation);
          }
          return Promise.resolve(undefined);
        });

        await new Server().startServer();

        await new Promise(process.nextTick); // this solves timing issues,

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.OK);
        expect(responseWrapper.body).toEqual(someReservation);
        expect(responseWrapper.headers).toContainEqual(jsonHeader);
      });

      //   describe("POST requests", () => {});
      //   describe("POST requests", () => {});
      //   describe("POST requests", () => {});

      //   test("should return all reservations if authorized - GET", async () => {
      //     requestWrapper.method = HTTP_METHODS.POST;
      //     requestWrapper.body = {
      //       userName: "someUserName",
      //       password: "somePassword",
      //     };
      //     requestWrapper.url = "localhost:8080/reservations/all";
      //     insertSpy.mockResolvedValueOnce(someToken);
      //     getBySpy.mockResolvedValueOnce(someAccount);

      //     await new Server().startServer();

      //     await new Promise(process.nextTick); // solve timing issues

      //     expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
      //     expect(responseWrapper.headers).toContainEqual(jsonHeader);
      //     expect(responseWrapper.body).toEqual({ token: someToken });
      //   });
    });
  });
});
