import * as vscode from 'vscode';
export function replacerInit(context: vscode.ExtensionContext) {
  let activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    highlightText(activeEditor);
  }

  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeEditor = editor;
    if (editor) {
      highlightText(editor);
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(editor => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      highlightText(activeEditor);
    }
  }, null, context.subscriptions);
}

export function highlightText(editor: vscode.TextEditor) {
  const text = editor.document.getText();
  const regex = /a/g;
  let match;
  const decorations = [];

  while (match = regex.exec(text)) {
    const startPos = editor.document.positionAt(match.index);
    const endPos = editor.document.positionAt(match.index + match[0].length);
    const decoration = { range: new vscode.Range(startPos, endPos) };
    decorations.push(decoration);
  }

  const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'yellow',
    color: 'red'
  });

  editor.setDecorations(decorationType, decorations);
}
