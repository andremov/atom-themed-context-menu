import { ContextMenuItem, MouseClick } from "./types"
import { ThemedContextMenu } from "./ThemedContextMenu"

export class ContextElement {
    private elem: HTMLElement
    private items: ContextMenuItem[] = []

    constructor(elem, items) {
        this.elem = elem
        this.addItems(items)
    }

    // add listener to html element to 'hijack' the context menu event
    hijackContextMenu(tcm: ThemedContextMenu) {
        this.elem.addEventListener("contextmenu", (e) =>
            this.onContextMenu(e, tcm),
        )
    }

    // release listener to html element
    unhijackContextMenu(tcm: ThemedContextMenu) {
        this.elem.removeEventListener("contextmenu", (e) =>
            this.onContextMenu(e, tcm),
        )
    }

    // wrapper function for context menu event so listener can be removed on deactivate
    private onContextMenu(e, tcm: ThemedContextMenu) {
        // prevent native context menu
        e.preventDefault()
        e.stopPropagation()

        //call to request themed context menu
        tcm.displayContextMenu(e, this.items)
    }

    // wrapper function to add context element items into current element items
    addItems(contelem: ContextElement) {
        contelem.getItems().forEach((element) => this.addItem(element))
    }

    private addItem(newItem) {
        if (newItem.type) {
            // prevent starting with a separator
            if (this.items.length === 0) {
                return
            }

            // prevent two separators in a row
            if (!this.items[this.items.length - 1].type) {
                this.items.push(newItem)
            }
        } else {
            // prevent duplicates
            let similarComms = this.items.filter(
                (item) => item.command === newItem.command,
            )
            if (similarComms.length === 0) {
                this.items.push(newItem)
            }
        }
    }

    getElem() {
        return this.elem
    }

    getItems() {
        return this.items
    }
}
