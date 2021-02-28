import { ThemedContextMenu } from "./ThemedContextMenu"
import { ContextElement } from "./ContextElement"
const tcm = new ThemedContextMenu()

export async function activate() {
    console.log("hello!")
    hijackAllContextMenus()
}

export function deactivate() {}

function hijackAllContextMenus() {
    let contextMenuItems = (atom.contextMenu as any).itemSets

    let elemList: ContextElement[] = []
    for (let i = 0; i < contextMenuItems.length; i++) {
        let triggeringItem = contextMenuItems[i]
        let domElems = document.querySelectorAll(triggeringItem.selector)
        domElems.forEach((item) =>
            elemList.push(new ContextElement(item, triggeringItem.items)),
        )
    }

    elemList = pruneElements(elemList)

    elemList.forEach((item) => item.hijackContextMenu(tcm))
}

function pruneElements(elements: ContextElement[]) {
    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            if (elements[i].elem === elements[j].elem) {
                elements[i].addItems(elements[j].items)
                elements.splice(j, 1)
            }
        }
    }
    return elements
}
