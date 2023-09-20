export type Result<T, U = Error> =
  | {
      /**
       * The operation status.
       * `true` if the operation succeeded without errors, `false` otherwise.
       */
      readonly ok: true;
      /**
       * Value returned by the operation.
       */
      value: T;
    }
  | {
      /**
       * The operation status.
       * `true` if the operation succeeded without errors, `false` otherwise.
       */
      readonly ok: false;
      /**
       * Error thrown by the operation.
       */
      error: U;
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func<T> = (...args: any[]) => T;

/**
 * Ergonomic function error handling helper.
 *
 * @example
 *
 * ```typescript
 * const result = await pry(asyncFn(...args));
 * if (!result.ok) {
 *   console.error(result.error);
 *   return;
 * }
 * console.log(result.value);
 * ```
 */
export function pry<T, U = Error>(fn: PromiseLike<T>): Promise<Result<T, U>>;
export function pry<T, U = Error>(fn: Func<T>): Result<T, U>;
export function pry<T, U = Error>(
  fn: PromiseLike<T> | Func<T>,
): Promise<Result<T, U>> | Result<T, U> {
  if (typeof fn === "function") {
    try {
      return {
        ok: true,
        value: fn(),
      };
    } catch (error) {
      return {
        ok: false,
        error: error as U,
      };
    }
  }
  return new Promise((resolve) => {
    fn.then(
      (value) => {
        resolve({
          ok: true,
          value,
        });
      },
      (error) => {
        resolve({
          ok: false,
          error: error as U,
        });
      },
    );
  });
}
