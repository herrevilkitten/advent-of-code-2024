import { readFile } from "../file";

function part1() {
  const line = readFile("src/day3/input.txt").join("");

  const total = [...line.matchAll(/mul\((\d+?),(\d+?)\)/g)].reduce(
    (prev, curr) => prev + Number(curr[1]) * Number(curr[2]),
    0
  );
  console.log(`>> #1 Total: ${total}`);
}

function part2() {
  const line = readFile("src/day3/input.txt").join("");

  const total = [
    ...line.matchAll(/(?:mul\((\d+?),(\d+?)\))|(?:do\(\))|(?:don't\(\))/g),
  ].reduce<[number, boolean]>(
    (prev, curr) => {
      const [sum, enabled] = prev;
      if (curr[0] === "do()") {
        return [sum, true];
      } else if (curr[0] === "don't()") {
        return [sum, false];
      } else if (!enabled) {
        return prev;
      } else {
        return [prev[0] + Number(curr[1]) * Number(curr[2]), enabled];
      }
    },
    [0, true]
  );
  console.log(`>> #2 Total: ${total[0]}`);
}

part1();
part2();
