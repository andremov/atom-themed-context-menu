import { ThemedContextMenu } from './ThemedContextMenu';

export const TCMHandler = new ThemedContextMenu();
let hijacked = false;

atom.commands.add("atom-workspace", {
    "themed-context-menu:toggle-context-menu": () => {
        if (hijacked) {
            deactivate()
        } else {
            activate()
        }
    },
})

export function activate() {
    TCMHandler.hijackFunction();
    hijacked = true;
}

export function deactivate() {
    TCMHandler.releaseFunction();
    hijacked = false;
}
