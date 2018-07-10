import request = require('request-promise');
import octokit = require('@octokit/rest');
import { File } from './types';

import github from './github-renderer';

const octo = new octokit();

export default async function fetchAsync(url: string): Promise<File[] | undefined> {    
    const gh = await routeGithubUrl(url);
    if (gh) return gh;

    const body = await request(url);
    console.log(`Fetching ${url}...`);
    return parseFrom(body);
}

function parseFrom(content: string): File[] | undefined {
    return github.parse(content);
}

async function routeGithubUrl(url: string): Promise<File[] | undefined> {
    const rgx = /https?:\/\/(?:www\.)?github.com\/(\w+)\/(\w+)\/issues\/(\d+)/i;
    const match = rgx.exec(url);
    if (match === null) {
        return undefined;
    }
    const [ , owner, repo, number] = match;
    console.log(`Fetching GitHub issue ${owner}/${repo}#${number}`)
    const issue = await octo.issues.get({ owner, repo, number: +number });

    return parseFrom(issue.data.body);
}

