import { describe, it, expect } from "vitest";
import { pry } from "../src";

type Data = {
  id: number;
};

const syncFn = (): Data => ({ id: 1 });

const syncErrorFn = (): Data => {
  throw new Error("Expected Error");
};

describe("synchronous functions", () => {
  it("returns result", () => {
    const result = pry(syncFn);
    if (!result.ok) {
      throw result.err;
    }
    expect(result.ok).toEqual(true);
    expect(result.val).toEqual({ id: 1 });
    // @ts-expect-error - should not be defined
    expect(result.err).toEqual(undefined);
  });

  it("returns error", () => {
    const result = pry(syncErrorFn);
    if (result.ok) {
      throw new Error("Shouldn't be ok");
    }
    expect(result.ok).toEqual(false);
    expect(result.err).toEqual(new Error("Expected Error"));
    // @ts-expect-error - should not be defined
    expect(result.val).toEqual(undefined);
  });
});
