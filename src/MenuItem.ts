import {
    ContextMenuCommandItem,
    ContextMenuItemInterface,
    ContextMenuSeparatorItem,
    ContextMenuSubmenuItem, MousePosition,
} from './types';
import { Menu } from './Menu';

// handler for the items shown in the context menu, be it a separator or a command
export class MenuItem {
    private readonly domElement: HTMLHRElement | HTMLDivElement;
    private readonly itemData: ContextMenuItemInterface;
    private selected: boolean = false;
    private parent: Menu;
    private submenu?: Menu;
    private navSubmenu: boolean = false;
    private readonly height: number;
    private readonly target?: EventTarget;
    private hidden: boolean = false;

    constructor(
        parent: Menu,
        item: ContextMenuItemInterface,
        target?: EventTarget,
    ) {
        this.itemData = item;
        this.height = 23;
        this.parent = parent;
        this.target = target;

        let divElem;
        if ((<ContextMenuSeparatorItem>item).type) {
            divElem = document.createElement('div')
            divElem.classList.add('menu-item');

            const separator = document.createElement('div');
            separator.classList.add('separator');
            divElem.appendChild(separator);

            this.height = 7;
        }

        if (!(<ContextMenuSeparatorItem>item).type) {
            // create base menu item div element and create menu item object from base div
            divElem = document.createElement('div');
            divElem.classList.add('menu-item');

            // create menu item label span
            const menuItemName = document.createElement('span');
            menuItemName.classList.add('menu-item-name');

            menuItemName.innerHTML = (<ContextMenuCommandItem>item).id ?? (<ContextMenuCommandItem>item).label ?? '';

            // create menu item keystroke span
            const menuItemKey = document.createElement('span');
            menuItemKey.classList.add('menu-item-key');

            // if it doesn't have a command it might be a submenu
            if ((<ContextMenuCommandItem>item).command) {
                // add command data to menu item object
                // this.command = (<ContextMenuCommandItem>item).command;
                // this.commandDetail = (<ContextMenuCommandItem>item).commandDetail;

                // if it has a command, it might have a keymap, so search for it
                const keyStrokes = atom.keymaps.findKeyBindings({
                    command: (<ContextMenuCommandItem>item).command
                });

                // if it has a keymap, add it to the item key span element
                menuItemKey.innerHTML = keyStrokes[0]?.keystrokes.toLocaleLowerCase() ?? '';
            }

            if ((<ContextMenuSubmenuItem>item).submenu !== undefined) {
                divElem.classList.add('has-submenu');
            }

            // append menu item elements to base menu item div
            divElem.appendChild(menuItemName);
            divElem.appendChild(menuItemKey);
        }

        this.domElement = divElem;

        this.domElement.addEventListener('click', (e) =>
            this.onMouseClick(e as MouseEvent),
        );
        this.domElement.addEventListener('mouseenter', (e) =>
            this.onMouseEnter(e as MouseEvent),
        );
    }

    // on click, execute command and hide the context menu
    private onMouseClick(e: MouseEvent) {
        e.stopPropagation();
        this.callExecCommand();
    }

    public callExecCommand() {
        if (this.hasCommand()) {
            this.execCommand();
            this.parent.deleteContextMenu();
        } else if ((<ContextMenuSubmenuItem>this.itemData).submenu) {
            this.submenu?.fireCommand();
        }
    }

    public hasCommand(): boolean {
        return (<ContextMenuCommandItem>this.itemData).command !== undefined;
    }

    public isSubmenu() {
        return !!(<ContextMenuSubmenuItem>this.itemData).submenu
    }

    // on mouse enter, open submenu and set as selected
    private onMouseEnter(e: MouseEvent) {
        if (this.isSeparator()) {
            return;
        }
        e.stopPropagation();
        this.select();
        this.displaySubmenu();
    }

    public createSubmenu() {
        const submenuItems = (<ContextMenuSubmenuItem>this.itemData).submenu
        if (submenuItems && !this.submenu) {
            let position = this.domElement.getBoundingClientRect();
            let fakeEvent: MousePosition = {
                target: this.target,
                clientX: position.left + 300,
                clientY: position.top,
                isSubmenu: true,
            };
            this.submenu = new Menu(fakeEvent, submenuItems, false);
        }
    }

    public displaySubmenu() {
        this.createSubmenu();
        this.submenu?.setVisible(true);
    }

    public select() {
        this.parent.unselectAll();
        this.selected = true;
        this.domElement.classList.add('selected');
    }

    public unselect() {
        this.selected = false;
        this.domElement.classList.remove('selected');
        this.submenu?.setVisible(false);
    }

    public isSelected() {
        return this.selected
    }

    public isNavigating() {
        return this.navSubmenu;
    }

    public isSeparator() {
        return (<ContextMenuSeparatorItem>this.itemData).type;
    }

    public setNavigating(value) {
        this.navSubmenu = value;
        if (value) {
            this.submenuNavigate("Down");
        } else {
            this.unselect();
            this.select();
            this.displaySubmenu();
        }
    }

    public hideElement() {
        this.hidden = true;
        this.domElement.classList.add('not-search-result')
    }

    public showElement() {
        this.hidden = false;
        this.domElement.classList.remove('not-search-result')
    }

    public submenuNavigate(direction) {
        if (this.isSubmenu()) {
            this.submenu?.navigate(direction);
        }
    }

    public searchResult(inputString): boolean {
        if (this.isSeparator()) {
            return false;
        }

        const submenuItem = (<ContextMenuSubmenuItem>this.itemData);
        if (submenuItem.submenu) {
            if (submenuItem.id.toLocaleLowerCase().includes(inputString.toLocaleLowerCase())) {
                return true;
            }

            const subItems = submenuItem.submenu.filter(item =>
                ((<ContextMenuCommandItem>item).id && (<ContextMenuCommandItem>item).label).toLocaleLowerCase().includes(inputString.toLocaleLowerCase())
            )
            this.submenu?.searchItem({ target: { value: inputString } });
            return subItems.length > 0;
        }

        const commandItem = (<ContextMenuCommandItem>this.itemData);
        if (commandItem.id) {
            return commandItem.id.toLocaleLowerCase().includes(inputString.toLocaleLowerCase());
        }

        return false;
    }

    private async execCommand(): Promise<void> {
        let target =
            this.target ||
            (atom.workspace.getActiveTextEditor() as any)?.getElement() ||
            (atom.workspace.getActivePane() as any).getElement();

        const commandItem = (<ContextMenuCommandItem>this.itemData)
        await (atom.commands as any).dispatch(
            target,
            commandItem.command,
            commandItem.commandDetail,
        );
    }

    public getElement(): HTMLElement {
        return this.domElement;
    }

    public getHeight(): number {
        return this.height;
    }
}
