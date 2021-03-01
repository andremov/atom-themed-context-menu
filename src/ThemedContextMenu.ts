import { MenuItem } from "./MenuItem"
import { MouseClick } from "./types"

export class ThemedContextMenu {
    private hijackedFunction: Function | undefined
    private activeContextMenu: HTMLDivElement
    private visible: boolean = false
    private children: MenuItem[] = []

    constructor() {
        // add click listener to clear the context menu
        document.addEventListener("click", (e) =>
            this.onMouseClick(e as MouseEvent),
        )

        // create the context menu, but make it invisible
        this.activeContextMenu = document.createElement("div")
        this.activeContextMenu.classList.add("themed-context-menu")
        this.activeContextMenu.classList.add("invisible")

        let aws = document.querySelector("atom-workspace")
        aws?.appendChild(this.activeContextMenu)
    }

    // hijack context menu event function
    hijackFunction() {
        let contextMenuManager = atom.contextMenu as any
        this.hijackedFunction = contextMenuManager.showForEvent
        contextMenuManager.showForEvent = (e) => {
            let data = contextMenuManager.templateForEvent(e)
            this.displayContextMenu(e, data)
        }
    }

    releaseFunction() {
        let contextMenuManager = atom.contextMenu as any
        contextMenuManager.showForEvent = this.hijackedFunction
    }

    displayContextMenu(e: MouseClick, items) {
        this.deleteContextMenu()

        // make context menu visible
        this.visible = true
        this.activeContextMenu.classList.remove("invisible")

        // add context menu items to context menu
        items.forEach((element) => {
            this.addChild(element)
        })

        // move context menu position to mouse event position
        this.activeContextMenu.setAttribute(
            "style",
            this.getPositionStyleString(e),
        )
    }

    // adds a context menu item to context menu
    private addChild(item) {
        const mitem = MenuItem.createMenuItem(item, this)
        this.children.push(mitem)
        this.activeContextMenu?.appendChild(mitem.getElement())
    }

    private onMouseClick(e) {
        this.deleteContextMenu()
    }

    // generates a style string that positions the context menu next to
    // mouse event, while also preventing it from overflowing
    private getPositionStyleString(e: MouseClick): string {
        let x = e.clientX + 10 + 5
        let y = e.clientY + 5

        x = Math.min(x, window.innerWidth - 310)
        y = Math.min(y, window.innerHeight - this.getHeight() - 10)

        return "top:" + y + "px; left:" + x + "px"
    }

    // calculate context menu height for positioning function
    private getHeight(): number {
        return this.children
            .map((item) => item.getHeight())
            .reduce(function (a, b) {
                return a + b
            })
    }

    deleteContextMenu() {
        if (this.visible) {
            this.visible = false
            this.children = []
            this.activeContextMenu.classList.add("invisible")
            this.removeAllChildNodes()
        }
    }

    private removeAllChildNodes() {
        while (this.activeContextMenu.firstChild) {
            this.activeContextMenu.removeChild(
                this.activeContextMenu.firstChild,
            )
        }
    }
}
