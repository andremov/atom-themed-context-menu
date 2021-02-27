import EventEmitter from "events"
import { ContextMenuItem } from "./types"
import { ThemedContextMenu } from "./ThemedContextMenu"

export class MenuItem {
    private element: HTMLHRElement | HTMLDivElement
    private command?: string
    private commandDetail?: string
    private emitter: EventEmitter
    private selected: boolean = false
    private parent: ThemedContextMenu

    private constructor(
        element: HTMLHRElement | HTMLDivElement,
        parent: ThemedContextMenu,
    ) {
        this.element = element
        this.parent = parent
        this.emitter = new EventEmitter()

        // this.emitter.on(TbrEvent.MOUSE_ENTER, (...args) =>
        //     this.onSubItemMouseEnter(args[0], args[1]),
        // )

        this.element.addEventListener("click", (e) =>
            this.onMouseClick(e as MouseEvent),
        )
    }

    public static createMenuItem(
        item: ContextMenuItem,
        parent: ThemedContextMenu,
    ) {
        if (item.type === "separator") {
            return new MenuItem(document.createElement("hr"), parent)
        }

        const divElem = document.createElement("div")
        divElem.classList.add("menu-item")
        const self = new MenuItem(divElem, parent)

        const menuItemName = document.createElement("span")
        menuItemName.classList.add("menu-item-name")
        menuItemName.innerHTML = item.label ? item.label : ""

        const menuItemKey = document.createElement("span")
        menuItemKey.classList.add("menu-item-key")

        divElem.appendChild(menuItemName)
        divElem.appendChild(menuItemKey)

        if (item.command !== undefined) {
            self.command = item.command
            // self.commandDetail = item.commandDetail

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

    private onMouseClick(e: MouseEvent) {
        // e.stopPropagation()
        this.execCommand()
        this.parent.deleteContextMenu()
    }

    private onSubItemMouseEnter(target: MenuItem, e: MouseEvent): void {
        // this.submenu?.forEach((o) => {
        //     o.setOpen(false);
        //     o.setSelected(false);
        // });
        // target.setSelected(true);
        // target.setOpen(true);
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
