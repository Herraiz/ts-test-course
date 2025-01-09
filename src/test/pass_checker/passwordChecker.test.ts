import {
  PasswordChecker,
  PasswordErrors,
} from "../../app/pass_checker/passwordChecker";

describe("PasswordChecker test suite", () => {
  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  });

  test("Password with less than 8 characters is invalid", () => {
    const actual = sut.checkPassword("1234567");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.SHORT);
  });

  test("Password with more than 8 characteres is ok", () => {
    const actual = sut.checkPassword("12345678Ab");

    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
  });

  test("Password with no uppercase is invalid", () => {
    const actual = sut.checkPassword("abcd");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_UPPERCASE);
  });

  test("Password with an uppercase is valid", () => {
    const actual = sut.checkPassword("abcD");

    // expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPERCASE);
  });

  test("Password with no lowercase is invalid", () => {
    const actual = sut.checkPassword("ABCD");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_LOWERCASE);
  });

  test("Password with an lowercase is valid", () => {
    const actual = sut.checkPassword("ABCd");

    // expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWERCASE);
  });

  test("Complex password is valid", () => {
    const actual = sut.checkPassword("12345678Ab");

    expect(actual.valid).toBe(true);
    expect(actual.reasons).toHaveLength(0);
  });

  //   adminPassword tests

  test("Admin Password with no number is invalid", () => {
    const actual = sut.checkAdminPassword("abcdABCD");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER);
  });

  test("Admin Password with number is valid", () => {
    const actual = sut.checkAdminPassword("abcdABCD7");

    expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER);
  });
});
