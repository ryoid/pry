import { describe, it, expect } from 'vitest';
import { pry } from '../src';

type Data = {
  id: number;
};

describe('synchronous functions', () => {
  const syncFn = (): Data => ({ id: 1 });

  const syncErrorFn = (): Data => {
    if ((0 as any) === 'never') {
      return { id: 1 };
    }
    throw new Error('Error');
  };

  it('returns result', () => {
    const result = pry(syncFn);
    if (!result.ok) {
      throw result.error;
    }
    expect(result.ok).toEqual(true);
    // @ts-expect-error - should not be defined
    expect(result.error).toEqual(undefined);
    expect(result.value).toEqual({ id: 1 });
  });

  it('returns error', () => {
    const result = pry(syncErrorFn);
    if (result.ok) {
      throw new Error("Shouldn't be ok");
    }
    expect(result.ok).toEqual(false);
    // @ts-expect-error - should not be defined
    expect(result.value).toEqual(undefined);
    expect(result.error).toEqual(undefined);
  });
});

describe('async functions', () => {
  const asyncFn = (): Promise<Data> => new Promise((resolve) => {
    resolve({ id: 1 });
  });

  const asyncErrorFn = (): Promise<Data> => new Promise((_, reject) => {
    reject(new Error('Expected Error'));
  });

  it('returns result', async () => {
    const result = await pry(asyncFn());
    if (!result.ok) {
      throw result.error;
    }
    expect(result.ok).toEqual(true);
    // @ts-expect-error - should not be defined
    expect(result.error).toEqual(undefined);
    expect(result.value).toEqual({ id: 1 });
  });

  it('returns error', async () => {
    const result = await pry(asyncErrorFn());
    if (result.ok) {
      throw new Error("Shouldn't be ok");
    }
    expect(result.ok).toEqual(false);
    // @ts-expect-error - should not be defined
    expect(result.value).toEqual(undefined);
    expect(result.error).toEqual(undefined);
  });
});
