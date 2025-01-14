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

  const someAccount: Account = {
    id: "",
    userName: "someUserName",
    password: "somePassword",
  };

  beforeEach(() => {
    sut = new SessionTokenDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
    jest.spyOn(global.Date, "now").mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate token for account", async () => {
    insertMock.mockResolvedValueOnce(fakeId);
    const actualTokenId = await sut.generateToken(someAccount);
    expect(actualTokenId).toBe(fakeId);
    expect(insertMock).toHaveBeenCalledWith({
      id: "",
      userName: someAccount.userName,
      valid: true,
      expirationDate: new Date(1000 * 60 * 60),
    });
  });
  it("should invalidate token", async () => {
    await sut.invalidateToken(fakeId);
    expect(updateMock).toHaveBeenCalledWith(fakeId, "valid", false);
  });
  it("should check valid token", async () => {
    getByMock.mockResolvedValueOnce({ valid: true });
    const actual = await sut.isValidToken({} as any);
    expect(actual).toBe(true);
  });
  it("should check invalid token", async () => {
    getByMock.mockResolvedValueOnce({ valid: false });
    const actual = await sut.isValidToken({} as any);
    expect(actual).toBe(false);
  });
  it("should check inexistent token", async () => {
    getByMock.mockResolvedValueOnce(undefined);
    const actual = await sut.isValidToken({} as any);
    expect(actual).toBe(false);
  });
});
