import { ThemedContextMenu } from "./ThemedContextMenu"

let tcm = new ThemedContextMenu()

export function activate() {
    tcm.hijackFunction()
}

export function deactivate() {
    tcm.releaseFunction()
}
