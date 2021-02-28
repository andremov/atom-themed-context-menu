export interface ContextMenuItem {
    label?: string
    command?: string
    commandDetail?: any
    type?: "separator"
}

export interface MouseClick {
    clientX: number
    clientY: number
}
