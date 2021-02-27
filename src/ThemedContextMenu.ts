import { MenuItem } from "./MenuItem"

export class ThemedContextMenu {
    // private screenWrapper: HTMLDivElement
    private activeContextMenu: HTMLDivElement | undefined
    private aws: HTMLElement | null
    private height: number

    constructor() {
        this.height = 0
        this.aws = document.querySelector("atom-workspace")
        this.aws?.addEventListener("click", (e) =>
            this.onMouseClick(e as MouseEvent),
        )
    }

    createContextMenu(e, items) {
        this.deleteContextMenu()

        this.activeContextMenu = document.createElement("div")
        this.activeContextMenu.classList.add("themed-context-menu")

        for (let i = 0; i < items.length; i++) {
            this.addChild(items[i])
        }

        this.activeContextMenu.setAttribute("style", this.getPosition(e))
        this.aws?.appendChild(this.activeContextMenu)
    }

    private addChild(item) {
        const mitem = MenuItem.createMenuItem(item, this)
        this.activeContextMenu?.appendChild(mitem.getElement())
        this.height += mitem.getHeight()
    }

    private onMouseClick(e) {
        this.deleteContextMenu()
    }

    private getPosition(e) {
        let x = e.clientX + 10 + 5
        let y = e.clientY + 5

        x = Math.min(x, window.innerWidth - 310)
        y = Math.min(y, window.innerHeight - this.height - 10)

        return "top:" + y + "px; left:" + x + "px"
    }

    deleteContextMenu() {
        if (this.activeContextMenu) {
            this.activeContextMenu.remove()
            this.height = 0
        }
    }
}
