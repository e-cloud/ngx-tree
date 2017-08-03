import defaultsDeep from 'lodash-es/defaultsDeep'
import { defaultActionMapping } from './defaults'
import { TreeModel } from './tree-model'
import { TreeNode } from './tree-node'

export interface ActionHandler {
    (tree: TreeModel, node: TreeNode, $event: any, ...rest);
}

export interface ActionMapping {
    mouse?: {
        click?: ActionHandler,
        dblClick?: ActionHandler,
        contextMenu?: ActionHandler,
        expanderClick?: ActionHandler,
        dragStart?: ActionHandler,
        drag?: ActionHandler,
        dragEnd?: ActionHandler,
        dragOver?: ActionHandler,
        dragLeave?: ActionHandler,
        dragEnter?: ActionHandler,
        drop?: ActionHandler,
    };
    keys?: {
        [key: number]: ActionHandler
    };
}

export interface DropTarget {
    parent: TreeNode
    index: number
}

export type IAllowDropFn = (element: TreeNode, to: DropTarget, $event?: DragEvent) => boolean

export type IAllowDragFn = (node: TreeNode) => boolean

/**
 * This is the interface of the options input of the tree.
 * See docs for more detailed explanations
 */
export interface RawTreeOptions {
    /**
     * Override children field. Default: 'children'
     */
    childrenField?: string;
    /**
     * Override display field. Default: 'name'
     */
    displayField?: string;
    /**
     * Override id field. Default: 'id'
     */
    idField?: string;
    /**
     * Override isExpanded field. Default: 'isExpanded'
     */
    isExpandedField?: string;
    /**
     * Override isHidden field. Default: 'isHidden'
     */
    isHiddenField?: string;
    /**
     * Change the default mouse and key actions on the tree
     */
    actionMapping?: any;
    /**
     * Specify padding per node instead of children padding (to allow full row select for example)
     */
    levelPadding?: number;
    /**
     * Boolean whether virtual scroll should be used.
     * Increases performance for large trees
     * Default is false
     */
    useVirtualScroll?: boolean;
    /**
     * Specify if dragging tree nodes is allowed.
     * This could be a boolean, or a function that receives a TreeNode and returns a boolean
     *
     * **Default value: false**
     *
     * Example:
     * ```
     * options = {
     *   allowDrag: true
     * }
     * ```
     */
    allowDrag?: boolean | IAllowDragFn;
    /**
     * Specify whether dropping inside the tree is allowed. Optional types:
     *  - boolean
     *  - (element:any, to:{parent:ITreeNode, index:number}):boolean
     * A function that receives the dragged element, and the drop location (parent node and index inside the parent),
     * and returns true or false.
     *
     * **Default Value: true**
     *
     * example:
     * ```
     * options = {
     *  allowDrop: (element, {parent, index}) => parent.isLeaf
     * }
     * ```
     */
    allowDrop?: boolean | IAllowDropFn;
    /**
     * For use with `useVirtualScroll` option.
     * Specify a height for drop slots (located between nodes) in pixels
     *
     * **Default Value: 2**
     */
    dropSlotHeight?: number;

    /**
     * Supply function for getting fields asynchronously. Should return a Promise
     */
    getChildren? (node: TreeNode): any;

    /**
     * Supply function for getting a custom class for the node component
     */
    nodeClass?(node: TreeNode): string;
}

export class TreeOptions {
    displayField: string
    childrenField: string
    getChildren: (node: TreeNode) => any[]
    dropSlotHeight: number
    useVirtualScroll: boolean
    isHiddenField: string
    levelPadding: number
    isExpandedField: string
    idField: string
    actionMapping: ActionMapping

    constructor(private options: RawTreeOptions = {}) {
        this.actionMapping = defaultsDeep({}, this.options.actionMapping, defaultActionMapping)

        this.childrenField = this.options.childrenField || 'children'
        this.displayField = this.options.displayField || 'name'
        this.idField = this.options.idField || 'id'
        this.isExpandedField = this.options.isExpandedField || 'isExpanded'
        this.isHiddenField = this.options.isHiddenField || 'isHidden'
        this.getChildren = this.options.getChildren
        this.levelPadding = this.options.levelPadding || 0
        this.useVirtualScroll = this.options.useVirtualScroll
        this.dropSlotHeight = this.options.dropSlotHeight || 2
    }

    nodeClass(node: TreeNode): string {
        return this.options.nodeClass ? this.options.nodeClass(node) : ''
    }

    allowDrop(element: TreeNode, to: DropTarget, $event?: DragEvent): boolean {
        if (this.options.allowDrop instanceof Function) {
            return this.options.allowDrop(element, to, $event)
        } else {
            return this.options.allowDrop === undefined ? true : this.options.allowDrop
        }
    }

    allowDrag(node: TreeNode): boolean {
        if (this.options.allowDrag instanceof Function) {
            return this.options.allowDrag(node)
        } else {
            return this.options.allowDrag
        }
    }
}
