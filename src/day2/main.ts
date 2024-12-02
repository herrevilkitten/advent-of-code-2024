import { readFile } from "../file";

enum Direction {
  Descending,
  Ascending,
}

function checkLevels(levels: number[]) {
  let isSafe = true;
  let current: number | undefined = undefined;
  let direction: Direction | undefined = undefined;

  for (let i = 0; i < levels.length; ++i) {
    let value = levels[i];
    if (current !== undefined) {
      if (direction !== undefined) {
        if (direction === Direction.Ascending && value < current) {
          console.log(
            `>> (${levels}) Direction change 'ASC' from ${current} to ${value}`
          );
          isSafe = false;
          break;
        } else if (direction === Direction.Descending && value > current) {
          console.log(
            `>> (${levels}) Direction change 'DESC' from ${current} to ${value}`
          );
          isSafe = false;
          break;
        }
      } else {
        if (value >= current) {
          direction = Direction.Ascending;
        } else {
          direction = Direction.Descending;
        }
      }
      const diff = Math.abs(current - value);
      if (diff < 1 || diff > 3) {
        console.log(
          `>> (${levels}) Diff ${diff} out of range: ${current} -> ${value}`
        );
        isSafe = false;
        break;
      }
    }
    current = value;
  }

  return isSafe;
}

function part1() {
  const data = readFile("src/day2/input.txt");

  const records: number[][] = [];
  let safeCount = 0;
  let totalCount = 0;
  for (const line of data) {
    if (line.length === 0) {
      continue;
    }
    const levels = line
      .trim()
      .split(/\s+/)
      .map((value) => Number(value));

    let isSafe = checkLevels(levels);
    if (isSafe) {
      safeCount++;
    }
    totalCount++;
  }
  console.log(`** Safe records: ${safeCount} of ${totalCount}`);
}

function part2() {
  const data = readFile("src/day2/input.txt");

  const records: number[][] = [];
  let safeCount = 0;
  let totalCount = 0;
  for (const line of data) {
    if (line.length === 0) {
      continue;
    }
    const levels = line
      .trim()
      .split(/\s+/)
      .map((value) => Number(value));

    let isSafe = checkLevels(levels);
    if (!isSafe) {
      for (let i = 0; i < levels.length; i++) {
        const newLevels = [...levels];
        newLevels.splice(i, 1);
        isSafe = checkLevels(newLevels);
        if (isSafe) {
          console.log(`>> Removing #${i} ${levels[i]} fixes the data`);
          break;
        }
      }
    }
    if (isSafe) {
      safeCount++;
    }
    totalCount++;
  }
  console.log(`** Safe records: ${safeCount} of ${totalCount}`);
}

part1();
part2();
