import { template } from 'lodash';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises, lstatSync } from 'fs';

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
        title: 'Cost of living',
        headline: 'How the cost of living is hammering UK households',
        standfirst: 'After years of stagnation, the impact of rising prices hits especially hard.',
        paragraphStyle: 'display: block;',
        paragraphBefore: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan aliquet mauris vel luctus. Fusce pulvinar, sem in sollicitudin facilisis, risus enim elementum justo, sed imperdiet nisi odio id lacus. Aliquam vel laoreet sem. Vivamus et vulputate enim, vitae aliquam odio. Nullam pulvinar magna non ex eleifend feugiat. Integer volutpat sed odio ut consequat. Etiam sollicitudin faucibus est in accumsan. Nam posuere a nisi non facilisis. Maecenas non diam nec dolor faucibus viverra. Pellentesque vel orci justo. Nullam fermentum risus a orci euismod luctus. Duis ut tincidunt urna.',
        stylesheet: path.join('atoms', atomName, 'bundle.css'),
        html: '<div id="gv-atom"></div>', // TODO - get this from the bundle
        js: path.join('atoms', atomName, 'bundle.js'),
    })
}

async function getDirectories(srcPath) {
    let fileList = await fsPromises.readdir(srcPath);
    
    return fileList.filter(file => {
                return lstatSync(path.join(srcPath, file)).isDirectory();
            })
}