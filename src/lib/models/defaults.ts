import { NUMBER_KEYS } from '../constants/keys'
import { TreeModel } from './tree-model'
import { TreeNode } from './tree-node'
import { ActionMapping } from './tree-options'

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
        { from, to }: { from: TreeNode; to: { parent: TreeNode; index: number, dropOnNode: boolean } },
    ) => {
        // default action assumes from = node, to = {parent, index}
        tree.moveNode(from, to)
    },
}

export const defaultActionMapping: ActionMapping = {
    mouse: {
        click: TREE_ACTIONS.TOGGLE_SELECTED,
        dblClick: null,
        contextMenu: null,
        expanderClick: TREE_ACTIONS.TOGGLE_EXPANDED,
        drop: TREE_ACTIONS.MOVE_NODE,
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
