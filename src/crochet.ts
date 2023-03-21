import * as readline from 'readline';

type MagicCircle = {
  initialStitchCount: number;
  patternType: 'mc';
};

type MagicEllipse = {
  extendedStitchCount: number;
  patternType: 'me';
};

type Pattern = MagicCircle | MagicEllipse;

type Chain = {
  stitchType: 'c';
};

type SingleCrochet = {
  stitchType: 'sc';
};

type Increase = {
  stitchType: 'inc';
};

type IncreaseDecrease = {
  stitchType: 'incd';
};

type Decrease = {
  stitchType: 'dec';
};

type Skip = {
  stitchType: 'sk';
};

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

interface Crocheter<Output> {
  execute(stitch: Stitch): Generator<Output>;
  format(output: Output): string;
}

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

function processStdin<Output>(
  rl: readline.Interface,
  crocheter: Crocheter<Output>
) {
  rl.question('\nStitches: ', line => {
    process.stdout.write('\n');
    for (const output of processLine(line, crocheter)) {
      process.stdout.write(' ');
      process.stdout.write(output);
    }
    process.stdout.write('\n');
    processStdin(rl, crocheter);
  });
}

function* processLine<Output>(
  line: string,
  crocheter: Crocheter<Output>
): Generator<string> {
  for (const command of tokenizeLine(line)) {
    for (const stitch of extractStitches(command)) {
      for (const step of crocheter.execute(stitch)) {
        yield crocheter.format(step);
      }
    }
  }
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

function* extractStitches(command: Command): Generator<Stitch> {
  if (isStitch(command)) {
    yield command;
  } else if (isStitchGroup(command)) {
    yield* extractStitchesFromStitchGroup(command);
  } else if (isPattern(command)) {
    yield* extractStitchesFromPattern(command);
  } else {
    throw new Error(`Unexpected command ${JSON.stringify(command)}`);
  }
}

function* extractStitchesFromStitchGroup(
  group: StitchGroup
): Generator<Stitch> {
  for (let i = 0; i < group.repeat; i++) {
    for (const command of group.commands) {
      yield* extractStitches(command);
    }
  }
}

function* extractStitchesFromPattern(pattern: Pattern): Generator<Stitch> {
  switch (pattern.patternType) {
    case 'mc':
      yield* extractStitchesFromMagicCircle(pattern);
      break;
    case 'me':
      yield* extractStitchesFromMagicEllipse(pattern);
      break;
    default:
      throw new Error(`Unexpected pattern ${JSON.stringify(pattern)}`);
  }
}

function* extractStitchesFromMagicCircle(mc: MagicCircle): Generator<Stitch> {
  yield c();
  yield c();
  yield bk();
  for (let i = 0; i < mc.initialStitchCount - 1; i++) {
    yield sc();
    yield bk();
  }
  sk();
}

function* extractStitchesFromMagicEllipse(me: MagicEllipse): Generator<Stitch> {
  yield c();
  for (let i = 0; i < me.extendedStitchCount; i++) {
    yield c();
  }
  yield c();
  yield c();
  yield bk();

  yield sc();
  yield bk();

  for (let i = 0; i < me.extendedStitchCount; i++) {
    yield bk();
    yield sc();
    yield bk();
  }

  yield bk();
  yield sc();
  yield bk();
  yield sc();
  yield bk();
  yield sc();

  for (let i = 0; i < me.extendedStitchCount; i++) {
    yield sc();
  }
  yield sc();
  yield bk();
  yield sc();
  yield sk();
}

// The cs-n pattern from https://timhutton.github.io/crochet-simulator.
type ScN = {
  stitchAgo: number;
  timType: 'sc-n';
};

// The cs-m-n pattern from https://timhutton.github.io/crochet-simulator.
type ScMN = {
  stitchAgo1: number;
  stitchAgo2: number;
  timType: 'sc-m-n';
};

type Step = Chain | ScN | ScMN;

function isChain(step: Step): step is Chain {
  return 'stitchType' in step;
}

function isScN(step: Step): step is ScN {
  return 'timType' in step && step.timType === 'sc-n';
}

function isScMN(step: Step): step is ScMN {
  return 'timType' in step && step.timType === 'sc-m-n';
}

class TimCrocheter implements Crocheter<Step> {
  private offset = 0;

  *execute(stitch: Stitch): Generator<Step> {
    switch (stitch.stitchType) {
      case 'c':
        yield c();
        break;
      case 'sk':
        this.offset--;
        break;
      case 'bk':
        this.offset++;
        break;
      case 'sc':
        yield scn(this.offset);
        break;
      case 'inc':
        yield scn(this.offset++);
        yield scn(this.offset);
        break;
      case 'dec':
        yield scmn(this.offset--, this.offset);
        break;
      case 'incd':
        yield scn(this.offset);
        yield scmn(this.offset++, this.offset);
        yield scn(this.offset);
        break;
      default:
        throw new Error(`Unknown stitch ${stitch}`);
    }
  }

  format(step: Step): string {
    if (isChain(step)) {
      return 'c';
    } else if (isScN(step)) {
      return `sc-${step.stitchAgo}`;
    } else if (isScMN(step)) {
      return `sc-${step.stitchAgo1}-${step.stitchAgo2}`;
    } else {
      throw new Error(`Unknown step ${JSON.stringify(step)}`);
    }
  }
}

function scn(n: number): ScN {
  return {
    stitchAgo: n,
    timType: 'sc-n',
  };
}

function scmn(m: number, n: number): ScMN {
  return {
    stitchAgo1: m,
    stitchAgo2: n,
    timType: 'sc-m-n',
  };
}

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const crocheter = new TimCrocheter();

  processStdin(rl, crocheter);
}

if (require.main === module) {
  main();
}
