import {qsort, qsortInPlace} from '../src/qsort';

describe('qsort', () => {
  it('should sort a reversed list', () => {
    expect(qsort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a sorted list', () => {
    expect(qsort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a list of same elements', () => {
    expect(qsort([2, 2, 2, 2, 2])).toEqual([2, 2, 2, 2, 2]);
  });

  it('should sort an empty list', () => {
    expect(qsort([])).toEqual([]);
  });
});

describe('qsortInPlace', () => {
  it('should sort a reversed list', () => {
    const list: number[] = [5, 4, 3, 2, 1];
    qsortInPlace(list);
    expect(list).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a sorted list', () => {
    const list: number[] = [1, 2, 3, 4, 5];
    qsortInPlace(list);
    expect(list).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sort a list of same elements', () => {
    const list: number[] = [2, 2, 2, 2, 2];
    qsortInPlace(list);
    expect(list).toEqual([2, 2, 2, 2, 2]);
  });

  it('should sort an empty list', () => {
    const list: number[] = [];
    qsortInPlace(list);
    expect(list).toEqual([]);
  });

  it('should perform faster than plain qsort', () => {
    const list = Array.from({length: 10000}, () =>
      Math.floor(Math.random() * 10000)
    );

    console.time('qsort');
    const qsortStartTime = performance.now();
    qsort(list);
    const qsortEndTime = performance.now();
    console.timeEnd('qsort');

    console.time('qsortInPlace');
    const qsortInPlaceStartTime = performance.now();
    qsortInPlace(list);
    const qsortInPlaceEndTime = performance.now();
    console.timeEnd('qsortInPlace');

    expect(qsortInPlaceEndTime - qsortInPlaceStartTime).toBeLessThan(
      qsortEndTime - qsortStartTime
    );
  });
});
