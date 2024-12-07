import { readFile } from "../file";
const lines = readFile("day6");

enum Direction {
  Up = "Up",
  Right = "Right",
  Down = "Down",
  Left = "Left",
}

interface Guard {
  x: number;
  y: number;
  direction: Direction;
}

function scanMap(map: string[]) {
  const guard: Guard = {
    x: -1,
    y: -1,
    direction: Direction.Up,
  };

  const obstacleColumns = new Map<number, number[]>();
  const obstacleRows = new Map<number, number[]>();
  let obstacleCount = 0;

  let width = 0;
  let height = 0;
  for (let row = 0; row < map.length; ++row) {
    height = row;
    const line = map[row];
    //console.log(line);
    for (let col = 0; col < line.length; ++col) {
      width = col;
      const cell = line[col];

      switch (cell) {
        case "^":
          guard.x = col;
          guard.y = row;
          guard.direction = Direction.Up;
          break;
        case ">":
          guard.x = col;
          guard.y = row;
          guard.direction = Direction.Right;
          break;
        case "v":
          guard.x = col;
          guard.y = row;
          guard.direction = Direction.Down;
          break;
        case "<":
          guard.x = col;
          guard.y = row;
          guard.direction = Direction.Left;
          break;
        case "#":
          {
            //console.log("Adding obstacle in column", col, ":", row);
            const obstacles = obstacleColumns.get(col);
            if (!obstacles) {
              obstacleColumns.set(col, [row]);
            } else {
              obstacles.push(row);
            }
          }
          {
            const obstacles = obstacleRows.get(row);
            if (!obstacles) {
              obstacleRows.set(row, [col]);
            } else {
              obstacles.push(col);
            }
          }
          obstacleCount++;
          break;
      }
    }
  }

  [...obstacleColumns.values()].forEach((rows) =>
    rows.sort((a, b) => Number(a) - Number(b))
  );
  [...obstacleRows.values()].forEach((columns) =>
    columns.sort((a, b) => Number(a) - Number(b))
  );

  console.log(">> Guard:", guard);
  console.log(">> Obstacle count:", obstacleCount);

  return { guard, obstacleColumns, obstacleRows, height, width };
}

function range(start: number, end: number): ReadonlyArray<number> {
  const size = end - start + 1;
  return [...Array(size).keys()].map((i) => i + start);
}

function columnRange(start: number, end: number, x: number) {
  return range(start, end).map((y) => `${x}x${y}`);
}

function rowRange(start: number, end: number, y: number) {
  return range(start, end).map((x) => `${x}x${y}`);
}

interface SearchResult {
  event: string;
  onScreen: boolean;
  visited: string[];
  next?: {
    direction: Direction;
    x: number;
    y: number;
  };
}

function searchColumn(
  column: number[],
  height: number,
  guard: Guard
): SearchResult {
  const first = column[0];
  const last = column[column.length - 1];

  //  console.log(column, guard);

  // Above the first obstacle, so heading out
  if (
    guard.direction === Direction.Up &&
    (column.length === 0 || guard.y < first)
  ) {
    return {
      event: "up-off",
      onScreen: false,
      visited: columnRange(0, guard.y, guard.x),
    };
  }

  // Below the last obstacle, so heading out
  if (
    guard.direction === Direction.Down &&
    (column.length === 0 || guard.y > last)
  ) {
    return {
      event: "down-off",
      onScreen: false,
      visited: columnRange(guard.y, height, guard.x),
    };
  }

  // Between two obstacles
  for (const point of [...column].reverse()) {
    if (guard.direction === Direction.Up && point < guard.y) {
      return {
        event: "up-stop",
        onScreen: true,
        visited: columnRange(point + 1, guard.y, guard.x),
        next: { direction: Direction.Right, x: guard.x, y: point + 1 },
      };
    }
  }

  for (const point of column) {
    if (guard.direction === Direction.Down && point > guard.y) {
      return {
        event: "down-stop",
        onScreen: true,
        visited: columnRange(guard.y, point - 1, guard.x),
        next: { direction: Direction.Left, x: guard.x, y: point - 1 },
      };
    }
  }
  throw new Error(
    `Did not find anything: ${column}, ${height}, ${guard.x}x${guard.y} ${guard.direction}`
  );
}

