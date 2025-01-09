import { calculateComplexity } from "../../app/doubles/OtherUtils";

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
});
