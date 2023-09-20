export type Result<T, U = Error> =
  | {
      /**
       * The operation status.
       * `true` if the operation succeeded without errors, `false` otherwise.
       */
      readonly ok: true;
      /**
       * Val returned by the operation.
       */
      val: T;
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
      err: U;
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
 *   console.error(result.err);
 *   return;
 * }
 * console.log(result.val);
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
        val: fn(),
      };
    } catch (error) {
      return {
        ok: false,
        err: error as U,
      };
    }
  }
  return new Promise((resolve) => {
    fn.then(
      (val) => {
        resolve({
          ok: true,
          val,
        });
      },
      (error) => {
        resolve({
          ok: false,
          err: error as U,
        });
      },
    );
  });
}
