import * as vscode from 'vscode';
import { MethodBuilder } from './Builder/MethodBuilder';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('php-method-extractor.extractMethod', async () => {
        try {
            await extractMethod();
        } catch (error: any) {
            vscode.window.showErrorMessage(error instanceof Error ? error.message : String(error));
        }
    });

    context.subscriptions.push(disposable);
}

async function extractMethod() {
    const editor = getEditor();
    const selection = getSelection(editor);
    const selected = getSelectedText(editor, selection);

    const endPosition = getEndPosition(editor);

    let methodName = await vscode.window.showInputBox();
    if (methodName === undefined || methodName === '') {
        throw new Error('Please enter a method name');
    }

    methodName = normalizeMethodName(methodName);

    const methodBuilder = new MethodBuilder();
    const method = methodBuilder.getMethod(methodName, selected);

    await editor.edit(editBuilder => {
        editBuilder.insert(endPosition, '\n\n' + method);
    });

    await editor.edit(editBuilder => {
        editBuilder.delete(selection);
    });

    vscode.window.showInformationMessage(methodName + ' created successfully');
}

function getSelectedText(editor: vscode.TextEditor, selection: vscode.Selection): string {
    const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
    const selected = editor.document.getText(selectionRange);

    return selected;
}

function getEditor(): vscode.TextEditor {
    const editor = vscode.window.activeTextEditor;

    if (editor === undefined) {
        throw new Error('No File opened');
    }

    return editor;
}

function getSelection(editor: vscode.TextEditor) {
    const selection = editor.selection;

    if (selection.isEmpty) {
        throw new Error('No Text selected');
    }

    return selection;
}

function getEndPosition(editor: vscode.TextEditor): vscode.Position {
    const lastLine = editor.document.lineCount - 1;
    const lastChar = editor.document.lineAt(lastLine).text.length;

    const endPosition = new vscode.Position(lastLine, lastChar);

    return endPosition;
}

function normalizeMethodName(methodName: string): string {
    if (methodName.includes(' ')) {
        // TODO camelCase
        methodName = methodName.replaceAll(' ', '');
    }

    return methodName;
}

export function deactivate() { }
