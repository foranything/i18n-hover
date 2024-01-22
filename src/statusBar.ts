import * as vscode from 'vscode';

const COMMAND = "i18n-hover.toggleReplaceFeature";

const label = {
  off: `$(x) Replace OFF`,
  on: `$(check) Replace ON`
};

let statusBarItem: vscode.StatusBarItem;
let featureEnabled = false;

export function init(context: vscode.ExtensionContext) {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  statusBarItem.command = COMMAND;
  statusBarItem.text = label.off;
  context.subscriptions.push(statusBarItem);
}

export function updateStatusBarItem(): void {
  statusBarItem.text = featureEnabled ? label.on : label.off;
  statusBarItem.show();
}

export function registerCommands(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(COMMAND, () => {
		featureEnabled = !featureEnabled;
		updateStatusBarItem();
	});

	context.subscriptions.push(disposable);
  updateStatusBarItem();
}
