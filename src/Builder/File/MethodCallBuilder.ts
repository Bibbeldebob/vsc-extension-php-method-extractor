import { FileContext } from "../../ValueObjects/FileContext";

export class MethodCallBuilder {
    private fileContext: FileContext;

    constructor(fileContext: FileContext) {
        this.fileContext = fileContext;
    }

    private readonly METHOD_TEMPLATE = `
@caller@@methodName@();
    `;

    public getMethodCall(methodName: string): string {
        let methodCall = this.METHOD_TEMPLATE;

        let caller = '';
        if (this.fileContext.isClass) {
            caller = '$this->';
        }

        methodCall = methodCall.replaceAll('@caller@', caller);
        methodCall = methodCall.replaceAll('@methodName@', methodName);

        return methodCall;
    }
}
