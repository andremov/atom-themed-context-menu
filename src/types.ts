// used for the context menu items provided by atom
export interface ContextMenuItemInterface {

}

export interface ContextMenuSeparatorItem extends ContextMenuItemInterface {
    type: 'separator';
}

export interface ContextMenuCommandItem extends ContextMenuItemInterface {
    id: string;
    label: string;
    command: string;
    commandDetail: string;
}

export interface ContextMenuSubmenuItem extends ContextMenuItemInterface {
    id: string;
    label: string;
    submenu: ContextMenuItemInterface[];
}

// used for mouse events
export interface MousePosition extends MenuMouseEvent {
    isSubmenu?: boolean;
}

interface MenuMouseEvent {
    readonly target?: EventTarget;
    readonly clientX: number;
    readonly clientY: number;
}

export interface MenuPosition {
    x:number;
    y: number
}
