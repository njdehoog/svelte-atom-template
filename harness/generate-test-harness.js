import { template } from 'lodash';
import fs from 'fs';

const defaults = {
    outputPath: 'public/index.html',
}

export default function testharness(opts = {}) {
    const { outputPath } = Object.assign({}, defaults, opts);

    return {
        name: 'rollup-plugin-testharness',
        async generateBundle(_, bundle) {
            const source = sourceForBundle(bundle);
            fs.writeFileSync(outputPath, source);
        }
      };
}

function sourceForBundle(bundle) {
    const templateHTML = fs.readFileSync('./harness/dcr-interactive__inline.html', 'utf8');

    return template(templateHTML)({
        title: 'Project name',
        headline: 'Some headline',
        standfirst: 'Some standfirst',
        paragraphStyle: 'display: none;',
        paragraphBefore: 'Some paragraph before',
        html: '<div id="gv-atom"></div>', // TODO - get this from the bundle
        js: bundle['bundle.js'].code
    })
}