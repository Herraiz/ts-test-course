export enum PasswordErrors {
  SHORT = "Password is too short",
  NO_UPPERCASE = "Password has no uppercase",
  NO_LOWERCASE = "Password has no lowercase",
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
}
