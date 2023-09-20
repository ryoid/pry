import { describe, it, expect } from "vitest";
import { pry } from "../src";

type Data = {
  id: number;
};

const asyncFn = (): Promise<Data> =>
  new Promise((resolve) => {
    resolve({ id: 1 });
  });

const asyncErrorFn = (): Promise<Data> =>
  new Promise((resolve, reject) => {
    reject(new Error("Expected Error"));
  });

describe("async functions", () => {
  it("returns result", async () => {
    const result = await pry(asyncFn());
    if (!result.ok) {
      throw result.error;
    }
    expect(result.ok).toEqual(true);
    // @ts-expect-error - should not be defined
    expect(result.error).toEqual(undefined);
    expect(result.value).toEqual({ id: 1 });
  });

  it("returns error", async () => {
    const result = await pry(asyncErrorFn());
    if (result.ok) {
      throw new Error("Shouldn't be ok");
    }
    expect(result.ok).toEqual(false);
    // @ts-expect-error - should not be defined
    expect(result.value).toEqual(undefined);
    expect(result.error).toEqual(new Error("Expected Error"));
  });
});
