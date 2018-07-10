import path = require('path');
import { Renderer, File, Options } from './types';

function renderFiles(files: File[], opts: Options): string {
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
    return `&#x1f5ce; **\`${file.fileName}\`**
<blockquote data-dernyfn="${file.fileName}">

\`\`\`${path.extname(file.fileName).substr(1)}
${file.content.replace("```", "")}
\`\`\`

</blockquote>
`; 
}

function parse(content: string): File[] | undefined {
    const files: File[] = [];

    const rgx = /<blockquote data-dernyfn="([^"]+)">[\r]?\n[\r]?\n```\w*[\r]?\n([\S\s]*?)[\r]?\n```[\r]?\n[\r]?\n<\/blockquote>/g;

    let matches = rgx.exec(content);
    if (matches === null) {
        return undefined;
    }

    do {
        files.push({ fileName: matches[1], content: matches[2] });
        matches = rgx.exec(content);
    } while (matches);

    return files;
}

const me: Renderer = { renderFiles, parse };
export default me;
