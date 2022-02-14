import { Menu } from './Menu';
import { ContextMenuItemInterface, MousePosition } from './types';

export class ThemedContextMenu {
	private hijackedFunction: Function | undefined;
	private readonly parentContainer: HTMLElement;
	private activeMenu: Menu | undefined;

	constructor() {
		// create the context menu container
		this.parentContainer = document.createElement('div');
		this.parentContainer.classList.add('themed-context-menu');

		let aws = document.querySelector('atom-workspace');
		aws?.appendChild(this.parentContainer);
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
		(<HTMLElement>document.activeElement)?.blur();
		if (items.length > 0) {
			setTimeout(() => this.activeMenu = new Menu(e, items, true), 110);
		}
	}

	addContextMenu(child: HTMLElement) {
		this.parentContainer.appendChild(child);
	}

	deleteContextMenu() {
		while (this.parentContainer.firstChild) {
			this.parentContainer.removeChild(this.parentContainer.firstChild);
		}
	}
}
