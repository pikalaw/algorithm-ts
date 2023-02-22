import {qsort} from '../src/qsort';

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
