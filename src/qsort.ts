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
