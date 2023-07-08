# pry

Ergonomic function error handling in Typescript without `try catch`. Works for both async/sync functions and of course, [typesafe](#typescript).

## Installation
```
npm install ts-pry
yarn add ts-pry
pnpm add ts-pry
```

## Usage

Pass a promise or function (sync) to `pry` and it will return a `Result` type.

### Asynchronous (Promise) Example

Pass your **promise** to `pry` and it will return a `Result` type.

```typescript
import { pry } from 'ts-pry';

const promise = fetch(url).then(res => res.json() as Promise<Data>);
const result = await pry(promise);
if (!result.ok) {
  console.error(result.error);
  return
}
console.log(result.value);

// Type definition
type Result<T, U = Error> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: U;
    };
```

### Synchronous (Promise)

Also works! Pass your **function** to `pry` and it will return a `Result` type.


```typescript
const result = pry(syncFn);
if (!result.ok) {
  return console.error(result.error);
}
console.log(result.value);
```

### Notes

>**❗️Note the parameter**
>
>- For **asynchronous**, you must pass the **promise NOT the function** that returns a promise.
>
>- For **synchronous**, you must pass the **function itself**, not the result of the function.

Don't want to use a library with no downloads? The [implementation is small](https://github.com/ryoid/pry/blob/main/src/pry.ts), copy paste it into your project.

## Typescript

Result value type is inferred from your promise/function, so be sure to type that! You can also explicitly type the value.

Note that you **must** check `ok` before accessing `value` or `error` [(Discriminate types)](https://www.typescriptlang.org/play#example/discriminate-types).

```typescript
const result = await pry<Data>(promise);
if (result.ok) {
  // Checking for `ok` or inversely for error
  result.value; // Data
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

A pattern that can be seen in javascript with `Response`. Also, drew inspiration from Rust's `Result`.

```typescript
const response = await fetch(url);
if (!response.ok) {
  throw new Error(response.statusText);
}
response.body;
```

### Why not a Go style approach

For reference, a Go approach might be to return a "tuple" with the result and error.

```typescript
const [result, err] = await goPry(promise);
```

However, I found it clunky when working with multiple async operations due to having to use a unique variable name for each error.

See illustration

```typescript
const [user, userError] = await goPry(promise);
const [category, categoryError] = await goPry(promise);
const [product, productError] = await goPry(promise);

const [[user, userError], [category, categoryError], [product, productError]] =
  await Promise.all([promise, promise, promise]);
```

## License

The MIT License.