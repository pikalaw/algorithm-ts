import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function processStdin() {
  rl.question('Input: ', line => {
    processLine(line);
    processStdin();
  });
}

function processLine(line: string) {
  for (const command of tokenizeLine(line)) {
    console.log(`Got ${JSON.stringify(command)}`);
    for (const step of translate(command)) {
      console.log(`Step ${JSON.stringify(step)}`);
    }
  }
}

// Chain.
type Chain = {
  stitchType: 'c';
};

type MagicCircle = {
  initialStitchCount: number;
  patternType: 'mc';
};

type MagicEllipse = {
  extendedStitchCount: number;
  patternType: 'me';
};

type Pattern = MagicCircle | MagicEllipse;

// Single crochet.
type SingleCrochet = {
  stitchType: 'sc';
};

// Increase.
type Increase = {
  stitchType: 'inc';
};

// Increase assisted with a decrease.
type IncreaseDecrease = {
  stitchType: 'incd';
};

// Decrease.
type Decrease = {
  stitchType: 'dec';
};

// Skip.
type Skip = {
  stitchType: 'sk';
};

// Back.
type Back = {
  stitchType: 'bk';
};

type Stitch =
  | Chain
  | SingleCrochet
  | Increase
  | IncreaseDecrease
  | Decrease
  | Skip
  | Back;

type StitchGroup = {
  commands: Command[];
  repeat: number;
};

type Command = Pattern | Stitch | StitchGroup;

// The cs-n pattern from https://timhutton.github.io/crochet-simulator.
type ScN = {
  stitchAgo: number;
  type: 'sc-n';
};

// The cs-m-n pattern from https://timhutton.github.io/crochet-simulator.
type ScMN = {
  stitchAgo1: number;
  stitchAgo2: number;
  type: 'sc-m-n';
};

type Step = Chain | ScN | ScMN;

function isStitch(c: Command): c is Stitch {
  return 'stitchType' in c;
}

function isStitchGroup(c: Command): c is StitchGroup {
  return 'repeat' in c;
}

function isPattern(c: Command): c is Pattern {
  return 'patternType' in c;
}

function magicCircle(initialStitchCount: number): MagicCircle {
  return {
    initialStitchCount,
    patternType: 'mc',
  };
}

function magicEllipse(extendedStitchCount: number): MagicEllipse {
  return {
    extendedStitchCount,
    patternType: 'me',
  };
}

function c(): Chain {
  return {stitchType: 'c'};
}

function sc(): SingleCrochet {
  return {stitchType: 'sc'};
}

function inc(): Increase {
  return {stitchType: 'inc'};
}

function incdec(): IncreaseDecrease {
  return {stitchType: 'incd'};
}

function dec(): Decrease {
  return {stitchType: 'dec'};
}

function sk(): Skip {
  return {stitchType: 'sk'};
}

function bk(): Back {
  return {stitchType: 'bk'};
}

function scn(n: number): ScN {
  return {
    stitchAgo: n,
    type: 'sc-n',
  };
}

function scmn(m: number, n: number): ScMN {
  return {
    stitchAgo1: m,
    stitchAgo2: n,
    type: 'sc-m-n',
  };
}

function* tokenizeLine(line: string): Generator<Command> {
  // Ignore comments.
  if (line.startsWith('//')) return;

  for (const linePiece of splitLine(line)) {
    yield* tokenizeLinePiece(linePiece);
  }
}

function splitLine(line: string): string[] {
  const copy = line.split('');
  let bracketDepth = 0;
  for (let i = 0; i < copy.length; i++) {
    if (copy[i] === '[') {
      bracketDepth++;
      continue;
    }
    if (copy[i] === ']') {
      bracketDepth--;
      continue;
    }
    if (copy[i] === ' ' && bracketDepth > 0) {
      copy[i] = '^';
    }
  }

  return copy
    .join('')
    .split(/\s+/)
    .filter(s => s !== '')
    .map(s => s.replace(/\^/g, ' '));
}

function* tokenizeLinePiece(piece: string): Generator<Command> {
  if (piece.startsWith('[')) {
    yield* tokenizeGroup(piece);
  } else {
    yield* tokenizeSingle(piece);
  }
}

function* tokenizeSingle(piece: string): Generator<Command> {
  switch (piece) {
    case 'c':
      yield c();
      return;
    case 'sc':
      yield sc();
      return;
    case 'inc':
      yield inc();
      return;
    case 'incdec':
      yield incdec();
      return;
    case 'dec':
      yield dec();
      return;
    case 'sk':
      yield sk();
      return;
    case 'bk':
      yield bk();
      return;
  }

  if (piece.startsWith('mc')) {
    const matches = piece.match(/mc\((\d+)\)/);
    if (!matches) throw new Error(`Unknown input '${piece}'.`);

    const initialStitchCount = Number(matches[1]);
    if (!isPositiveNumber(initialStitchCount)) {
      throw new Error(`Unknown input '${piece}'`);
    }

    yield magicCircle(initialStitchCount);
    return;
  }

  if (piece.startsWith('me')) {
    const matches = piece.match(/me\((\d+)\)/);
    if (!matches) throw new Error(`Unknown input '${piece}'.`);

    const extendedStitchCount = Number(matches[1]);
    if (!isPositiveNumber(extendedStitchCount)) {
      throw new Error(`Unknown input '${piece}'.`);
    }

    yield magicEllipse(extendedStitchCount);
    return;
  }

  throw new Error(`Unknown input '${piece}'.`);
}

function* tokenizeGroup(piece: string): Generator<StitchGroup> {
  const matches = piece.match(/\[(.+)\](\d+)/);
  if (!matches) throw new Error(`Unknown input '${piece}'.`);

  const [, innerPiece, repeatStr] = matches;
  const repeat = Number(repeatStr);
  if (repeat < 1) throw new Error(`Unknown input '${piece}'.`);

  yield {
    commands: [...tokenizeLine(innerPiece)],
    repeat,
  };
}

function isPositiveNumber(n: number): boolean {
  return n > 0 && n !== Infinity;
}

function* translate(command: Command): Generator<Step> {
  /*
  yield c();
  yield scn(1);
  yield scmn(1, 2);
  */
}

processStdin();
