import { Menu } from './Menu';
import { ContextMenuItemInterface, MousePosition } from './types';

export class ThemedContextMenu {
    private hijackedFunction: Function | undefined;
    private container: HTMLElement;

    constructor() {
        // add click listener to clear the context menu
        document.addEventListener('click', (e) =>
            this.onMouseClick(e as MouseEvent),
        );

        // create the context menu, but make it invisible
        this.container = document.createElement('div');
        this.container.classList.add('themed-context-menu');
        // this.activeContextMenu.classList.add('invisible');

        let aws = document.querySelector('atom-workspace');
        aws?.appendChild(this.container);
    }

    // hijack context menu event function
    hijackFunction() {
        let contextMenuManager = atom.contextMenu as any;
        this.hijackedFunction = contextMenuManager.showForEvent;
        contextMenuManager.showForEvent = (e) => {
            let data = contextMenuManager.templateForEvent(e);
            this.displayContextMenu(e, data);
        };
    }

    // release context menu event function
    releaseFunction() {
        let contextMenuManager = atom.contextMenu as any;
        contextMenuManager.showForEvent = this.hijackedFunction;
    }

    displayContextMenu(e: MousePosition, items: ContextMenuItemInterface[]) {
        this.deleteContextMenu();

        new Menu(e, items, true);
    }

    addMenu(child: HTMLElement) {
        this.container.appendChild(child);
    }

    removeMenu(child: HTMLElement) {
        this.container.removeChild(child);
    }

    private onMouseClick(e) {
        this.deleteContextMenu();
    }

    deleteContextMenu() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}
