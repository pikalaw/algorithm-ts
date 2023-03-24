// https://timhutton.github.io/crochet-simulator
import * as readline from 'readline';

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

type MagicCircle = {
  initialStitchCount: number;
  patternType: 'mc';
};

type MagicEllipse = {
  extendedStitchCount: number;
  patternType: 'me';
};

type Bend = {
  roundStitchCount: number;
  depth: number;
  patternType: 'bend';
};

type Pattern = MagicCircle | MagicEllipse | Bend;

type Command = Pattern | Stitch | StitchGroup;

interface Crocheter<Output> {
  execute(stitch: Stitch): Generator<Output>;
}

interface Formatter<Output> {
  format(output: Output): string | undefined;
  flush(): string | undefined;
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

function bend(roundStitchCount: number, depth: number): Bend {
  return {
    roundStitchCount,
    depth,
    patternType: 'bend',
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
  crocheter: Crocheter<Output>,
  formatter: Formatter<Output>
) {
  rl.question('\nStitches: ', line => {
    process.stdout.write('\n');
    let firstInLine = true;
    for (const output of processLine(line, crocheter, formatter)) {
      if (firstInLine) {
        process.stdout.write(' ');
      } else {
        process.stdout.write(',');
      }
      process.stdout.write(output);
      firstInLine = false;
    }
    process.stdout.write('\n');
    processStdin(rl, crocheter, formatter);
  });
}

function* processLine<Output>(
  line: string,
  crocheter: Crocheter<Output>,
  formatter: Formatter<Output>
): Generator<string> {
  for (const command of tokenizeLine(line)) {
    for (const stitch of extractStitches(command)) {
      for (const step of crocheter.execute(stitch)) {
        const result = formatter.format(step);
        if (result) yield result;
      }
    }
  }
  const result = formatter.flush();
  if (result) yield result;
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

  if (piece.startsWith('bend')) {
    const matches = piece.match(/bend\((\d+),(\d)\)/);
    if (!matches) throw new Error(`Unknown input '${piece}'.`);

    const roundStitchCount = Number(matches[1]);
    if (!isPositiveNumber(roundStitchCount)) {
      throw new Error(`Unknown input '${piece}'.`);
    }

    const depth = Number(matches[2]);
    if (!isPositiveNumber(depth)) {
      throw new Error(`Unknown input '${piece}'.`);
    }

    yield bend(roundStitchCount, depth);
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
    case 'bend':
      yield* extractStitchesFromBend(pattern);
      break;
    default:
      throw new Error(`Unexpected pattern ${JSON.stringify(pattern)}`);
  }
}

function* extractStitchesFromMagicCircle(mc: MagicCircle): Generator<Stitch> {
  yield c();
  yield c();
  for (let i = 0; i < mc.initialStitchCount - 1; i++) {
    yield bk();
    yield sc();
  }
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

function* extractStitchesFromBend(bend: Bend): Generator<Stitch> {
  if (bend.depth !== 2) {
    throw new Error(
      `Supporting depth of 2 for bend for now but found ${JSON.stringify(bend)}`
    );
  }

  const segmentLength = Math.floor(bend.roundStitchCount / (bend.depth * 2));
  let stitchCountInLoop = 0;

  for (let i = 0; i < segmentLength; i++) {
    yield sc();
  }
  stitchCountInLoop += segmentLength;

  for (let i = 0; i < 2 * segmentLength; i++) {
    yield c();
  }
  stitchCountInLoop += 2 * segmentLength;

  for (let i = 0; i < segmentLength; i++) {
    yield sc();
  }
  stitchCountInLoop += segmentLength;

  for (let i = 0; i < bend.roundStitchCount - stitchCountInLoop; i++) {
    yield sc();
  }

  stitchCountInLoop = 0;

  for (let i = 0; i < segmentLength; i++) {
    yield sc();
  }
  stitchCountInLoop += segmentLength;

  for (let i = 0; i < bend.roundStitchCount; i++) {
    yield bk();
  }

  for (let i = 0; i < 2 * segmentLength; i++) {
    yield sc();
  }
  stitchCountInLoop += 2 * segmentLength;

  for (let i = 0; i < bend.roundStitchCount; i++) {
    yield sk();
  }

  for (let i = 0; i < segmentLength; i++) {
    yield sc();
  }
  stitchCountInLoop += segmentLength;

  for (let i = 0; i < bend.roundStitchCount - stitchCountInLoop; i++) {
    yield sc();
  }
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
}

class StepFormatter implements Formatter<Step> {
  private lastStepStr = '';
  private lastStepCount = 0;

  format(step: Step): string | undefined {
    const stepStr = StepFormatter.formatStep(step);
    if (this.lastStepCount === 0) {
      this.lastStepStr = stepStr;
      this.lastStepCount = 1;
      return undefined;
    }
    if (this.lastStepStr === stepStr) {
      this.lastStepCount++;
      return undefined;
    }
    const result = StepFormatter.formatGroup(
      this.lastStepStr,
      this.lastStepCount
    );
    this.lastStepStr = stepStr;
    this.lastStepCount = 1;
    return result;
  }

  flush(): string | undefined {
    if (this.lastStepCount > 0) {
      const result = StepFormatter.formatGroup(
        this.lastStepStr,
        this.lastStepCount
      );
      this.lastStepCount = 0;
      return result;
    } else {
      return undefined;
    }
  }

  private static formatStep(step: Step): string {
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

  private static formatGroup(stepStr: string, repeat: number): string {
    if (repeat === 1) return stepStr;
    else return `(${stepStr})${repeat}`;
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
  const formatter = new StepFormatter();

  processStdin(rl, crocheter, formatter);
}

if (require.main === module) {
  main();
}
