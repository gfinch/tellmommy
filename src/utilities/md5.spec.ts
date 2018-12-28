import 'reflect-metadata';
import {MD5} from "./md5";

describe("MD5", () => {
  test("generate an MD5 hash", () => {
    let result = MD5.hash("some-test-string");
    expect(result).toBe("f6cacdf23beb010768e1896add6796a3");
  });
});
