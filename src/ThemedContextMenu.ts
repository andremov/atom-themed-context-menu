import { MenuItem } from "./MenuItem"

export class ThemedContextMenu {
    private screenWrapper: HTMLDivElement
    private activeContextMenu: HTMLDivElement | undefined

    constructor() {
        this.screenWrapper = document.createElement("div")
        this.screenWrapper.classList.add("themed-context-menu-container")
        this.screenWrapper.classList.add("not-active")

        this.screenWrapper.addEventListener("click", (e) =>
            this.onMouseClick(e as MouseEvent),
        )

        document
            .querySelector("atom-workspace")
            ?.appendChild(this.screenWrapper)
    }

    createContextMenu(e, items) {
        this.deleteContextMenu()
        this.screenWrapper.classList.remove("not-active")

        this.activeContextMenu = document.createElement("div")
        this.activeContextMenu.classList.add("themed-context-menu")

        for (let i = 0; i < items.length; i++) {
            this.activeContextMenu.appendChild(
                MenuItem.createMenuItem(items[i], this).getElement(),
            )
        }

        this.activeContextMenu.setAttribute(
            "style",
            "top:" + e.clientY + "px; left:" + (e.clientX + 10) + "px",
        )
        this.screenWrapper.appendChild(this.activeContextMenu)
    }

    onMouseClick(e) {
        e.stopPropagation()
        this.deleteContextMenu()
    }

    deleteContextMenu() {
        if (this.activeContextMenu) {
            this.activeContextMenu.remove()
            this.screenWrapper.classList.add("not-active")
        }
    }
}
