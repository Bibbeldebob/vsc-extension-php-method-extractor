export class MethodBuilder {
    private readonly METHOD_TEMPLATE = `
private function @methodName@(): @returnType@ {
    @content@
}
    `;

    public getMethod(methodName: string, content: string): string {
        let method = this.METHOD_TEMPLATE;

        method = method.replaceAll('@methodName@', methodName);
        method = method.replaceAll('@returnType@', 'void');
        method = method.replaceAll('@content@', content);

        return method;
    }
}
