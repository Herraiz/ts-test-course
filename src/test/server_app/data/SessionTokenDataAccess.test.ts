// Here we need the same approach as in the ReservationsDataAccess.test.ts file
// We need to mock the DataBase class, because the consumer class SessionTokenDataAccess is a type of DataBase
// We need also to mock the methods used by the consumer class, in this case insert, delete and getBy

import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Account, SessionToken } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const updateMock = jest.fn();
const getByMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        update: updateMock,
        getBy: getByMock,
      };
    }),
  };
});

describe("SessionTokenDataAccess test suite", () => {
  let sut: SessionTokenDataAccess;

  const someUser: Account = {
    id: "",
    userName: "someUserName",
    password: "somePassword",
  };

  const fakeId = "1234";

  let someSessionToken: SessionToken;

  beforeEach(() => {
    sut = new SessionTokenDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);

    // Simulated fixed expiration date when using method generateExpirationTime
    const fixedExpirationDate = new Date("2025-01-01");
    jest
      .spyOn(sut as any, "generateExpirationTime")
      .mockReturnValue(fixedExpirationDate);

    // Instead of that we can Spy the global method Date.now
    jest.spyOn(global.Date, "now").mockReturnValue(0);

    someSessionToken = {
      id: "",
      userName: someUser.userName,
      valid: true,
      expirationDate: (sut as any).generateExpirationTime(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should generate a token and return the id", async () => {
    insertMock.mockResolvedValueOnce(fakeId);
    await sut.generateToken(someUser);
    expect(insertMock).toHaveBeenCalledWith(someSessionToken);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  test("Should invalidate a token", async () => {
    updateMock.mockResolvedValueOnce(someSessionToken.id);
    await sut.invalidateToken(someSessionToken.id);
    expect(updateMock).toHaveBeenCalledWith(
      someSessionToken.id,
      "valid",
      false
    );
    expect(updateMock).toHaveBeenCalledTimes(1);
  });

  test("Should check if a token is valid", async () => {
    getByMock.mockResolvedValueOnce(someSessionToken);
    const actualResult = await sut.isValidToken(someSessionToken.id);
    expect(actualResult).toBe(someSessionToken.valid);
    expect(getByMock).toHaveBeenCalledWith("id", someSessionToken.id);
    expect(getByMock).toHaveBeenCalledTimes(1);
  });

  test("Should generate expiration time", () => {
    const actualExpirationDate = (sut as any).generateExpirationTime();
    const expectedExpirationDate = new Date("2025-01-01");
    expect(actualExpirationDate).toEqual(expectedExpirationDate);
  });
});
