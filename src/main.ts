import { ThemedContextMenu } from "./ThemedContextMenu"
const tcm = new ThemedContextMenu()

export async function activate() {
    console.log("hello!")
    let contextMenuItems = (atom.contextMenu as any).itemSets.filter(
        (item) => item.items.length > 1,
    )
    let triggeringItem = contextMenuItems[0]

    let domElems = document.querySelectorAll(triggeringItem.selector)
    domElems.forEach((item) => hijackContextMenu(item, triggeringItem.items))
}

export function deactivate() {}

function hijackContextMenu(domElement, items) {
    domElement.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(items)

        tcm.createContextMenu(e, items)
    })
}
