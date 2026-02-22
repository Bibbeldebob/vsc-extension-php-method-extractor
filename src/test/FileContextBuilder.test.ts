import * as assert from 'assert';
import * as vscode from 'vscode';
import { FileContextBuilder } from '../Builder/ValueObject/FileContextBuilder';

/**
 * Helper to create a mock TextEditor for testing.
 * The mock provides the minimal API needed by FileContextBuilder.
 */
function createMockEditor(fileContent: string): vscode.TextEditor {
    const lines = fileContent.split('\n');

    const mockDocument = {
        getText: () => fileContent,
        positionAt: (offset: number) => {
            let currentOffset = 0;
            for (let line = 0; line < lines.length; line++) {
                const lineLength = lines[line].length + 1; // +1 for \n
                if (currentOffset + lineLength > offset) {
                    return new vscode.Position(line, offset - currentOffset);
                }
                currentOffset += lineLength;
            }
            return new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
        },
        lineAt: (lineNumber: number) => {
            return {
                text: lines[lineNumber],
                lineNumber: lineNumber,
            } as any;
        },
    } as any;

    return {
        document: mockDocument,
    } as any;
}

suite('FileContextBuilder', () => {
    let builder: FileContextBuilder;

    setup(() => {
        builder = new FileContextBuilder();
    });

    test('returns context without class when file contains no class keyword', () => {
        const text = `<?php
// just a simple script
$foo = 1;`;
        const editor = createMockEditor(text);
        const ctx = builder.getFileContext(editor);
        assert.strictEqual(ctx.isClass, false);
    });

    test('detects a class declaration', () => {
        const text = `<?php
class Foo {
    // nothing here
}`;
        const editor = createMockEditor(text);
        const ctx = builder.getFileContext(editor);
        assert.strictEqual(ctx.isClass, true);
    });

    test('detects class keyword on line before opening brace', () => {
        const text = `<?php
class Bar
{
    public function test() {}
}`;
        const editor = createMockEditor(text);
        const ctx = builder.getFileContext(editor);
        assert.strictEqual(ctx.isClass, true);
    });

    test('returns false when no opening brace exists', () => {
        const text = `<?php
// just comments
echo "hello";`;
        const editor = createMockEditor(text);
        const ctx = builder.getFileContext(editor);
        assert.strictEqual(ctx.isClass, false);
    });
});
