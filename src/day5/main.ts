import { readFile } from "../file";
const lines = readFile("src/day5/input.txt");

const pageOrders = new Map<number, number[]>();
const updates: number[][] = [];

for (const line of lines) {
  if (line.length === 0) {
    continue;
  }
  const match = line.match(/(\d+)\|(\d+)/);
  if (match) {
    const lookup = Number(match[2]);
    const prereq = Number(match[1]);
    const pageOrder = pageOrders.get(lookup);
    if (!pageOrder) {
      pageOrders.set(lookup, [prereq]);
    } else {
      pageOrder.push(prereq);
    }
  } else {
    updates.push(line.split(/,/).map(Number));
  }
}

console.log(`>> ${pageOrders.size} rules`);
console.log(`>> ${updates.length} updates`);

function part1() {
  let total = 0;
  for (const update of updates) {
    const scannedPages = new Set<number>();
    const failIfPages = new Set<number>();

    let pass = true;
    for (const page of update) {
      //console.log(`>> Checking ${page}`);
      //console.log(`>> fail if in ${[...failIfPages]}`);
      scannedPages.add(page);
      if (failIfPages.has(page)) {
        pass = false;
        break;
      }
      const prereqPages = pageOrders.get(page);
      //      console.log(`>> Prereq for ${page} is ${prereqPages}`);
      if (prereqPages === undefined) {
        continue;
      }
      for (const prereq of prereqPages) {
        if (scannedPages.has(prereq)) {
          continue;
        }
        failIfPages.add(prereq);
      }
    }
    if (pass) {
      const pages = [...scannedPages];
      const center = Math.floor(pages.length / 2);
      total = total + pages[center];
      console.log(`>> Success: ${pages} value: ${pages[center]}`);
    }
  }
  console.log(`** Total: ${total}`);
}

function part2() {
  let total = 0;
  for (const update of updates) {
    const scannedPages = new Set<number>();
    const failIfPages = new Set<number>();
    let failPoint: number | undefined = undefined;

    let pass = true;
    do {
      for (let i = 0; i < update.length; ++i) {
        const page = update[i];
        //console.log(`>> Checking ${page}`);
        //console.log(`>> fail if in ${[...failIfPages]}`);
        scannedPages.add(page);
        if (failIfPages.has(page)) {
          failPoint = i;
          pass = false;
          break;
        }
        const prereqPages = pageOrders.get(page);
        //      console.log(`>> Prereq for ${page} is ${prereqPages}`);
        if (prereqPages === undefined) {
          continue;
        }
        for (const prereq of prereqPages) {
          if (scannedPages.has(prereq)) {
            continue;
          }
          failIfPages.add(prereq);
        }
      }
    } while (!pass);
  }
  console.log(`** Total: ${total}`);
}

part2();
