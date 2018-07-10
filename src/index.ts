import commander = require('commander');
import glob = require("glob");
import fs = require("fs-extra");
import path = require("path");
import _ = require("lodash");

commander.version("1.0.0");

commander.command("list [files...]")
    .option("--wrap", "Wrap output in a <details> block")
    .description("Generate a file listing")
    .action(list);

commander.parse(process.argv);

function list(globs: string[], _opts: any) {
    listAsync(globs, _opts);
}

async function listAsync(globs: string[], _opts: any): Promise<void> {
    const actualGlobs = globs.length === 0 ? "./*" : globs;
    const fileNames: string[] = [];
    for (const glob of actualGlobs) {
        fileNames.push(...(await expandGlobOrFile(glob)));
    }
    const loadedFiles = await loadFiles(fileNames);
    const opts = {
        wrap: defaultify(_opts.wrap, shouldWrap(loadedFiles))
    }
    console.log(await renderGFM(loadedFiles, opts));
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
        result.push({ fileName, content });
    }

    return result;
}

function renderGFM(files: File[], opts: Options) {
    if (opts.wrap) {
        return `<details open>
<summary>File Listing (${files.length} files)</summary>

${files.map(renderFileGFM).join("\r\n")}
</details>`;
    } else {
        return files.map(renderFileGFM).join("\r\n");

    }
}

function renderFileGFM(file: File) {
    return `&#x1f5ce; **\`${path.relative(process.cwd(), file.fileName)}\`**
<blockquote>

\`\`\`${path.extname(file.fileName).substr(1)}
${file.content.replace("```", "")}
\`\`\`

</blockquote>`; 
}

type File = { fileName: string, content: string };

interface Options {
    wrap: boolean;
}

function shouldWrap(files: File[]) {
    return files.length > 5 || 
        _.sumBy(files, f => f.content.length) > 6000;
}

function defaultify<T>(arg: T | undefined, defaultValue: T): T {
    return arg === undefined ? defaultValue: arg;
}
