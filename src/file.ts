import { readFileSync } from "fs";

export function readFile(day: string): string[] {
  return readFileSync(`src/${day}/input.txt`, "utf8").split(/\r?\n/);
}
