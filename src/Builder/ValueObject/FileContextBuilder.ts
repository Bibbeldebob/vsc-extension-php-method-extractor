import * as vscode from 'vscode';
import { FileContext } from "../../ValueObjects/FileContext";

export class FileContextBuilder {
    public getFileContext(editor: vscode.TextEditor) {
        return new FileContext(
            this.isClassContext(editor),
        );
    }

    private isClassContext(editor: vscode.TextEditor): boolean {
        const fileContent = editor.document.getText();

        const firstBraceOffset = fileContent.indexOf('{');

        if (firstBraceOffset === -1) {
            return false;
        }

        const firstBraceLineNumber = editor.document.positionAt(firstBraceOffset).line;
        const potentialClassLineNumber = firstBraceLineNumber - 1;

        if (
            this.lineContainsClass(editor.document.lineAt(firstBraceLineNumber))
            || this.lineContainsClass(editor.document.lineAt(potentialClassLineNumber))
        ) {
            return true;
        }

        return false;
    }

    private lineContainsClass(line: vscode.TextLine): boolean {
        if (line.text.indexOf('class') !== -1) {
            return true;
        }

        return false;
    }
}
