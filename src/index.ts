import commander = require('commander');
import prompt = require('prompt');

import listAsync from './list';
import fetchAsync from './fetch';

commander.version("1.0.0");

commander.command("list [files...]")
    .option("--wrap", "Wrap output in a <details> block")
    .description("Generate a file listing")
    .action(list);

commander.command("fetch <url>")
    .option("-y, --yes", "Don't prompt before writing files")
    .description("Fetch a derny from a URL")
    .action(fetch);

commander.parse(process.argv);

function list(globs: string[], opts: any) {
    listAsync(globs, opts);
}

function fetch(url: string, opts: any) {
    fetchAsync(url).then(s => {
        if (s === undefined) {
            console.log("Didn't find any derny output at that URL");
            return;
        }
        console.log(`Found ${s.length} files:`);
        for (let i = 0; i < s.length; i++) {
            console.log(`  ${i + 1}: ${s[i].fileName} - ${s[i].content.length} characters`);
        }
        console.log("");
        console.log("Options:");
        console.log("  1 - display the contents of file 1");
        console.log("  s - show all files");
        console.log("  w - write all files to current folder (with relative paths)");
        console.log("  q - quit");
        console.log("");
        console.log("What would you like to do?");

        process.stdin.setRawMode && process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function (ch) {
            if (ch === '\u0003' || ch === 'q') {
                process.exit();
            }

            if (Number.isFinite(+ch)) {
                console.log(s[+ch - 1].content);
                return;
            } else if (ch === 'w') {

            }
        });
    });
}
