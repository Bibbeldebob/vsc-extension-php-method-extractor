export class MethodCallBuilder {
    private readonly METHOD_TEMPLATE = `
$this->@methodName@();
    `;

    public getMethodCall(methodName: string): string {
        let methodCall = this.METHOD_TEMPLATE;

        methodCall = methodCall.replaceAll('@methodName@', methodName);

        return methodCall;
    }
}
