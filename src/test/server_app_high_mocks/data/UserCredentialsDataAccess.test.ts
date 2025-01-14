import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const getByMock = jest.fn();

// Injecting mock of a consumer class
// We need to mock the methods used by the consumer class, in this case getBy and insert
// now we can test the consumer class without the need of the real implementation of the DataBase class
jest.mock("../../../app/server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getByMock,
      };
    }),
  };
});

describe("UserCredentialsDataAccest test suite", () => {
  let sut: UserCredentialsDataAccess;

  const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };

  const someId = "1234";

  beforeEach(() => {
    sut = new UserCredentialsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should add user and return the id", async () => {
    insertMock.mockResolvedValueOnce(someId); // resolvedValueOnce is for async functions

    const actualId = await sut.addUser(someAccount);

    expect(actualId).toBe(someId);
    expect(insertMock).toHaveBeenCalledWith(someAccount);
  });

  test("Should get user by id", async () => {
    getByMock.mockResolvedValueOnce(someAccount);

    const actualAccount = await sut.getUserById(someId);

    expect(actualAccount).toBe(someAccount);
    expect(getByMock).toHaveBeenCalledWith("id", someId); // check if getBy is called with the right arguments
  });

  test("Should get user by user name", async () => {
    getByMock.mockResolvedValueOnce(someAccount);

    const actualAccount = await sut.getUserByUserName(someAccount.userName);

    expect(actualAccount).toBe(someAccount);
    expect(getByMock).toHaveBeenCalledWith("userName", someAccount.userName);
  });
});
