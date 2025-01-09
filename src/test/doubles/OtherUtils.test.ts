import {
  calculateComplexity,
  OtherStringUtils,
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

  // now we are using a mock to check if the callback is called
  describe("Tracking callbacks", () => {
    let cbArgs = [];
    let timesCalled = 0;

    function callBackMock(arg: string) {
      cbArgs.push(arg);
      timesCalled++;
    }

    // clear tracking fields
    afterEach(() => {
      cbArgs = [];
      timesCalled = 0;
    });

    test("Calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCb("", callBackMock);

      expect(actual).toBeUndefined();
      expect(cbArgs).toContain("No argument provided");
      expect(timesCalled).toBe(1);
    });

    test("Calls callback for valid argument - track calls", () => {
      const actual = toUpperCaseWithCb("abc", callBackMock);

      expect(actual).toBe("ABC");
      expect(cbArgs).toContain("called function with abc");
      expect(timesCalled).toBe(1);
    });
  });

  // Now testing using Jest Mocks
  describe("Tracking callbacks with Jest mocks", () => {
    const callBackMock = jest.fn(); // accepts an implementation

    // reset mock calls
    afterEach(() => {
      //   callBackMock.mockClear();
      jest.clearAllMocks();
    });

    test("Calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCb("", callBackMock);

      expect(actual).toBeUndefined();
      expect(callBackMock).toHaveBeenCalledWith("No argument provided");
      expect(callBackMock).toHaveBeenCalledTimes(1);
    });

    test("Calls callback for valid argument - track calls", () => {
      const actual = toUpperCaseWithCb("abc", callBackMock);

      expect(actual).toBe("ABC");
      expect(callBackMock).toHaveBeenCalledWith("called function with abc");
      expect(callBackMock).toHaveBeenCalledTimes(1);
    });
  });

  // Now testing using Jest spies
  describe("OtherStringUtils tests with spies", () => {
    let sut: OtherStringUtils;

    beforeEach(() => {
      sut = new OtherStringUtils();
    });

    test("Use a spy to track calls", () => {
      const toUpperCaseSpy = jest.spyOn(sut, "toUpperCase");
      sut.toUpperCase("asa");
      expect(toUpperCaseSpy).toHaveBeenCalledWith("asa");
    });

    test("Use a spy to track calls to other modules", () => {
      const consoleLogSpy = jest.spyOn(console, "log");
      sut.logString("abc");
      expect(consoleLogSpy).toHaveBeenCalledWith("abc");
    });

    test("Use a spy toreplace implementation of a method", () => {
      const callExternalServiceSpy = jest
        .spyOn(
          sut as any, // now we can call private methods
          "callExternalService"
        )
        .mockImplementation(() => {
          console.log("Mocked callExternalService"); // we can replace the implementation
        });
      (sut as any).callExternalService();
      expect(callExternalServiceSpy).toHaveBeenCalled();
    });
  });
});
