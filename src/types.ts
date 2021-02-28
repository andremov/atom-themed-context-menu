// used for the context menu items provided by atom
export interface ContextMenuItem {
    label?: string
    command?: string
    commandDetail?: any
    type?: "separator"
}

// used for mouse events
export interface MouseClick {
    clientX: number
    clientY: number
}
