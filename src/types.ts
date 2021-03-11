// used for the context menu items provided by atom
export interface ContextMenuItemInterface {
    label?: string;
    command?: string;
    commandDetail?: any;
    type?: 'separator';
    submenu?: ContextMenuItemInterface[];
}

// used for mouse events
export interface MousePosition extends MouseEvent {
    isSubmenu?: boolean;
}
