import 'reflect-metadata';
import {UUID} from "./uuid";

describe("UUID", () => {
  test("is generated with the proper length", () => {
    let result = UUID.uuid();
    expect(result.length).toBe(36);
  });

  test("is uniquely generated for each invocation", () => {
    let result1 = UUID.uuid();
    let result2 = UUID.uuid();
    expect(result1 == result2).toBeFalsy()
  });
});
