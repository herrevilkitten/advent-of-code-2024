import { readFileSync } from "fs";

export function readFile(filename = "input.txt"): string[] {
  return readFileSync(filename, "utf8").split(/\r?\n/);
}
