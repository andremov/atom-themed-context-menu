import { MenuItem } from './MenuItem';
import { TCMHandler } from './main';
import { ContextMenuItemInterface, MousePosition } from './types';

export class Menu {
	private visible: boolean = true;
	private readonly childrenData: ContextMenuItemInterface[] = [];
	private children: MenuItem[] = [];
	private readonly domElement: HTMLElement;
	public target: EventTarget | null;

	constructor(
		e: MousePosition,
		items: ContextMenuItemInterface[],
		visible: boolean,
	) {
		this.target = e.target;

		this.domElement = document.createElement('div');
		this.domElement.classList.add('submenu');

		if (!visible) {
			this.visible = false;
			this.domElement.classList.add('invisible');
		}

		if (items[0].type === "separator") {
			items.splice(0,1);
		}

		// add context menu items to context menu
		items.forEach((element) => {
			this.addItem(element);
		});


		// move context menu position to mouse event position
		this.domElement.setAttribute('style', this.getPositionStyleString(e));

		TCMHandler.addMenu(this.domElement);
	}

	public unselectAll() {
		this.children.forEach((item) => item.unselect());
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
	private getPositionStyleString(e: MousePosition): string {
		let x1 = e.clientX + (!e.isSubmenu ? 10 : 0);
		let y1 = e.clientY + (!e.isSubmenu ? 5 : 0);

		let x2 = Math.min(x1, window.innerWidth - 310);
		let y2 = Math.min(y1, window.innerHeight - this.getHeight() - 10);

		if (e.isSubmenu) {
			if (x1 !== x2) {
				let altx1 = e.clientX - 600;
				let altx2 = Math.max(altx1, 0);
				if (altx1 === altx2) {
					x2 = altx1;
				}
			}
		}

		x2 = Math.max(0, x2)
		y2 = Math.max(10, y2)

		return 'top:' + y2 + 'px; left:' + x2 + 'px';
	}

	// adds a context menu item to context menu
	private addItem(item: ContextMenuItemInterface): void {
		const mitem = MenuItem.createMenuItem(item, this);
		this.children.push(mitem);
		this.domElement.appendChild(mitem.getElement());
	}

	// calculate context menu height for positioning function
	private getHeight(): number {
		if (this.children.length === 0) {
			return 0
		}

		return this.children
			.map((item) => item.getHeight())
			.reduce(function(a, b) {
				return a + b;
			});
	}

	public dispose(): void {
		TCMHandler.removeMenu(this.domElement);
	}
}
