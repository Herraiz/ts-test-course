import { PasswordChecker } from "../../app/pass_checker/passwordChecker";

describe("PasswordChecker test suite", () => {
  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  });

  test("Should do nothing", () => {
    sut.checkPassword();
  });
});
