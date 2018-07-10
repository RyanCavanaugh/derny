import request = require('request');
import octokit = require('@octokit/rest');
import { File } from './types';

const octo = new octokit();

export default function fetchAsync(url: string) {
    request(url, { }, (err, _res, body) => {
        if (err) throw err;
    });
}

function rewriteUrl(url: string) {

}

async function routeGithubUrl(url: string): Promise<File[] | undefined> {
    const rgx = /https?:\/\/(?:www\.)github.com\/(\w+)\/(\w+)\/issues\/(\d+)/i;
    const match = rgx.exec(url);
    if (match === null) {
        return undefined;
    }
    const issue = await octo.issues.get({ owner: match[1], repo: match[2], number: +match[3] });
}

request.get(url).

