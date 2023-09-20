import { pry } from "../src";

console.log("hello", await pry(Promise.resolve("world")));
