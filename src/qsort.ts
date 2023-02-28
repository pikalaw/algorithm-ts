import assert = require('assert');

export function qsort<Value>(list: readonly Value[]): readonly Value[] {
  if (list.length === 0) return [];

  const pivot = list[0];
  const remains = list.slice(1);
  return [
    ...qsort(remains.filter(v => v <= pivot)),
    pivot,
    ...qsort(remains.filter(v => v > pivot)),
  ];
}

export function qsortInPlace<Value>(list: Value[]): void {
  qsortInternal(list, 0, list.length - 1);
}

function qsortInternal<Value>(list: Value[], from: number, to: number): void {
  if (to - from <= 0) return;

  const pivotIndex = partition(list, from, to);
  qsortInternal(list, from, pivotIndex - 1);
  qsortInternal(list, pivotIndex + 1, to);
}

function partition<Value>(list: Value[], from: number, to: number): number {
  assert(from <= to);

  if (from === to) return from;

  const pivot = list[from];
  let [a, b] = [from, to];

  while (a <= b) {
    if (list[a] <= pivot) {
      a++;
      continue;
    } else {
      [list[a], list[b]] = [list[b], list[a]];
      b--;
    }
  }

  if (list[b] < list[from]) {
    [list[from], list[b]] = [list[b], list[from]];
  }

  return b;
}
