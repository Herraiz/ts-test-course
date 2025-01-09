import {
  calculateComplexity,
  toUpperCaseWithCb,
} from "../../app/doubles/OtherUtils";

describe("OtherUtils test suite", () => {
  test("Calculates complexity", () => {
    // stub the object and use any to avoid type checking
    const someInfo = {
      length: 5,
      extraInfo: {
        field1: "value1",
        field2: "value2",
      },
    };
    const actual = calculateComplexity(someInfo as any);

    expect(actual).toBe(10);
  });

  test("ToUpperCase -  calls callback for invalid argument", () => {
    // we use a fake to avoid LoggerServiceCallBack
    const actual = toUpperCaseWithCb("", () => {});

    expect(actual).toBeUndefined();
  });

  test("ToUpperCase -  calls callback for valid argument", () => {
    // we use a fake to avoid LoggerServiceCallBack
    const actual = toUpperCaseWithCb("abc", () => {});

    expect(actual).toBe("ABC");
  });
});
