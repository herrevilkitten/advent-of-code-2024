import { readFile } from "../file";

function part1() {
  const data = readFile("src/day1/input.txt");

  const lists: { [name: string]: number[] } = { left: [], right: [] };
  const rightCount = new Map<number, number>();
  for (const line of data) {
    const [left, right] = line.trim().split(/\s+/);
    if (left === undefined || right === undefined) {
      continue;
    }
    const l = Number(left);
    const r = Number(right);
    lists.left.push(l);
    lists.right.push(r);
    const count = rightCount.get(r);
    if (count === undefined) {
      rightCount.set(r, 1);
    } else {
      rightCount.set(r, count + 1);
    }
  }

  lists.left.sort((a, b) => a - b);
  lists.right.sort((a, b) => a - b);

  console.log(
    `>> Left size: ${lists.left.length}, right size: ${lists.right.length}`
  );
  console.log(
    `>> Smallest left: ${lists.left[0]}, smallest right: ${lists.right[0]}`
  );

  let difference = 0;
  let similarity = 0;
  for (let i = 0; i < lists.left.length; ++i) {
    const left = lists.left[i];
    const right = lists.right[i];
    difference = difference + Math.abs(left - right);
    similarity = similarity + left * (rightCount.get(left) ?? 0);
  }
  console.log(`** Difference: ${difference}`);
  console.log(`** Similarity: ${similarity}`);
}

part1();
