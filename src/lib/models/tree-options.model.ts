import { defaultsDeep } from 'lodash'
import { NUMBER_KEYS } from '../constants/keys'
import { ITreeOptions } from './index'
import { TreeModel } from './tree-model'
import { TreeNode } from './tree-node'

export interface IActionHandler {
    (tree: TreeModel, node: TreeNode, $event: any, ...rest);
}

export const TREE_ACTIONS = {
    TOGGLE_SELECTED: (tree: TreeModel, node: TreeNode, $event: any) => node && node.toggleActivated(),
    TOGGLE_SELECTED_MULTI: (tree: TreeModel, node: TreeNode, $event: any) => node && node.toggleActivated(true),
    SELECT: (tree: TreeModel, node: TreeNode, $event: any) => node.setActive(true),
    DESELECT: (tree: TreeModel, node: TreeNode, $event: any) => node.setActive(false),
    FOCUS: (tree: TreeModel, node: TreeNode, $event: any) => node.focus(),
    TOGGLE_EXPANDED: (tree: TreeModel, node: TreeNode, $event: any) => node.hasChildren && node.toggleExpanded(),
    EXPAND: (tree: TreeModel, node: TreeNode, $event: any) => node.expand(),
    COLLAPSE: (tree: TreeModel, node: TreeNode, $event: any) => node.collapse(),
    DRILL_DOWN: (tree: TreeModel, node: TreeNode, $event: any) => tree.focusDrillDown(),
    DRILL_UP: (tree: TreeModel, node: TreeNode, $event: any) => tree.focusDrillUp(),
    NEXT_NODE: (tree: TreeModel, node: TreeNode, $event: any) => tree.focusNextNode(),
    PREVIOUS_NODE: (tree: TreeModel, node: TreeNode, $event: any) => tree.focusPreviousNode(),
    MOVE_NODE: (
        tree: TreeModel,
        node: TreeNode,
        $event: any,
        { from, to }: { from: TreeNode; to: { parent: TreeNode; index: number } },
    ) => {
        // default action assumes from = node, to = {parent, index}
        tree.moveNode(from, to)
    },
}

const defaultActionMapping: IActionMapping = {
    mouse: {
        click: TREE_ACTIONS.TOGGLE_SELECTED,
        dblClick: null,
        contextMenu: null,
        expanderClick: TREE_ACTIONS.TOGGLE_EXPANDED,
    },
    keys: {
        [NUMBER_KEYS.RIGHT]: TREE_ACTIONS.DRILL_DOWN,
        [NUMBER_KEYS.LEFT]: TREE_ACTIONS.DRILL_UP,
        [NUMBER_KEYS.DOWN]: TREE_ACTIONS.NEXT_NODE,
        [NUMBER_KEYS.UP]: TREE_ACTIONS.PREVIOUS_NODE,
        [NUMBER_KEYS.SPACE]: TREE_ACTIONS.TOGGLE_SELECTED,
        [NUMBER_KEYS.ENTER]: TREE_ACTIONS.TOGGLE_SELECTED,
    },
}

export interface IActionMapping {
    mouse?: {
        click?: IActionHandler,
        dblClick?: IActionHandler,
        contextMenu?: IActionHandler,
        expanderClick?: IActionHandler,
    };
    keys?: {
        [key: number]: IActionHandler
    };
}

export class TreeOptions {
    actionMapping: IActionMapping

    constructor(private options: ITreeOptions = {}) {
        this.actionMapping = defaultsDeep({}, this.options.actionMapping, defaultActionMapping)
    }

    get childrenField(): string {
        return this.options.childrenField || 'children'
    }

    get displayField(): string {
        return this.options.displayField || 'name'
    }

    get idField(): string {
        return this.options.idField || 'id'
    }

    get isExpandedField(): string {
        return this.options.isExpandedField || 'isExpanded'
    }

    get isHiddenField(): string {
        return this.options.isHiddenField || 'isHidden'
    }

    get getChildren(): any {
        return this.options.getChildren
    }

    get levelPadding(): number {
        return this.options.levelPadding || 0
    }

    get useVirtualScroll(): boolean {
        return this.options.useVirtualScroll
    }

    nodeClass(node: TreeNode): string {
        return this.options.nodeClass ? this.options.nodeClass(node) : ''
    }

    nodeHeight(node: TreeNode): number {
        if (node.data.virtual) {
            return 0
        }

        let nodeHeight = this.options.nodeHeight || 22

        if (typeof nodeHeight === 'function') {
            nodeHeight = nodeHeight(node)
        }

        // account for drop slots:
        return nodeHeight + (node.index === 0 ? 2 : 1)
    }
}
