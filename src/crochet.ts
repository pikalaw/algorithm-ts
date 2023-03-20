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
type Chain = {
  type: 'c';
};

type MagicCircle = {
  initialStitchCount: number;
  type: 'mc';
};

type MagicEllipse = {
  extendedStitchCount: number;
  type: 'me';
};

type StartGroup = Chain | MagicCircle | MagicEllipse;

// Single crochet.
type SingleCrochet = {
  type: 'sc';
};

// Increase.
type Increase = {
  type: 'inc';
};

// Increase assisted with a decrease.
type IncreaseDecrease = {
  type: 'incd';
};

// Decrease.
type Decrease = {
  type: 'dec';
};

// Skip.
type Skip = {
  type: 'sk';
};

// Back.
type Back = {
  type: 'bk';
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

type Step = Chain | ScN | ScMN;

function magicCircle(initialStitchCount: number): MagicCircle {
  return {
    initialStitchCount,
    type: 'mc',
  };
}

function magicEllipse(extendedStitchCount: number): MagicEllipse {
  return {
    extendedStitchCount,
    type: 'me',
  };
}

function c(): Chain {
  return {type: 'c'};
}

function sc(): SingleCrochet {
  return {type: 'sc'};
}

function inc(): Increase {
  return {type: 'inc'};
}

function incdec(): IncreaseDecrease {
  return {type: 'incd'};
}

function dec(): Decrease {
  return {type: 'dec'};
}

function sk(): Skip {
  return {type: 'sk'};
}

function bk(): Back {
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
  yield incdec();
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
