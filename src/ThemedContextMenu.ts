import { MenuItem } from "./MenuItem"
import { MouseClick } from "./types"

export class ThemedContextMenu {
    private activeContextMenu: HTMLDivElement
    private height: number
    private visible: boolean = false
    private children: MenuItem[] = []
    private lastClick: MouseClick | undefined

    constructor() {
        this.height = 0
        let aws = document.querySelector("atom-workspace")
        aws?.addEventListener("click", (e) =>
            this.onMouseClick(e as MouseEvent),
        )

        this.activeContextMenu = document.createElement("div")
        this.activeContextMenu.classList.add("themed-context-menu")
        this.activeContextMenu.classList.add("invisible")
        aws?.appendChild(this.activeContextMenu)
    }

    displayContextMenu(e: MouseClick, items) {
        if (this.lastClick !== undefined && this.lastClick !== e) {
            this.deleteContextMenu()
        }
        console.log(this.children.length)
        this.lastClick = e
        this.activeContextMenu.classList.remove("invisible")

        items.forEach((element) => {
            this.addChild(element)
        })

        this.activeContextMenu.setAttribute("style", this.getPosition(e))
    }

    private addChild(item) {
        const mitem = MenuItem.createMenuItem(item, this)
        this.children.push(mitem)
        this.activeContextMenu?.appendChild(mitem.getElement())
    }

    private onMouseClick(e) {
        this.deleteContextMenu()
    }

    private getPosition(e: MouseClick) {
        let x = e.clientX + 10 + 5
        let y = e.clientY + 5

        x = Math.min(x, window.innerWidth - 310)
        y = Math.min(y, window.innerHeight - this.getHeight() - 10)

        return "top:" + y + "px; left:" + x + "px"
    }

    private getHeight(): number {
        return this.children
            .map((item) => item.getHeight())
            .reduce(function (a, b) {
                return a + b
            })
    }

    deleteContextMenu() {
        this.height = 0
        this.visible = false
        this.children = []
        this.activeContextMenu.classList.add(".invisible")
        this.lastClick = undefined
        this.removeAllChildNodes()
    }

    removeAllChildNodes() {
        while (this.activeContextMenu.firstChild) {
            this.activeContextMenu.removeChild(
                this.activeContextMenu.firstChild,
            )
        }
    }
}
