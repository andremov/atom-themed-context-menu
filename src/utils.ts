import { ContextMenuItemInterface, ContextMenuSubmenuItem, ContextMenuSeparatorItem, ContextMenuCommandItem } from './types';

export enum InterfaceNames {
    'Submenu', 'Separator', 'Command'
}

export function menuItemTypeCheck(item: ContextMenuItemInterface, interfaceCheck: InterfaceNames): boolean {
    switch(interfaceCheck) {
        case 0:
            return !!(<ContextMenuSubmenuItem>item).submenu;
        case 1:
            return !!(<ContextMenuSeparatorItem>item).type;
        case 2:
            return !!(<ContextMenuCommandItem>item).command;
        default:
            return false
    }
}
