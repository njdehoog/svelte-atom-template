import { template } from 'lodash';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises, lstatSync } from 'fs';
import config from '../project.config.js';

const defaults = {
    outputPath: 'build',
}

const atomsPath = path.resolve(__dirname, 'atoms')

export default function testharness(opts = {}) {
    const { outputPath } = Object.assign({}, defaults, opts);

    return {
        name: 'rollup-plugin-testharness',
        async writeBundle(outputOptions, bundle) {
            let indexHTML = await sourceForIndex();
            fs.writeFileSync(path.join(outputPath, 'index.html'), indexHTML);

            const atomName = outputOptions.name.slice(4).toLowerCase();
            const source = sourceForBundle(bundle, atomName);
            fs.writeFileSync(path.join(outputPath, atomName + '.html'), source);
        }
      };
}

async function sourceForIndex() {
    const templateHTML = fs.readFileSync('./harness/_index.html', 'utf8');

    const atomDirectories = await getDirectories(atomsPath)

    return template(templateHTML)({
        atoms: atomDirectories,
    })
}

function sourceForBundle(bundle, atomName) {
    const templateHTML = fs.readFileSync('./harness/dcr-interactive__immersive.html', 'utf8');

    return template(templateHTML)({
        title: config.title,
        headline: config.placeholders.headline,
        standfirst: config.placeholders.standfirst,
        paragraphStyle: config.placeholders.paragraphBefore ? 'display: block;' : 'display: none;',
        paragraphBefore: config.placeholders.paragraphBefore,
        stylesheet: path.join('atoms', atomName, 'bundle.css'),
        html: config.html,
        js: path.join('atoms', atomName, 'bundle.js'),
    })
}

async function getDirectories(srcPath) {
    let fileList = await fsPromises.readdir(srcPath);
    
    return fileList.filter(file => {
                return lstatSync(path.join(srcPath, file)).isDirectory();
            })
}