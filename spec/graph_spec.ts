import {dfs} from '../src/graph';

describe('dfs', () => {
  it('should work for a linear list', () => {
    const handlerSpy = jasmine.createSpy('handler').and.returnValue(true);
    const testList = ['a', 'b', 'c'];
    const testGraph = (parent: String) => {
      const i = testList.findIndex(x => x === parent);
      if (i >= 0 && i < testList.length - 1) {
        return [testList[i + 1]].values();
      }
      return [].values();
    };

    dfs(testGraph, 'a', handlerSpy);

    expect(handlerSpy.calls.allArgs())
      .withContext(`${handlerSpy.calls.allArgs()}`)
      .toEqual([
        ['a', undefined],
        ['b', 'a'],
        ['c', 'b'],
      ]);
  });

  it('should work for a cyclic list', () => {
    const handlerSpy = jasmine.createSpy('handler').and.returnValue(true);
    const testList = ['a', 'b', 'c'];
    const testGraph = (parent: String) => {
      const i = testList.findIndex(x => x === parent);
      if (i >= 0 && i < testList.length - 1) {
        return [testList[i + 1]].values();
      } else if (i === testList.length - 1) {
        return [testList[0]].values();
      }
      return [].values();
    };

    dfs(testGraph, 'b', handlerSpy);

    expect(handlerSpy.calls.allArgs())
      .withContext(`${handlerSpy.calls.allArgs()}`)
      .toEqual([
        ['b', undefined],
        ['c', 'b'],
        ['a', 'c'],
      ]);
  });

  it('should work for a tree', () => {
    const handlerSpy = jasmine.createSpy('handler').and.returnValue(true);
    const testGraph = (parent: String) => {
      switch (parent) {
        case 'a':
          return ['b', 'c'].values();
        case 'b':
          return ['d', 'e'].values();
        case 'c':
          return ['f', 'g'].values();
        default:
          return [].values();
      }
    };

    dfs(testGraph, 'a', handlerSpy);

    expect(handlerSpy.calls.allArgs())
      .withContext(`${handlerSpy.calls.allArgs()}`)
      .toEqual([
        ['a', undefined],
        ['b', 'a'],
        ['d', 'b'],
        ['e', 'b'],
        ['c', 'a'],
        ['f', 'c'],
        ['g', 'c'],
      ]);
  });

  it('should work for node NOT on the graph', () => {
    const handlerSpy = jasmine.createSpy('handler').and.returnValue(true);
    const testGraph = () => [].values();

    dfs(testGraph, 'z', handlerSpy);

    expect(handlerSpy.calls.allArgs())
      .withContext(`${handlerSpy.calls.allArgs()}`)
      .toEqual([['z', undefined]]);
  });

  it('should terminate early upon request', () => {
    const handlerSpy = jasmine
      .createSpy('handler')
      .and.returnValue(true)
      .withArgs('z', jasmine.any(String))
      .and.returnValue(false);
    const testGraph = (parent: String) => {
      switch (parent) {
        case 'a':
          return ['b'].values();
        case 'b':
          return ['z'].values();
        case 'z':
          return ['c'].values();
        default:
          return [].values();
      }
    };

    dfs(testGraph, 'a', handlerSpy);

    expect(handlerSpy.calls.allArgs())
      .withContext(`${handlerSpy.calls.allArgs()}`)
      .toEqual([
        ['a', undefined],
        ['b', 'a'],
        ['z', 'b'],
      ]);
  });
});
