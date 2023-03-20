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
  for (const command of tokenize(line)) {
    const steps = parse(command);
    console.log(`Input ${JSON.stringify(command)}`);
    console.log(`Output ${JSON.stringify(steps)}`);
  }
}

// Chain.
type C = {
  type: 'c';
};

type MagicCircle = {
  initialStitchCount: number;
  type: 'mc';
};

type MagicEllipse = {
  initialExtentionStitchCount: number;
  type: 'me';
};

type StartGroup = C | MagicCircle | MagicEllipse;

// Single crochet.
type Sc = {
  type: 'sc';
};

// Increase.
type Inc = {
  type: 'inc';
};

// Increase assisted with a decrease.
type IncD = {
  type: 'incd';
};

// Decrease.
type Dec = {
  type: 'dec';
};

// Skip.
type Sk = {
  type: 'sk';
};

// Back.
type Bk = {
  type: 'bk';
};

type Stitch = Sc | Inc | IncD | Dec | Sk | Bk;

type StitchGroup = {
  stitches: Array<Stitch | StitchGroup>;
  repeat: number;
};

type Command = StartGroup | Stitch | StitchGroup;

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

type Step = C | ScN | ScMN;

function c(): C {
  return {type: 'c'};
}

function sc(): Sc {
  return {type: 'sc'};
}

function inc(): Inc {
  return {type: 'inc'};
}

function incd(): IncD {
  return {type: 'incd'};
}

function dec(): Dec {
  return {type: 'dec'};
}

function sk(): Sk {
  return {type: 'sk'};
}

function bk(): Bk {
  return {type: 'bk'};
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

function* tokenize(line: string): Generator<Command> {
  yield c();
  yield sc();
  yield inc();
  yield incd();
  yield dec();
  yield sk();
  yield bk();
  yield {
    stitches: [sc(), inc()],
    repeat: 2,
  };
}

function parse(command: Command): Step[] {
  return [c(), scn(1), scmn(1, 2)];
}

processStdin();
