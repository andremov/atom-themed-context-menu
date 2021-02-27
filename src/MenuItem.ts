import EventEmitter from "events"

export class MenuItem {
    private element: HTMLHRElement | HTMLDivElement
    private command?: string
    private emitter: EventEmitter

    private constructor(element: HTMLHRElement | HTMLDivElement) {
        this.element = element
        this.emitter = new EventEmitter()

        this.emitter.on(TbrEvent.MOUSE_ENTER, (...args) =>
            this.onSubItemMouseEnter(args[0], args[1]),
        )

        this.element.addEventListener("click", (e) =>
            this.onMouseClick(e as MouseEvent),
        )
        this.element.addEventListener("mouseenter", (e) =>
            this.onMouseEnter(e as MouseEvent),
        )
    }

    public static createMenuItem(item: Array) {
        let self: MenuItem
        let element: HTMLHRElement | HTMLDivElement

        if (item.type === "separator") {
            element = document.createElement("hr")
            self = new MenuItem(element)
            return self
        }

        const element = document.createElement("div")
        element.classList.add("menu-item")
        self = new MenuItem(element)

        const menuItemName = document.createElement("span")
        menuItemName.classList.add("menu-item-name")
        menuItemName.innerHTML = item.label

        const menuItemKey = document.createElement("span")
        menuItemKey.classList.add("menu-item-key")

        element.appendChild(menuItemName)
        element.appendChild(menuItemKey)

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

    private onMouseClick(e: MouseEvent) {
        // e.stopPropagation();
        // this.parent?.getEmitter().emit(TbrEvent.MOUSE_CLICK, this, e);
        // if (this.isExecutable()) {
        //     this.execCommand();
        //     this.getAppMenuRoot()?.close();
        // }
    }

    private onMouseEnter(e: MouseEvent) {
        // e.stopPropagation();
        // this.parent?.getEmitter().emit(TbrEvent.MOUSE_ENTER, this, e);
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
        // if (this.command === undefined) {
        //     return;
        // }
        //
        // if (exceptionCommands.indexOf(this.command) > -1) {
        //     switch (this.command) {
        //         case "application:open-terms-of-use":
        //             shell.openExternal("https://help.github.com/articles/github-terms-of-service/");
        //             break;
        //         case "application:open-documentation":
        //             shell.openExternal("http://flight-manual.atom.io/");
        //             break;
        //         case "application:open-faq":
        //             shell.openExternal("https://atom.io/faq");
        //             break;
        //         case "application:open-discussions":
        //             shell.openExternal("https://discuss.atom.io/");
        //             break;
        //         case "application:report-issue":
        //             shell.openExternal(
        //                 "https://github.com/atom/atom/blob/master/CONTRIBUTING.md#submitting-issues"
        //             );
        //             break;
        //         case "application:search-issues":
        //             shell.openExternal("https://github.com/atom/atom/issues");
        //             break;
        //     }
        //     return;
        // }
        //
        // let target =
        //     (atom.workspace.getActiveTextEditor() as any)?.getElement() ||
        //     (atom.workspace.getActivePane() as any).getElement();
        //
        // await (atom.commands as any).dispatch(target, this.command, this.commandDetail);
    }
}
