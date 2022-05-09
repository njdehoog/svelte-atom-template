const loadConfigFile = require('rollup/loadConfigFile');
const path = require('path');
const rollup = require('rollup');

const { promises: { readdir }, lstatSync } = require('fs');

const atomsPath = path.resolve(__dirname, '../atoms')
const buildPath = path.resolve(__dirname, '../public/build')

const args = process.argv.slice(2);
const shouldWatch = (args[0] && args[0] === '--watch') || false;
if (shouldWatch) {
    process.env.ROLLUP_WATCH = true
}

loadConfigFile(path.resolve(__dirname, '../rollup.config.js')).then(
  async ({ options, warnings }) => {
    // This prints all deferred warnings
    warnings.flush();

    const atomDirectories = await getDirectories(atomsPath)

    let optionsObj = options[0]
    let buildOptionsList = atomDirectories.map(atomDirectory => {
        return {
            ...optionsObj,
            input: path.join(atomsPath, atomDirectory, 'main.js'),
            output: {
                 ...optionsObj.output[0],
                file: path.join(buildPath, atomDirectory, 'bundle.js'),
            }
        }
    })

    for (let buildOptions of buildOptionsList) {
        const bundle = await rollup.rollup(buildOptions);
        await bundle.write(buildOptions.output);
    }

    if (shouldWatch) {
        const watcher = rollup.watch(buildOptionsList);

        // This will make sure that bundles are properly closed after each run
        watcher.on('event', ({ result }) => {
            if (result) {
                result.close();
            }
        });
    }
  }
);

async function getDirectories(srcPath) {
    let fileList = await readdir(srcPath);
    
    return fileList.filter(file => {
                return lstatSync(path.join(srcPath, file)).isDirectory();
            })
}