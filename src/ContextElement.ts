import { ContextMenuItem } from "./types"

export class ContextElement {
    elem: HTMLElement
    items: ContextMenuItem[] = []

    constructor(elem, items) {
        this.elem = elem
        this.addItems(items)
    }

	hijackContextMenu(tcm : ThemedContextMenu) {}
	    this.elem.addEventListener("contextmenu", (e) => {
	        e.preventDefault()
	        e.stopPropagation()

	        tcm.displayContextMenu(e, this.items)
	    })
	}

    addItems(items) {
        items.forEach((element) => this.addItem(element))
    }

    private addItem(newItem) {
        if (newItem.type) {
            if (!this.items[this.items.length - 1].type) {
                this.items.push(newItem)
            }
        } else {
            let similarComms = this.items.filter(
                (item) => item.command === newItem.command,
            )
            if (similarComms.length === 0) {
                this.items.push(newItem)
            }
        }
    }
}
