import { ThemedContextMenu } from "./ThemedContextMenu"
import { ContextElement } from "./ContextElement"

const tcm = new ThemedContextMenu()
var elemList: ContextElement[] = []

export async function activate() {
    console.log("hello!")
    // gather context element into element list and hijack the event listener
    gatherContextElements()
    hijackAllContextMenus()
}

export function deactivate() {
    // release the event listeners
    unhijackAllContextMenus()
}

function gatherContextElements() {
    // ask atom for context menu items and dom selectors
    let contextMenuItems = (atom.contextMenu as any).itemSets

    let workingList: ContextElement[] = []
    for (let i = 0; i < contextMenuItems.length; i++) {
        let triggeringItem = contextMenuItems[i]

        // get all dom elements that match selector
        let domElems = document.querySelectorAll(triggeringItem.selector)

        // create context element objects and add to elemlist
        domElems.forEach((item) =>
            workingList.push(new ContextElement(item, triggeringItem.items)),
        )
    }

    // remove duplicates from elemlist and assign to public variable
    elemList = pruneElements(workingList)
}

// wrapper function to ask all context elements to hijack the context menu event
function hijackAllContextMenus() {
    elemList.forEach((item) => item.hijackContextMenu(tcm))
}

// wrapper function to ask all context elements to release the context menu event
function unhijackAllContextMenus() {
    elemList.forEach((item) => item.unhijackContextMenu(tcm))
}

// join different context menu item sets for same dom elements
function pruneElements(elements: ContextElement[]): ContextElement[] {
    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            if (elements[i].getElem() === elements[j].getElem()) {
                elements[i].mergeContextElement(elements[j])
                elements.splice(j, 1)
            }
        }
    }

    return elements
}
