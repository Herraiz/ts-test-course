import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

// We need to mock the SessionTokenDataAccess and UserCredentialsDataAccess classes,
// because the consumer class Authorizer is a type of
// SessionTokenDataAccess and UserCredentialsDataAccess

// SessionTokenDataAccess Mocks
const generateTokenMock = jest.fn();
const isValidTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();

jest.mock("../../../app/server_app/data/SessionTokenDataAccess", () => {
  return {
    SessionTokenDataAccess: jest.fn().mockImplementation(() => {
      return {
        generateToken: generateTokenMock,
        isValidToken: isValidTokenMock,
        invalidateToken: invalidateTokenMock,
      };
    }),
  };
});

// UserCredentialsDataAccess Mocks
const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();

jest.mock("../../../app/server_app/data/UserCredentialsDataAccess", () => {
  return {
    UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
      return {
        addUser: addUserMock,
        getUserByUserName: getUserByUserNameMock,
      };
    }),
  };
});

describe("Authorizer test suite", () => {
  let sut: Authorizer;

  const someUser = {
    id: "",
    userName: "someUserName",
    password: "somePassword",
  };

  const someId = "1234";

  const someToken = {
    id: someId,
    userName: someUser.userName,
    valid: true,
    expirationDate: new Date(1000 * 60 * 60),
  };

  beforeEach(() => {
    sut = new Authorizer();
    expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
    expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should validate a valid token and return it", async () => {
    isValidTokenMock.mockResolvedValueOnce(true);
    const actualResult = await sut.validateToken(someToken.id);
    expect(actualResult).toBe(true);
    expect(isValidTokenMock).toHaveBeenCalledWith(someToken.id);
  });

  test("Should return userId when add user", async () => {
    addUserMock.mockResolvedValueOnce(someUser.id);
    const actualUserId = await sut.registerUser(
      someUser.userName,
      someUser.password
    );
    expect(actualUserId).toBe(someUser.id);
    expect(addUserMock).toHaveBeenCalledWith(someUser);
  });

  test("Should return tokenId when logging in with valid credentials", async () => {
    getUserByUserNameMock.mockResolvedValueOnce(someUser);
    const actualTokenId = await sut.login(someUser.userName, someUser.password);

    expect(actualTokenId).toBeUndefined();
    expect(getUserByUserNameMock).toHaveBeenCalledWith(someUser.userName);
    expect(generateTokenMock).toHaveBeenCalledWith(someUser);
  });

  test("Should do nothing when logging in with invalid credentials", async () => {
    getUserByUserNameMock.mockResolvedValueOnce(undefined);

    const actualTokenId = await sut.login(someUser.userName, someUser.password);

    expect(actualTokenId).toBeUndefined();
    expect(getUserByUserNameMock).toHaveBeenCalledWith(someUser.userName);
  });

  test("Should invalidate token when logging out", async () => {
    invalidateTokenMock.mockResolvedValueOnce(someToken);

    await sut.logout(someToken.id);

    expect(invalidateTokenMock).toHaveBeenCalledWith(someToken.id);
  });
});
