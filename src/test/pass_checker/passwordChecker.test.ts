import { PasswordChecker } from "../../app/pass_checker/passwordChecker";

describe("PasswordChecker test suite", () => {
  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  });

  test("Password with less than 8 characters is invalid", () => {
    const actual = sut.checkPassword("1234567");
    expect(actual).toBe(false);
  });

  test("Password with more than 8 characteres is ok", () => {
    const actual = sut.checkPassword("12345678Ab");
    expect(actual).toBe(true);
  });

  test("Password with no uppercase is invalid", () => {
    const actual = sut.checkPassword("1234abcd");
    expect(actual).toBe(false);
  });

  test("Password with an uppercase is valid", () => {
    const actual = sut.checkPassword("1234Abcd");
    expect(actual).toBe(true);
  });

  test("Password with no lowercase is invalid", () => {
    const actual = sut.checkPassword("1234ABCD");
    expect(actual).toBe(false);
  });

  test("Password with an lowercase is valid", () => {
    const actual = sut.checkPassword("1234ABCd");
    expect(actual).toBe(true);
  });
});
