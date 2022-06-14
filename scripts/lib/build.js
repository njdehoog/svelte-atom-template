import loadConfigFile from 'rollup/loadConfigFile';
import path from 'path';
import * as rollup from 'rollup';
import childProcess from 'child_process';
import chokidar from 'chokidar';
import {listDirectories} from './fileSystem.js';
import { spawn } from 'child_process';

const atomsPath = path.resolve('atoms')
const buildPath = path.resolve('build')
const assetsPath = path.resolve('assets')

export default async function build({production}) {
    const {options, warnings} = await loadConfigFile(path.resolve('rollup.config.js'));

    // This prints all deferred warnings
    warnings.flush();

    const atomDirectories = await listDirectories(atomsPath)

    let optionsObj = options[0]
    let buildOptionsList = atomDirectories.map(atomDirectory => {

        const atomName = atomDirectory.charAt(0).toUpperCase() + atomDirectory.slice(1)
        return {
            ...optionsObj,
            input: path.join(atomsPath, atomDirectory, 'main.js'),
            output: {
                ...optionsObj.output[0],
                file: path.join(buildPath, 'atoms', atomDirectory, 'bundle.js'),
                name: 'atom' + atomName,
            }
        }
    })

    if (!production) {
        const watcher = rollup.watch(buildOptionsList);

        // This will make sure that bundles are properly closed after each run
        watcher.on('event', ({ result, error }) => {
            if (error) {
                console.error(error);
            }

            if (result) {
                result.close();
            }
        });
    }

    for (let buildOptions of buildOptionsList) {
        const bundle = await rollup.rollup(buildOptions);
        await bundle.write(buildOptions.output);
    }

    // copy assets folder to build folder
    copyAssets(assetsPath, buildPath)

    if (!production) {
        chokidar.watch(assetsPath, {
            ignoreInitial: true
        })
        .on('all', () => {
            copyAssets(assetsPath, buildPath)
        })
    }

    !production && serve();
}

function copyAssets(srcPath, destPath) {
    childProcess.execSync(`cp -r ${srcPath} ${destPath}`)
}

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}
    
    if (server) return;
    server = spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
    });

    process.on('SIGTERM', toExit);
    process.on('exit', toExit);
}