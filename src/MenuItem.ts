import EventEmitter from "events"
import { ContextMenuItem } from "./types"
import { ThemedContextMenu } from "./ThemedContextMenu"

export class MenuItem {
    private element: HTMLHRElement | HTMLDivElement
    private command?: string
    private commandDetail?: string
    private selected: boolean = false
    private parent: ThemedContextMenu
    private height: number

    private constructor(
        element: HTMLHRElement | HTMLDivElement,
        parent: ThemedContextMenu,
        height: number,
    ) {
        this.element = element
        this.parent = parent
        this.height = height

        this.element.addEventListener("click", (e) =>
            this.onMouseClick(e as MouseEvent),
        )
    }

    public static createMenuItem(
        item: ContextMenuItem,
        parent: ThemedContextMenu,
    ) {
        if (item.type === "separator") {
            return new MenuItem(document.createElement("hr"), parent, 7)
        }

        const divElem = document.createElement("div")
        divElem.classList.add("menu-item")
        const self = new MenuItem(divElem, parent, 23)

        const menuItemName = document.createElement("span")
        menuItemName.classList.add("menu-item-name")
        menuItemName.innerHTML = item.label ? item.label : ""

        const menuItemKey = document.createElement("span")
        menuItemKey.classList.add("menu-item-key")

        divElem.appendChild(menuItemName)
        divElem.appendChild(menuItemKey)

        if (item.command !== undefined) {
            self.command = item.command
            self.commandDetail = item.commandDetail

            const keyStrokes = atom.keymaps.findKeyBindings({
                command: item.command,
            })
            if (keyStrokes.length > 0) {
                menuItemKey.innerHTML =
                    keyStrokes[keyStrokes.length - 1].keystrokes
            }
        }

        return self
    }

    public getElement() {
        return this.element
    }

    public getHeight() {
        return this.height
    }

    private onMouseClick(e: MouseEvent) {
        e.stopPropagation()
        this.execCommand()
        this.parent.deleteContextMenu()
    }

    public async execCommand(): Promise<void> {
        if (this.command === undefined) {
            return
        }

        let target =
            (atom.workspace.getActiveTextEditor() as any)?.getElement() ||
            (atom.workspace.getActivePane() as any).getElement()

        await (atom.commands as any).dispatch(
            target,
            this.command,
            this.commandDetail,
        )
    }
}
