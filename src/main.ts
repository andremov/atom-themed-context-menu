import { ThemedContextMenu } from "./ThemedContextMenu"
const tcm = new ThemedContextMenu()

export async function activate() {
    tcm.activate()
}

export function deactivate() {
    tcm.deactivate()
}
