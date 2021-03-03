import { ThemedContextMenu } from './ThemedContextMenu';

export const TCMHandler = new ThemedContextMenu();

export function activate() {
    TCMHandler.hijackFunction();
}

export function deactivate() {
    TCMHandler.releaseFunction();
}
