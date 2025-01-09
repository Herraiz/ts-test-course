export enum PasswordErrors {
  SHORT = "Password is too short",
  NO_UPPERCASE = "Password has no uppercase",
  NO_LOWERCASE = "Password has no lowercase",
  NO_NUMBER = "Password has no number",
}

export interface CheckResult {
  valid: boolean;
  reasons: PasswordErrors[];
}

export class PasswordChecker {
  public checkPassword(password: string): CheckResult {
    // if (!password) {
    //   throw new Error("Invalid argument!");
    // }

    let reasons: PasswordErrors[] = [];

    this.checkForLenght(password, reasons);

    this.checkForUppercase(password, reasons);

    this.checkForLowercase(password, reasons);

    return { valid: reasons.length > 0 ? false : true, reasons };
  }

  public checkAdminPassword(password: string): CheckResult {
    // return {} as any; // should need this to TDD or todo

    const basicCheck = this.checkPassword(password);
    this.checkForNumber(password, basicCheck.reasons);
    return {
      valid: basicCheck.reasons.length > 0 ? false : true,
      reasons: basicCheck.reasons,
    };
  }

  private checkForLenght(password: string, reasons: PasswordErrors[]): void {
    if (password.length < 8) {
      reasons.push(PasswordErrors.SHORT);
    }
  }

  private checkForUppercase(password: string, reasons: PasswordErrors[]): void {
    if (password == password.toLowerCase()) {
      reasons.push(PasswordErrors.NO_UPPERCASE);
    }
  }
  private checkForLowercase(password: string, reasons: PasswordErrors[]): void {
    if (password == password.toUpperCase()) {
      reasons.push(PasswordErrors.NO_LOWERCASE);
    }
  }
  private checkForNumber(password: string, reasons: PasswordErrors[]): void {
    const hasNumber = /\d/;
    if (!hasNumber.test(password)) {
      reasons.push(PasswordErrors.NO_NUMBER);
    }
  }
}
