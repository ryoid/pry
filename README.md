# pry

[![npm version][npm-version-src]][npm-version-href]
[![Codecov][codecov-src]][codecov-href]

Ergonomic function error handling in Typescript without `try catch` using a result type. Works for both async/sync functions and of course, [typesafe](#typescript).

## Getting Started

Install:

```sh
# npm
npm install pry-ts

# yarn
yarn add pry-ts

# pnpm
pnpm install pry-ts
```

Pass a promise or function (sync) to `pry` and it will return a `Result` type.

### Asynchronous (Promise) Example

Pass your **promise** to `pry` and it will return a `Result` type.

```typescript
import { pry } from "pry-ts";

const result = await pry(promise);
if (!result.ok) {
  console.error(result.err);
  return;
}
console.log(result.val);

// Type definition
type Result<T, U = Error> =
  | {
      ok: true;
      val: T;
    }
  | {
      ok: false;
      err: U;
    };
```

More examples

### Synchronous (Promise)

Also works! Pass your **function** to `pry` and it will return a `Result` type.

```typescript
const result = pry(syncFn);
const file = pry(() => fs.readFileSync("file.txt", "utf-8"));
if (!file.ok) {
  return console.error(file.err);
}
console.log(file.val);
```

> **❗️Note the arguments**
>
> - For **asynchronous**, you must pass the **promise NOT the function** that returns a promise.
> - For **synchronous**, you must pass the **function itself**, not the result of the function.

## Typescript

Result value type is inferred from your promise/function, so be sure to type that! You can also explicitly type the value.

Note that you **must** check `ok` before accessing `value` or `error` [(Discriminate types)](https://www.typescriptlang.org/play#example/discriminate-types).

```typescript
const result = await pry<Data>(promise);
if (result.ok) {
  // Checking for `ok` or inversely for error
  result.val; // Data
}
```

### Non-Error error typing

While in javascript you can throw any expression, the library uses a sensible default of `Error` to handle general use. You can also pass a custom error type.

```typescript
// Typing custom errors
const result = await pry<Data, CustomError>(promise);
```

## Design decisions

### Why `ok`

A pattern that can be seen in javascript with `Response`.

```typescript
const response = await fetch(url);
if (!response.ok) {
  throw new Error(response.statusText);
}
response.body;
```

### Looking into a Go style approach

For reference, a Go error handling approach might be to return a _tuple_ with the result and error.

```typescript
const [result, err] = await goPry(promise);
```

However, I found it clunky when working with multiple async operations due to having to use a unique variable name for each error.

```typescript
const [user, userError] = await goPry(promise);
const [category, categoryError] = await goPry(promise);
const [product, productError] = await goPry(promise);

const [[user, userError], [category, categoryError], [product, productError]] =
  await Promise.all([promise, promise, promise]);
```

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/pry-ts?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/pry-ts
[codecov-src]: https://img.shields.io/codecov/c/gh/ryoid/pry/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/ryoid/pry
