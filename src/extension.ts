import * as vscode from 'vscode';
import { MethodBuilder } from './Builder/File/MethodBuilder';
import { MethodCallBuilder } from './Builder/File/MethodCallBuilder';
import { FileContextBuilder } from './Builder/ValueObject/FileContextBuilder';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('php-method-extractor.extractMethod', async () => {
        try {
            await extractMethod();
        } catch (error: any) {
            vscode.window.showErrorMessage(error instanceof Error ? error.message : String(error));
            console.error(error);
        }
    });

    context.subscriptions.push(disposable);
}

async function extractMethod() {
    const editor = getEditor();

    if (!editor || editor.document.languageId !== 'php') {
        throw new Error('This command only works on PHP files.');
    }

    const selection = getSelection(editor);
    const selected = getSelectedText(editor, selection);

    const endPosition = getEndPosition(editor);

    const inputBoxOptions: vscode.InputBoxOptions = {
        'prompt': 'Enter the new method name',
        'placeHolder': 'New Methodname',
        'title': 'New Methodname',
    };

    let methodName = await vscode.window.showInputBox(inputBoxOptions);
    if (methodName === undefined || methodName === '') {
        throw new Error('Please enter a method name');
    }

    methodName = normalizeMethodName(methodName);

    if (methodName === '') {
        throw new Error('Please enter a valid method name');
    }

    const fileContextBuilder = new FileContextBuilder();
    const fileContext = fileContextBuilder.getFileContext(editor);

    const methodBuilder = new MethodBuilder(fileContext);
    const method = methodBuilder.getMethod(methodName, selected);

    const methodCallBuilder = new MethodCallBuilder(fileContext);
    const methodCall = methodCallBuilder.getMethodCall(methodName);

    await editor.edit(editBuilder => {
        editBuilder.insert(endPosition, '\n\n' + method);
        editBuilder.delete(selection);
        editBuilder.insert(selection.end, methodCall);
    });

    await vscode.commands.executeCommand('editor.action.formatDocument');

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

function getSelection(editor: vscode.TextEditor): vscode.Selection {
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
    let name = methodName.trim();

    if (name.length === 0) {
        return name;
    }

    name = name.replace(/[^A-Za-z0-9_]+/g, ' ');

    const parts = name.split(/[_\s]+/).filter(p => p.length > 0);

    if (parts.length === 0) {
        return '';
    }

    const first = parts[0].toLowerCase();
    const rest = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());

    let result = [first, ...rest].join('');

    if (/^[0-9]/.test(result)) {
        result = '_' + result;
    }

    return result;
}

export function deactivate() { }
