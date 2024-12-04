import { readFile } from "../file";
const lines = readFile("src/day4/input.txt");

const data = lines.join("").replaceAll(/\s+/g, "");
const height = lines.length;
const width = lines[0].length;

const grid: Grid = {
  data,
  height,
  width,
};

interface Grid {
  data: string;
  height: number;
  width: number;
}

function getCoordinatesForPointer(grid: Grid, pointer: number) {
  const row = Math.floor(pointer / grid.width) + 1;
  const column = Math.floor(pointer % grid.width) + 1;
  return [row, column];
}

function scanGrid(grid: Grid) {
  let count = 0;
  for (let pointer = 0; pointer < grid.data.length; ++pointer) {
    const letter = grid.data[pointer];
    const [row, column] = getCoordinatesForPointer(grid, pointer);

    if (letter !== "X") {
      continue;
    }

    // Horizontal
    if (column > 3) {
      if (grid.data.substring(pointer - 3, pointer + 1) === "SAMX") {
        ++count;
      }
    }
    if (column < grid.width - 2) {
      if (grid.data.substring(pointer, pointer + 4) === "XMAS") {
        ++count;
      }
    }

    if (row > 3) {
      // Diagonal UL -> pointer
      if (
        column > 3 &&
        grid.data[pointer - grid.width * 3 - 3] === "S" &&
        grid.data[pointer - grid.width * 2 - 2] === "A" &&
        grid.data[pointer - grid.width * 1 - 1] === "M"
      ) {
        count++;
      }

      // Vertical
      if (
        grid.data[pointer - grid.width * 3] === "S" &&
        grid.data[pointer - grid.width * 2] === "A" &&
        grid.data[pointer - grid.width * 1] === "M"
      ) {
        count++;
      }

      // Diagonal pointer -> UR
      if (
        column < grid.width - 2 &&
        grid.data[pointer - grid.width * 3 + 3] === "S" &&
        grid.data[pointer - grid.width * 2 + 2] === "A" &&
        grid.data[pointer - grid.width * 1 + 1] === "M"
      ) {
        count++;
      }
    }

    if (row < grid.height - 2) {
      // Diagonal LL -> pointer
      if (
        column > 3 &&
        grid.data[pointer + grid.width * 3 - 3] === "S" &&
        grid.data[pointer + grid.width * 2 - 2] === "A" &&
        grid.data[pointer + grid.width * 1 - 1] === "M"
      ) {
        count++;
      }

      // Vertical
      if (
        grid.data[pointer + grid.width * 3] === "S" &&
        grid.data[pointer + grid.width * 2] === "A" &&
        grid.data[pointer + grid.width * 1] === "M"
      ) {
        count++;
      }

      // Diagonal pointer -> LR
      if (
        column < grid.width - 2 &&
        grid.data[pointer + grid.width * 3 + 3] === "S" &&
        grid.data[pointer + grid.width * 2 + 2] === "A" &&
        grid.data[pointer + grid.width * 1 + 1] === "M"
      ) {
        count++;
      }
    }
  }
  return count;
}

function scanGrid2(grid: Grid) {
  let count = 0;
  for (let pointer = 0; pointer < grid.data.length; ++pointer) {
    const letter = grid.data[pointer];
    const [row, column] = getCoordinatesForPointer(grid, pointer);

    if (letter !== "A") {
      continue;
    }

    if (
      row < 2 ||
      row > grid.height - 1 ||
      column < 2 ||
      column > grid.width - 1
    ) {
      continue;
    }

    let matching = 0;
    // Diagonal UL -> pointer
    if (
      grid.data[pointer - grid.width - 1] === "M" &&
      grid.data[pointer + grid.width + 1] === "S"
    ) {
      matching++;
    }

    // Diagonal pointer -> UR
    if (
      grid.data[pointer + grid.width - 1] === "M" &&
      grid.data[pointer - grid.width + 1] === "S"
    ) {
      matching++;
    }

    if (
      grid.data[pointer - grid.width + 1] === "M" &&
      grid.data[pointer + grid.width - 1] === "S"
    ) {
      matching++;
    }

    // Diagonal pointer -> UR
    if (
      grid.data[pointer + grid.width + 1] === "M" &&
      grid.data[pointer - grid.width - 1] === "S"
    ) {
      matching++;
    }

    if (matching === 2) {
      count++;
    }
  }
  return count;
}

function part1() {
  let total = scanGrid(grid);
  console.log(`** Total: ${total}`);
}

function part2() {
  let total = scanGrid2(grid);
  console.log(`** Total: ${total}`);
}

part1();
part2();
