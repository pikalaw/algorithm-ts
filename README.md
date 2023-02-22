cd project

npm init

npm i -D typescript @types/node
npx tsc --init

vi tsconfig.json
// change outDir to build, rootDir

npm i -D gts
npx gts init

npm i -D jasmine @types/jasmine ts-node
npx jasmine init

vi jasmine.json
// Change spec to *.ts

vi package.json
// change test to ts-node node_modules/jasmine/bin/jasmine

vi .gitignore
node_modules/
build

