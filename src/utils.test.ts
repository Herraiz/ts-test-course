import { test, describe, mock } from "node:test";
import * as assert from "node:assert";
// import { strictEqual, assert }  "node:assert";

const { toUpperCase } = require("./utils");

describe("Node test trials", () => {
  test("toUpperCase", () => {
    const actual = toUpperCase("abc");
    const expected = "ABC";
    assert.strictEqual(actual, expected);
  });

  test("sum mock", () => {
    const toUpperCaseMock = mock.fn((arg) => arg.toUpperCase());

    assert.strictEqual(toUpperCaseMock("abc"), "ABC");
    assert.strictEqual(toUpperCaseMock.mock.calls.length, 1);
  });
});
