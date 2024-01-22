import * as fs from 'fs';
import * as vscode from 'vscode';

const configKey = 'i18n-hover.jsonPath';

function getJsonPath(): string {
  return vscode.workspace.getConfiguration().get(configKey) ?? '';
}

function readJson(): Record<string, any> {
  const filePath = getJsonPath();
  if (!filePath) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}


export function hoverInit(context: vscode.ExtensionContext) {
  register(context, 'typescript');
  register(context, 'html');
}

function register(context: vscode.ExtensionContext, selector: vscode.DocumentSelector) {
  const json = readJson();
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(selector, {
      provideHover(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(position);
        const matches = matchTest(document, position);

        let textResult = '';
        if (matches.length === 1) {
          textResult = getValueFromJson(json, matches[0]) ?? '';
        } else if (matches.length > 1) {
          const values = matches.map(it => getValueFromJson(json, it)).filter(Boolean);
          textResult = values.join('\n\n\n');
        }

        if (wordRange && textResult) {
          const hoverContent = new vscode.MarkdownString(textResult);
          return new vscode.Hover(hoverContent, wordRange);
        }
        return null;
      }
    })
  );
}

function matchTest(document: vscode.TextDocument, position: vscode.Position) {
  const lineIndex = position.line;
  const line = document.lineAt(lineIndex);
  const wordRange = document.getWordRangeAtPosition(position);
  const word = document.getText(wordRange);
  const regex = /TR(\.\w+)+/g;

  const matches = Array.from(line.text.matchAll(regex), match => match[0]);

  if (matches.length >= 1 && matches.some(match => match.includes(word))) {
    return matches;
  } else {
    return [];
  }
}

function getValueFromJson(jsonData: Record<string, any>, path: string): string | null | undefined {
  const pathParts = path.split('.');
  let currentValue = jsonData;
  let result: string | undefined = undefined;

  for (const part of pathParts) {
    if (currentValue[part] === undefined) {
      return null;
    }
    currentValue = currentValue[part];
    if (typeof currentValue === 'string') {
      result = currentValue;
    }
  }

  return result;
}