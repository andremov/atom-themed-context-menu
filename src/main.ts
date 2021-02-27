import { ThemedContextMenu } from "./ThemedContextMenu"
import { ElementI } from "./types"
const tcm = new ThemedContextMenu()

export async function activate() {
    console.log("hello!")
    hijackAllContextMenus()
}

export function deactivate() {}

function hijackSingleContextMenu(domElement, items) {
    domElement.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(items)

        tcm.createContextMenu(e, items)
    })
}

function hijackAllContextMenus() {
    let contextMenuItems = (atom.contextMenu as any).itemSets.filter(
        (item) => item.items.length > 1,
    )

    let elemList: ElementI[] = []
    for (let i = 0; i < contextMenuItems.length; i++) {
        let triggeringItem = contextMenuItems[i]
        let domElems = document.querySelectorAll(triggeringItem.selector)
        domElems.forEach((item) =>
            elemList.push(new ElementI(item, triggeringItem.items)),
        )
    }

    elemList = pruneElements(elemList)

    elemList.forEach((item) => hijackSingleContextMenu(item.elem, item.items))
}

function pruneElements(elements: ElementI[]) {
    console.log(elements.length)
    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            if (elements[i].elem === elements[j].elem) {
                elements[i].addItems(elements[j].items)
                elements.splice(j, 1)
            }
        }
    }
    console.log(elements.length)
    return elements
}
