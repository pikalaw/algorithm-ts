import {bfs, dfs, Graph} from '../src/graph';

function linearGraph(nodes: String[]): Graph<String> {
  return (parent: String) => {
    const i = nodes.findIndex(x => x === parent);
    if (i >= 0 && i < nodes.length - 1) {
      return [nodes[i + 1]].values();
    }
    return [].values();
  };
}

function cyclicGraph(nodes: String[]): Graph<String> {
  return (parent: String) => {
    const i = nodes.findIndex(x => x === parent);
    if (i >= 0 && i < nodes.length - 1) {
      return [nodes[i + 1]].values();
    } else if (i === nodes.length - 1) {
      return [nodes[0]].values();
    }
    return [].values();
  };
}

function emptyGraph(): Graph<String> {
  return () => [].values();
}

describe('dfs', () => {
  it('should work for a linear list', () => {
    const handlerSpy = jasmine.createSpy('handler').and.returnValue(true);

    dfs(linearGraph(['a', 'b', 'c']), 'a', handlerSpy);

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

    dfs(cyclicGraph(['a', 'b', 'c']), 'b', handlerSpy);

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

    dfs(emptyGraph(), 'z', handlerSpy);

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

    dfs(linearGraph(['a', 'b', 'z', 'c']), 'a', handlerSpy);

    expect(handlerSpy.calls.allArgs())
      .withContext(`${handlerSpy.calls.allArgs()}`)
      .toEqual([
        ['a', undefined],
        ['b', 'a'],
        ['z', 'b'],
      ]);
  });
});

describe('bfs', () => {
  it('should work for a linear list', () => {
    const handlerSpy = jasmine.createSpy('handler').and.returnValue(true);

    bfs(linearGraph(['a', 'b', 'c']), 'a', handlerSpy);

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

    bfs(cyclicGraph(['a', 'b', 'c']), 'b', handlerSpy);

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

    bfs(testGraph, 'a', handlerSpy);

    expect(handlerSpy.calls.allArgs())
      .withContext(`${handlerSpy.calls.allArgs()}`)
      .toEqual([
        ['a', undefined],
        ['b', 'a'],
        ['c', 'a'],
        ['d', 'b'],
        ['e', 'b'],
        ['f', 'c'],
        ['g', 'c'],
      ]);
  });

  it('should work for node NOT on the graph', () => {
    const handlerSpy = jasmine.createSpy('handler').and.returnValue(true);

    bfs(emptyGraph(), 'z', handlerSpy);

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

    bfs(linearGraph(['a', 'b', 'z', 'c']), 'a', handlerSpy);

    expect(handlerSpy.calls.allArgs())
      .withContext(`${handlerSpy.calls.allArgs()}`)
      .toEqual([
        ['a', undefined],
        ['b', 'a'],
        ['z', 'b'],
      ]);
  });
});
