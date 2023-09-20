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
      throw result.err;
    }
    expect(result.ok).toEqual(true);
    expect(result.val).toEqual({ id: 1 });
    // @ts-expect-error - should not be defined
    expect(result.err).toEqual(undefined);
  });

  it("returns error", async () => {
    const result = await pry(asyncErrorFn());
    if (result.ok) {
      throw new Error("Shouldn't be ok");
    }
    expect(result.ok).toEqual(false);
    expect(result.err).toEqual(new Error("Expected Error"));
    // @ts-expect-error - should not be defined
    expect(result.val).toEqual(undefined);
  });
});
