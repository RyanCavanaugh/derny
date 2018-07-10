import commander = require('commander');
import glob = require("glob");
import fs = require("fs-extra");
import path = require("path");

commander.version("1.0.0");

commander.command("list [files...]")
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
    console.log(await renderGFM(await loadFiles(fileNames)));
}

async function expandGlobOrFile(globOrFile: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        if (glob.hasMagic(globOrFile)) {
            glob(globOrFile, { nodir: true }, (err, matches) => {
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

function renderGFM(files: File[]) {
    return `<details open>
<summary>File Listing (${files.length} files)</summary>

${files.map(renderFileGFM).join("\r\n")}
</details>`;
}

function renderFileGFM(file: File) {
    return `&#x1f5ce; **${path.relative(process.cwd(), file.fileName)}**
<!-- file start -->
\`\`\`${path.extname(file.fileName).substr(1)}
${file.content.replace("```", "")}
\`\`\`
<!-- file end -->`; 
}

type File = { fileName: string, content: string };