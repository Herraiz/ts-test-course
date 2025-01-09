// jest.mock("../../app/doubles/OtherUtils");
jest.mock("../../app/doubles/OtherUtils", () => ({
  ...jest.requireActual("../../app/doubles/OtherUtils"), // keep the original functions
  // but override the calculateComplexity function
  calculateComplexity: () => {
    return 10;
  },
}));

jest.mock("uuid", () => ({
  v4: () => "123",
}));

import * as OtherUtils from "../../app/doubles/OtherUtils";

describe("Module tests", () => {
  test("Calculate complexity", () => {
    const result = OtherUtils.calculateComplexity({} as any);
    console.log(result);
  });

  test("Keep other functions", () => {
    const result = OtherUtils.toUpperCase("abc");
    expect(result).toBe("ABC");
  });

  test("String with id", () => {
    const result = OtherUtils.toLowerCaseWithId("abc");
    console.log(result);
    expect(result).toBe("abc123");
  });
});
