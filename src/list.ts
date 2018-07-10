import path = require("path");
import glob = require("glob");
import fs = require("fs-extra");
import _ = require("lodash");

import github from './github-renderer';
import { File } from './types';

const Renderers = {
    github
};

export default async function listAsync(globs: string[], _opts: any): Promise<void> {
    const actualGlobs = globs.length === 0 ? "./*" : globs;
    const fileNames: string[] = [];
    for (const glob of actualGlobs) {
        fileNames.push(...(await expandGlobOrFile(glob)));
    }
    const loadedFiles = await loadFiles(fileNames);
    const opts = {
        wrap: defaultify(_opts.wrap, shouldWrap(loadedFiles))
    }

    console.log(await Renderers.github.renderFiles(loadedFiles, opts));
}

async function expandGlobOrFile(globOrFile: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        if (glob.hasMagic(globOrFile)) {
            glob(globOrFile, { nodir: true }, (err, matches) => {
                matches = matches.slice().sort();
                if (err)
                    reject(err);
                else
                    resolve(matches);
            });
        } else {
            resolve([globOrFile]);
        }
    });
}

async function loadFiles(fileNames: string[]): Promise<File[]> {
    const result: File[] = [];

    for (const fileName of fileNames) {
        const content = await fs.readFile(fileName, { encoding: "utf-8" });
        result.push({ fileName: path.relative(process.cwd(), fileName).replace(/\\/g, '/'), content });
    }

    return result;
}

function shouldWrap(files: File[]) {
    return files.length > 5 || 
        _.sumBy(files, f => f.content.length) > 6000;
}

function defaultify<T>(arg: T | undefined, defaultValue: T): T {
    return arg === undefined ? defaultValue: arg;
}