function searchRow(row: number[], width: number, guard: Guard) {
  const first = row[0];
  const last = row[row.length - 1];

  //  console.log(row, guard);

  // Above the first obstacle, so heading out
  if (
    guard.direction === Direction.Left &&
    (row.length === 0 || guard.x < first)
  ) {
    return {
      event: `left-off`,
      onScreen: false,
      visited: rowRange(0, guard.x, guard.y),
    };
  }

  // Below the last obstacle, so heading out
  if (
    guard.direction === Direction.Right &&
    (row.length === 0 || guard.x > last)
  ) {
    return {
      event: "right-off",
      onScreen: false,
      visited: rowRange(guard.x, width, guard.y),
    };
  }

  // Between two obstacles
  for (const point of [...row].reverse()) {
    if (guard.direction === Direction.Left && point < guard.x) {
      return {
        event: "left-stop",
        onScreen: true,
        visited: rowRange(point + 1, guard.x, guard.y),
        next: { direction: Direction.Up, x: point + 1, y: guard.y },
      };
    }
  }
  for (const point of row) {
    if (guard.direction === Direction.Right && point > guard.x) {
      return {
        event: "right-stop",
        onScreen: true,
        visited: rowRange(guard.x, point - 1, guard.y),
        next: { direction: Direction.Down, x: point - 1, y: guard.y },
      };
    }
  }
  throw new Error(
    `Did not find anything: ${row}, ${width}, ${guard.x}x${guard.y} ${guard.direction}`
  );
}

function searchNext(data: any) {
  const row = data.obstacleRows.get(data.guard.y) ?? [];
  const column = data.obstacleColumns.get(data.guard.x) ?? [];
  if (
    data.guard.direction === Direction.Up ||
    data.guard.direction === Direction.Down
  ) {
    return searchColumn(column, data.height, data.guard);
  } else if (
    data.guard.direction === Direction.Left ||
    data.guard.direction === Direction.Right
  ) {
    return searchRow(row, data.width, data.guard);
  }
  throw new Error("Now what?", data);
}

function part1() {
  const visited = new Set<string>();
  const data = scanMap(lines);

  //  console.log(data);

  let onScreen = true;
  console.log(
    `== Guard at ${data.guard.x}x${data.guard.y} (${data.guard.direction})`
  );
  while (onScreen) {
    const result = searchNext(data);
    onScreen = result.onScreen;
    for (const cell of result.visited) {
      visited.add(cell);
    }
    console.log(
      `>> Moved ${result.visited.length - 1} cells ${data.guard.direction}: ${
        result.event
      }`
    );
    if (result.next) {
      data.guard.direction = result.next.direction;
      data.guard.x = result.next.x;
      data.guard.y = result.next.y;
      console.log(
        `== Guard at ${data.guard.x}x${data.guard.y} (${data.guard.direction})`
      );
    }
    //    console.log(result, onScreen);
    /*
    const row = data.obstacleRows.get(data.guard.y) ?? [];
    const column = data.obstacleColumns.get(data.guard.x) ?? [];
    if (
      data.guard.direction === Direction.Up ||
      data.guard.direction === Direction.Down
    ) {
      const result = searchColumn(column, data.height, data.guard);
      console.log("Result: ", result);
      onScreen = !result.next;
      for (const cell of result.visited) {
        visited.add(cell);
      }
      if (result.next) {
        data.guard.direction = result.next.direction;
        data.guard.x = result.next.x;
        data.guard.y = result.next.y;
      }
    } else if (
      data.guard.direction === Direction.Left ||
      data.guard.direction === Direction.Right
    ) {
      const result = searchRow(row, data.width, data.guard);
      console.log("Result: ", result);
      onScreen = !result.next;
      for (const cell of result.visited) {
        visited.add(cell);
      }
      if (result.next) {
        data.guard.direction = result.next.direction;
        data.guard.x = result.next.x;
        data.guard.y = result.next.y;
      }
    }
    //    break;
    */
  }
  let count = 0;
  for (const cell of visited) {
    ++count;
    const [x, y] = cell.split("x").map((val) => Number(val));
    const data = lines[y][x];
    if (data === "#") {
      console.error(`Obstacle at ${x}x${y} was visited`);
      break;
    }
    lines[y] = lines[y].substring(0, x) + "X" + lines[y].substring(x + 1);
  }
  for (const line of lines) {
    console.log(line);
  }
  console.log(`** Rendered ${count} visits`);
  console.log(`** Visited: ${visited.size}`);
}

part1();
