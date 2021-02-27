export interface ContextMenuItem {
    label?: string
    command?: string
    commandDetail?: any
    type?: "separator"
    // enabled?: boolean;
    // visible?: boolean;
    // submenu: IMenuItem[];
}

export class ElementI {
    elem: HTMLElement
    items: ContextMenuItem[]

    constructor(elem, items) {
        this.elem = elem
        this.items = items
    }

    addItems(items) {
        items.forEach((element) => this.items.push(element))
    }
}
