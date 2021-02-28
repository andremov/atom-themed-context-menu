import { MenuItem } from "./MenuItem"
import { MouseClick } from "./types"

export class ThemedContextMenu {
    private activeContextMenu: HTMLDivElement
    private visible: boolean = false
    private children: MenuItem[] = []
    private lastClick: MouseClick | undefined
    private windowBlurObserver: MutationObserver

    constructor() {
        // add click listener to clear the context menu
        let aws = document.querySelector("atom-workspace")
        aws?.addEventListener("click", (e) =>
            this.onMouseClick(e as MouseEvent),
        )

        this.windowBlurObserver = new MutationObserver((e) =>
            this.windowBlurCallback(e, this),
        )
        const body = document.querySelector("body")
        if (body) {
            this.windowBlurObserver.observe(body, {
                attributeFilter: ["class"],
            })
        }

        // create the context menu, but make it invisible
        this.activeContextMenu = document.createElement("div")
        this.activeContextMenu.classList.add("themed-context-menu")
        this.activeContextMenu.classList.add("invisible")
        aws?.appendChild(this.activeContextMenu)
    }

    displayContextMenu(e: MouseClick, items) {
        // if mouse event is different to last, clear context menu
        if (this.lastClick !== undefined && this.lastClick !== e) {
            this.deleteContextMenu()
        }

        // set last click event to current parameter,
        // make context menu visible
        this.visible = true
        this.lastClick = e
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

    private windowBlurCallback(mutation, tcm: ThemedContextMenu) {
        // need to pass in the tcm through params because 'this' is the
        // MutationObserver in this function
        tcm.deleteContextMenu()
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
            this.lastClick = undefined
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
