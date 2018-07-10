export interface Renderer {
    renderFiles(files: File[], opts: Options): string;
    parse(content: string): File[] | undefined;
}

export type File = { fileName: string, content: string };

export interface Options {
    wrap: boolean;
}
