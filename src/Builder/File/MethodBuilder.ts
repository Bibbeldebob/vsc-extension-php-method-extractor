import { FileContext } from "../../ValueObjects/FileContext";

export class MethodBuilder {
    private fileContext: FileContext;

    constructor(fileContext: FileContext) {
        this.fileContext = fileContext;
    }

    private readonly METHOD_TEMPLATE = `
@visibility@function @methodName@(): @returnType@ {
    @content@
}
    `;

    public getMethod(methodName: string, content: string): string {
        let method = this.METHOD_TEMPLATE;

        let visibility = '';
        if (this.fileContext.isClass) {
            visibility = 'private ';
        }

        method = method.replaceAll('@visibility@', visibility);
        method = method.replaceAll('@methodName@', methodName);
        method = method.replaceAll('@returnType@', 'void');
        method = method.replaceAll('@content@', content);

        return method;
    }
}
