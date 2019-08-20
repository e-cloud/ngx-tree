import { TreeNode } from './tree-node'

export interface TreeEvent {
    eventName: string
    node?: TreeNode
    isExpanded?: boolean
    to?: { parent: TreeNode; index: number }
}

export interface DragAndDropEvent {
    event: MouseEvent
    element: TreeNode | null
}
