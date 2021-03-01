import { ThemedContextMenu } from "./ThemedContextMenu"
import { ContextElement } from "./ContextElement"

let tcm = new ThemedContextMenu()

export function activate() {
    tcm.hijackFunction()
}

export function deactivate() {
    // release the event listeners
    tcm.releaseFunction()
}
