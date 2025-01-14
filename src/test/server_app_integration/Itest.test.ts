import { Account } from "../../app/server_app/model/AuthModel";
import { Reservation } from "../../app/server_app/model/ReservationModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { makeAwesomeRequest } from "./utils/http-client";

// No mocks, we're just testing things how they are

describe("Server app integration tests", () => {
  let server: Server;

  beforeAll(() => {
    server = new Server();
    server.startServer();
  });

  afterAll(() => {
    server.stopServer();
  });

  const someUser: Account = {
    id: "",
    userName: "someUserName",
    password: "somePassword",
  };

  const someReservation: Reservation = {
    id: "",
    endDate: "someEndDate",
    startDate: "someStartDate",
    room: "someRoom",
    user: "someUser",
  };

  const partialReservation: Partial<Reservation> = {
    startDate: "anotherStartDate",
    endDate: "anotherEndDate",
  };

  // We will need this variables to more tests
  let token: string;
  let createdReservationId: string;

  test("Should register new user", async () => {
    const result = await fetch("http://localhost:8080/register", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser),
    });
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody).toBeDefined();
  });

  test("Should register new user with awesomeResult", async () => {
    const result = await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/register",
      },
      someUser
    );

    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.userId).toBeDefined();
  });

  test("Should login a registered user", async () => {
    const result = await fetch("http://localhost:8080/login", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser),
    });
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody).toBeDefined();
    expect(resultBody.token).toBeDefined();
    token = resultBody.token;
  });

  test("Should create reservation if authorized", async () => {
    const result = await fetch("http://localhost:8080/reservation", {
      method: HTTP_METHODS.POST,
      headers: {
        "user-agent": "jest tests",
        authorization: token,
      },
      body: JSON.stringify(someReservation),
    });
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    // expect(resultBody.headers["Content-Type"]).toBe("application/json");
    expect(resultBody.reservationId).toBeDefined();
    createdReservationId = resultBody.reservationId;
  });

  test("Should get reservation if authorized", async () => {
    const result = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          "user-agent": "jest tests",
          authorization: token,
        },
      }
    );
    const resultBody = await result.json();

    const expectedReservation = {
      ...someReservation,
      id: createdReservationId,
    };

    expect(result.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toEqual(expectedReservation);
  });

  test("Should create and retrieve multiple reservations", async () => {
    for (let i = 0; i < 3; i++) {
      await fetch("http://localhost:8080/reservation", {
        method: HTTP_METHODS.POST,
        headers: {
          "user-agent": "jest tests",
          authorization: token,
        },
        body: JSON.stringify(someReservation),
      });
    }

    const getAllResult = await fetch("http://localhost:8080/reservation/all", {
      method: HTTP_METHODS.GET,
      headers: {
        "user-agent": "jest tests",
        authorization: token,
      },
    });

    const resultBody = await getAllResult.json();

    expect(getAllResult.status).toBe(HTTP_CODES.OK);
    expect(resultBody.length).toBe(4);
  });

  test("Should update reservation if authorized", async () => {
    const result = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.PUT,
        headers: {
          "user-agent": "jest tests",
          authorization: token,
        },
        body: JSON.stringify(partialReservation),
      }
    );
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toEqual(
      `Updated ${Object.keys(
        partialReservation
      )} of reservation ${createdReservationId}`
    );

    // We can also check if the reservation was updated
    const updatedReservationResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          "user-agent": "jest tests",
          authorization: token,
        },
      }
    );
    const updatedReservation = await updatedReservationResult.json();
    // console.log("updatedReservation", updatedReservation);
    expect(updatedReservation.startDate).toBe(partialReservation.startDate);
  });

  test("Should delete a reservation if authorized", async () => {
    const result = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.DELETE,
        headers: {
          "user-agent": "jest tests",
          authorization: token,
        },
        body: JSON.stringify(partialReservation),
      }
    );
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toEqual(
      `Deleted reservation with id ${createdReservationId}`
    );

    const deletedReservation = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          "user-agent": "jest tests",
          authorization: token,
        },
      }
    );

    expect(deletedReservation.status).toBe(HTTP_CODES.NOT_fOUND);
  });
});
