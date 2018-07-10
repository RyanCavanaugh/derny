import gh from "./github-renderer";
import { File } from "./types";

const files: File[] = [
    { fileName: "foo/bar.txt", content: "What a nice\rDay\r\n for a visit!"},
    { fileName: "miscc", content: ""},
    { fileName: "miscc2/blah", content: "This is a great utiltity, wouldn`t you say?"},
]

function sanity() {
    const s = gh.renderFiles(files, { wrap: true });
    const f = gh.parse(s);
    if (f === undefined) throw new Error("Failed to parse self");
    if (f.length !== files.length) {
        throw new Error(`File length was wrong - got ${f.length}, expected ${files.length}`);
    }
    for (let i = 0; i < f.length; i++) {
        if (f[i].content !== files[i].content) {
            throw new Error(`Expected "${f[i].content}" to be ${files[i].content}"`)
        }
        if (f[i].fileName !== files[i].fileName) {
            throw new Error(`Expected "${f[i].fileName}" to be ${files[i].fileName}"`)
        }
    }

    console.log("Sanity check passed");
}

sanity();