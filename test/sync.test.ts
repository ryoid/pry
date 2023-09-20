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
      throw result.error;
    }
    expect(result.ok).toEqual(true);
    // @ts-expect-error - should not be defined
    expect(result.error).toEqual(undefined);
    expect(result.value).toEqual({ id: 1 });
  });

  it("returns error", () => {
    const result = pry(syncErrorFn);
    if (result.ok) {
      throw new Error("Shouldn't be ok");
    }
    expect(result.ok).toEqual(false);
    // @ts-expect-error - should not be defined
    expect(result.value).toEqual(undefined);
    expect(result.error).toEqual(new Error("Expected Error"));
  });
});
