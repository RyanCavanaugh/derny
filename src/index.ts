import commander = require('commander');

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
    fetchAsync(url, opts);
}
