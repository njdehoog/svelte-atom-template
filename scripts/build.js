import build from './lib/build.js';

const args = process.argv.slice(2);
const production = !(args[0] && args[0] === '--watch');
if (!production) {
    process.env.ROLLUP_WATCH = true
}

build({production});