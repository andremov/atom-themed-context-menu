import EventEmitter from "events"
import { ContextMenuItemInterface } from "./types"
import { ThemedContextMenu } from "./ThemedContextMenu"

// handler for the items shown in the context menu, be it a separator or a command
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

    // static function wrapper to create a MenuItem object from a ContextMenuItemInterface object
    public static createMenuItem(
        item: ContextMenuItemInterface,
        parent: ThemedContextMenu,
    ): MenuItem {
        // early return for separators
        if (item.type === "separator") {
            return new MenuItem(document.createElement("hr"), parent, 7)
        }

        // create base menu item div element and create menu item object from base div
        const divElem = document.createElement("div")
        divElem.classList.add("menu-item")
        const self = new MenuItem(divElem, parent, 23)

        // create menu item label span
        const menuItemName = document.createElement("span")
        menuItemName.classList.add("menu-item-name")
        // if it doesnt have a label, what is it?
        // i guess a separator wont have a label, but other than that?
        // should i add an early return case for this?
        menuItemName.innerHTML = item.label ? item.label : ""

        // create menu item key stroke span
        const menuItemKey = document.createElement("span")
        menuItemKey.classList.add("menu-item-key")

        // append menu item elements to base menu item div
        divElem.appendChild(menuItemName)
        divElem.appendChild(menuItemKey)

        // if it doesnt have a command it might be a submenu
        if (item.command !== undefined) {
            // add command data to menu item object
            self.command = item.command
            self.commandDetail = item.commandDetail

            // if it has a command, it might have a keymap, so search for it
            const keyStrokes = atom.keymaps.findKeyBindings({
                command: item.command,
            })

            // if it has a keymap, add it to the item key span element
            if (keyStrokes.length > 0) {
                menuItemKey.innerHTML =
                    keyStrokes[keyStrokes.length - 1].keystrokes
            }
        }

        return self
    }

    // on click, execute command and hide the context menu
    private onMouseClick(e: MouseEvent) {
        e.stopPropagation()
        this.execCommand()
        this.parent.deleteContextMenu()
    }

    private async execCommand(): Promise<void> {
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

    public getElement(): HTMLElement {
        return this.element
    }

    public getHeight(): number {
        return this.height
    }
}
