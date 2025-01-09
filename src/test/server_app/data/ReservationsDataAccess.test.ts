import { DataBase } from "../../../app/server_app/data/DataBase";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { Reservation } from "../../../app/server_app/model/ReservationModel";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";

// We need to mock the DataBase class, because the consumer class ReservationsDataAccess is a type of DataBase
// We need also to mock the methods used by the consumer class, in this case insert, update, delete, getBy and getAllElements

const insertMock = jest.fn();
const getsByMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const getAllElementsMock = jest.fn();
jest.mock("../../../app/server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getsByMock,
        update: updateMock,
        delete: deleteMock,
        getAllElements: getAllElementsMock,
      };
    }),
  };
});

describe("ReservationsDataAccess test suite", () => {
  let sut: ReservationsDataAccess;

  const someReservation: Reservation = {
    id: "",
    room: "someRoom",
    user: "someUser",
    startDate: "someStartDate",
    endDate: "someEndDate",
  };

  const anotherReservation: Reservation = {
    id: "",
    room: "anotherRoom",
    user: "anotherUser",
    startDate: "anotherStartDate",
    endDate: "anotherEndDate",
  };

  const someId = "1234";

  beforeAll(() => {
    sut = new ReservationsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1); // we access DataBase not ReservationsDataAccess
    // jest.spyOn(IdGenerator, "generateRandomId").mockReturnValue(someId);
  });

  afterAll(() => {
    jest.clearAllMocks();
    // someReservation.id = "";
  });

  test("Should create a reservation and return the id", async () => {
    insertMock.mockResolvedValueOnce(someId);

    const actualId = await sut.createReservation(someReservation);

    expect(actualId).toBe(someId);
    expect(insertMock).toHaveBeenCalledWith(someReservation);
  });

  test("Should update a reservation", async () => {
    await sut.updateReservation(someId, "room", "newRoom");

    expect(updateMock).toHaveBeenCalledWith(someId, "room", "newRoom");
  });

  test("Should delete a reservation", async () => {
    await sut.deleteReservation(someId);

    expect(deleteMock).toHaveBeenCalledWith(someId);
  });


  test("Should get a reservation by id", async () => {
    getsByMock.mockResolvedValueOnce(someReservation);
    const actualReservation = await sut.getReservation(someId);
    expect(actualReservation).toEqual(someReservation);
    expect(getsByMock).toHaveBeenCalledWith("id", someId);
    expect(getsByMock).toHaveBeenCalledTimes(1);
  });

  test("Should get all reservations", async () => {
    getAllElementsMock.mockResolvedValueOnce([
      someReservation,
      anotherReservation,
    ]);

    const actualReservations = await sut.getAllReservations();

    expect(actualReservations).toEqual([someReservation, anotherReservation]);
    expect(getAllElementsMock).toHaveBeenCalledTimes(1);
  });
});
