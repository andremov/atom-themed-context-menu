import { MenuItem } from './MenuItem';
import { ThemedContextMenu } from './ThemedContextMenu';
import { ContextMenuItemInterface, MousePosition } from './types';

export class Menu {
    private visible: boolean = true;
    private children: MenuItem[] = [];
    private domElement: HTMLElement;
    private tcm: ThemedContextMenu;

    constructor(
        e: MousePosition,
        items: ContextMenuItemInterface[],
        visible: boolean,
        tcm: ThemedContextMenu,
    ) {
        this.tcm = tcm;
        this.domElement = document.createElement('div');
        this.domElement.classList.add('submenu');

        if (!visible) {
            this.visible = false;
            this.domElement.classList.add('invisible');
        }

        // add context menu items to context menu
        items.forEach((element) => {
            this.addChild(element);
        });
        // move context menu position to mouse event position
        this.domElement.setAttribute('style', this.getPositionStyleString(e));

        tcm.appendChild(this.domElement);
    }

    public deleteContextMenu() {
        this.tcm.deleteContextMenu();
    }

    // generates a style string that positions the context menu next to
    // mouse event, while also preventing it from overflowing
    private getPositionStyleString(e: MousePosition): string {
        let x = e.clientX + 10 + 5;
        let y = e.clientY + 5;

        x = Math.min(x, window.innerWidth - 310);
        y = Math.min(y, window.innerHeight - this.getHeight() - 10);

        return 'top:' + y + 'px; left:' + x + 'px';
    }

    // adds a context menu item to context menu
    private addChild(item: ContextMenuItemInterface): void {
        const mitem = MenuItem.createMenuItem(item, this);
        this.children.push(mitem);
        this.domElement.appendChild(mitem.getElement());
    }

    // calculate context menu height for positioning function
    private getHeight(): number {
        return this.children
            .map((item) => item.getHeight())
            .reduce(function (a, b) {
                return a + b;
            });
    }

    private removeAllChildNodes() {
        while (this.domElement.firstChild) {
            this.domElement.removeChild(this.domElement.firstChild);
        }
    }
}
