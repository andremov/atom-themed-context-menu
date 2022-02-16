import { MenuItem } from './MenuItem';
import { TCMHandler } from './main';
import { ContextMenuItemInterface, MousePosition, ContextMenuCommandItem, MenuPosition } from './types';
import { InterfaceNames, menuItemTypeCheck } from './utils';

export class Menu {
	private readonly itemData: ContextMenuItemInterface[] = [];
	private items: MenuItem[] = [];
	private readonly domElement: HTMLElement;
	private readonly position: MenuPosition;
	private visible: boolean = true;
	private readonly hasSearchBox: boolean;

	constructor(
		e: MousePosition,
		items: ContextMenuItemInterface[],
		visible: boolean,
	) {
		this.itemData = items;
		this.hasSearchBox = false;

		this.domElement = document.createElement('div');
		this.domElement.classList.add('submenu');

		if (!e.isSubmenu) {
			const searchInputContainer = document.createElement('div');
			searchInputContainer.classList.add('context-menu-search-container');

			const searchInput = document.createElement('input');
			searchInput.type = 'search';
			searchInput.id = 'context-menu-search-input';
			searchInput.placeholder = 'Search';
			searchInput.addEventListener('input', (e) => this.searchItem(e))
			searchInput.addEventListener('keydown', (e) => this.specialKeyHandle(e))

			searchInputContainer.appendChild(searchInput);
			this.domElement.appendChild(searchInputContainer);
			this.hasSearchBox = true;
		}

		if (!visible) {
			this.visible = false;
			this.domElement.classList.add('invisible');
		}

		// delete separator if it's the first or last item
		if (menuItemTypeCheck(items[0], InterfaceNames.Separator)) {
			items.splice(0,1);
		}

		if (menuItemTypeCheck(items[items.length - 1], InterfaceNames.Separator)) {
			items.splice(items.length - 1, 1);
		}

		// move split pane commands to a submenu
		if (!e.isSubmenu) {
			const splitItems = items.filter(item =>
				menuItemTypeCheck(item, InterfaceNames.Command) && ((<ContextMenuCommandItem>item).id && (<ContextMenuCommandItem>item).label).includes('Split')
			);
			items = items.filter(item =>
				!menuItemTypeCheck(item, InterfaceNames.Command) ||
				menuItemTypeCheck(item, InterfaceNames.Command) && !((<ContextMenuCommandItem>item).id && (<ContextMenuCommandItem>item).label).includes('Split')
			);
			items.splice(9, 0, {
				id: 'Split Pane',
				submenu: splitItems,
			});
		}

		// add context menu items to context menu
		items.forEach((element) => {
			this.addItem(element);
		});

		this.position = this.getPositionStyleString(e);

		// move context menu position to mouse event position
		this.domElement.setAttribute('style', `top: ${this.position.y}px; left: ${this.position.x}px;`);

		TCMHandler.addContextMenu(this.domElement);

		if (!e.isSubmenu) {
			document.getElementById('context-menu-search-input')?.focus();
			document.getElementById('context-menu-search-input')?.addEventListener('blur', () => setTimeout(this.deleteContextMenu, 100))
		}
	}

	public unselectAll() {
		this.items.forEach((item) => item.unselect());
	}

	public deleteContextMenu() {
		TCMHandler.deleteContextMenu();
	}

	public setVisible(v: boolean) {
		this.visible = v;
		if (v) {
			this.domElement.classList.remove('invisible');
		} else {
			this.domElement.classList.add('invisible');
			this.unselectAll();
		}
	}

	// generates a style string that positions the context menu next to
	// mouse event, while also preventing it from overflowing
	private getPositionStyleString(e: MousePosition): MenuPosition {
		let x = Math.min(e.clientX + (!e.isSubmenu ? 10 : 0), window.innerWidth - 310);
		let y = Math.min(e.clientY + (!e.isSubmenu ? 5 : 0), window.innerHeight - this.getHeight() - 10);

		if (e.isSubmenu) {
			if (x === window.innerWidth - 310 && e.clientX - 600 >= 0) {
				x = e.clientX - 600;
			}
		}

		x = Math.max(0, x);
		y = Math.max(10, y);

		return { x, y };
	}

	// adds a context menu item to context menu
	private addItem(item: ContextMenuItemInterface): void {
		const menuItem = new MenuItem(this, item);
		this.items.push(menuItem);
		this.domElement.appendChild(menuItem.getElement());
	}

	// calculate context menu height for positioning function
	private getHeight(): number {
		if (this.items.length === 0) {
			return 0;
		}

		return this.items
			.map((item) => item.getHeight())
			.reduce(function(a, b) {
				return a + b;
			}) + (this.hasSearchBox? 40 : 0);
	}

	specialKeyHandle(e) {
		switch(e.key) {
			case "Escape":
				const searchInput = <HTMLInputElement>document.getElementById('context-menu-search-input');
				if (searchInput.value.length === 0) {
					this.deleteContextMenu();
				}  else {
					searchInput.value = '';
					this.clearSearch();
				}
				return;
			case "Enter":
				this.fireCommand();
				return;
			case "ArrowUp":
				this.navigate("Up");
				return;
			case "ArrowDown":
				this.navigate("Down");
				return;
			case "ArrowLeft":
				this.navigate("Left");
				return;
			case "ArrowRight":
				this.navigate("Right");
				return;
		}
	}

	fireCommand() {
		this.items.find(child => child.isSelected())?.callExecCommand()
	}

	navigate(direction) {
		const selectedItemIndex = this.items.findIndex(item => item.isSelected());
		const len = this.items.length;
		const inDirection = (window.innerWidth - this.position.x) > 610 ? "Right" : "Left";
		const outDirection = ["Left", "Right"].filter(item => item !== inDirection)[0];

		if (selectedItemIndex && this.items[selectedItemIndex]?.isSubmenu()) {
			if (this.items[selectedItemIndex].isNavigating()) {
				if (direction === outDirection) {
					this.items[selectedItemIndex].setNavigating(false);
					return;
				} else {
					this.items[selectedItemIndex].submenuNavigate(direction);
					return;
				}
			} else if (direction === inDirection) {
				this.items[selectedItemIndex].setNavigating(true);
				return;
			}
		}

		if (direction === "Up") {
			let selectIndex = (len + (selectedItemIndex ?? len) - 1) % len;
			while (this.items[selectIndex].isSeparator()) {
				selectIndex = (len + selectIndex - 1) % len;
			}
			this.items[selectIndex].select();
			this.items[selectIndex].displaySubmenu();
			return;
		} else if (direction === "Down") {
			let selectIndex = (len + (selectedItemIndex ?? -1) + 1) % len;
			while (this.items[selectIndex].isSeparator()) {
				selectIndex = (len + selectIndex + 1) % len;
			}
			this.items[selectIndex].select();
			this.items[selectIndex].displaySubmenu();
			return;
		}
	}

	clearSearch() {
		this.items.forEach(item => item.showElement());
	}

	searchItem(event) {
		const inputString = event.target.value;
		this.clearSearch();
		this.items.filter(item => !item.searchResult(inputString)).forEach(item => item.hideElement());
	}
}
