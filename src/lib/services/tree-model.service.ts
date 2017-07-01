import { Injectable } from '@angular/core'
import { compact, find, first, isFunction, isString, last } from 'lodash'
import { TREE_EVENTS } from '../constants/events'
import { TreeNode } from '../models/tree-node'
import { TreeOptions } from '../models/tree-options.model'

@Injectable()
export class TreeModel {
    static focusedTree: TreeModel = null

    roots: TreeNode[]
    expandedNodeIds: { [id: string]: boolean } = {}
    activeNodeIds: { [id: string]: boolean } = {}
    hiddenNodeIds: { [id: string]: boolean } = {}
    focusedNodeId: string = null
    virtualRoot: TreeNode

    constructor(private nodes: any[], private events, public options: TreeOptions = new TreeOptions()) {
        const virtualRootConfig = {
            virtual: true,
            // todo: determine to use fixed children field later
            [this.options.childrenField]: this.nodes,
        }

        this.virtualRoot = new TreeNode(virtualRootConfig, null, this, 0)

        this.roots = this.virtualRoot.children

        if (this.roots) {
            this._calculateExpandedNodes()
        }
    }

    get isFocused() {
        return TreeModel.focusedTree === this
    }

    get focusedNode() {
        return this.focusedNodeId ? this.getNodeById(this.focusedNodeId) : null
    }

    get expandedNodes() {
        const nodes = Object.keys(this.expandedNodeIds)
            .filter((id) => this.expandedNodeIds[id])
            .map((id) => this.getNodeById(id))

        return compact(nodes)
    }

    get activeNodes() {
        const nodes = Object.keys(this.activeNodeIds)
            .filter((id) => this.activeNodeIds[id])
            .map((id) => this.getNodeById(id))

        return compact(nodes)
    }

    updateOptions(options) {
        this.options = options
    }

    // events
    fireEvent(event) {
        event.treeModel = this

        this.events[event.eventName].emit(event)
    }

    subscribe(eventName, fn) {
        this.events[eventName].subscribe(fn)
    }

    // getters
    getFocusedNode(): TreeNode {
        return this.focusedNode
    }

    getActiveNode(): TreeNode {
        return this.activeNodes[0]
    }

    getActiveNodes(): TreeNode[] {
        return this.activeNodes
    }

    getVisibleRoots() {
        return this.virtualRoot.visibleChildren
    }

    getFirstRoot(skipHidden = false) {
        return first(skipHidden ? this.getVisibleRoots() : this.roots)
    }

    getLastRoot(skipHidden = false) {
        return last(skipHidden ? this.getVisibleRoots() : this.roots)
    }

    isNodeFocused(node) {
        return this.focusedNode === node
    }

    isEmptyTree(): boolean {
        return this.roots && this.roots.length === 0
    }

    // locating nodes
    getNodeByPath(path: any[], startNode = null): TreeNode {
        if (!path) {
            return null
        }

        startNode = startNode || this.virtualRoot
        if (path.length === 0) {
            return startNode
        }

        if (!startNode.children) {
            return null
        }

        const childId = path.shift()
        const childNode = find(startNode.children, { id: childId })

        if (!childNode) {
            return null
        }

        return this.getNodeByPath(path, childNode)
    }

    getNodeById(id) {
        const idStr = id.toString()

        return this.getNodeBy((node) => node.id.toString() === idStr)
    }

    getNodeBy(predicate, startNode = null) {
        startNode = startNode || this.virtualRoot

        if (!startNode.children) {
            return null
        }

        const found = find(startNode.children, predicate)

        if (found) { // found in children
            return found
        } else { // look in children's children
            for (const child of startNode.children) {
                const foundInChildren = this.getNodeBy(predicate, child)
                if (foundInChildren) {
                    return foundInChildren
                }
            }
        }
    }

    isExpanded(node) {
        return this.expandedNodeIds[node.id]
    }

    isHidden(node) {
        return this.hiddenNodeIds[node.id]
    }

    isActive(node) {
        return this.activeNodeIds[node.id]
    }

    setFocusedNode(node) {
        this.focusedNodeId = node ? node.id : null
    }

    setFocus(value) {
        TreeModel.focusedTree = value ? this : null
    }

    doForAll(fn) {
        this.roots.forEach((root) => root.doForAll(fn))
    }

    focusNextNode() {
        const previousNode = this.getFocusedNode()
        const nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true)
        if (nextNode) {
            nextNode.focus()
        }
    }

    focusPreviousNode() {
        const previousNode = this.getFocusedNode()
        const nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true)
        if (nextNode) {
            nextNode.focus()
        }
    }

    focusDrillDown() {
        const previousNode = this.getFocusedNode()
        if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
            previousNode.toggleExpanded()
        } else {
            const nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true)
            if (nextNode) {
                nextNode.focus()
            }
        }
    }

    focusDrillUp() {
        const previousNode = this.getFocusedNode()
        if (!previousNode) {
            return
        }
        if (previousNode.isExpanded) {
            previousNode.toggleExpanded()
        } else {
            const nextNode = previousNode.realParent
            if (nextNode) {
                nextNode.focus()
            }
        }
    }

    setActiveNode(node, value, multi = false) {
        if (multi) {
            this._setActiveNodeMulti(node, value)
        } else {
            this._setActiveNodeSingle(node, value)
        }

        if (value) {
            node.focus()
            this.fireEvent({ eventName: TREE_EVENTS.activate, node })
        } else {
            this.fireEvent({ eventName: TREE_EVENTS.deactivate, node })
        }
    }

    setExpandedNode(node, value) {
        this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, { [node.id]: value })
        this.fireEvent({ eventName: TREE_EVENTS.toggleExpander, node, isExpanded: value })
    }

    expandAll() {
        this.roots.forEach((root) => root.expandAll())
    }

    collapseAll() {
        this.roots.forEach((root) => root.collapseAll())
    }

    setIsHidden(node, value) {
        this.hiddenNodeIds = Object.assign({}, this.hiddenNodeIds, { [node.id]: value })
    }

    performKeyAction(node, $event) {
        const action = this.options.actionMapping.keys[$event.keyCode]
        if (action) {
            $event.preventDefault()
            action(this, node, $event)

            return true
        } else {
            return false
        }
    }

    filterNodes(filter, autoShow = true) {
        let filterFn

        if (!filter) {
            return this.clearFilter()
        }

        // support function and string filter
        if (isString(filter)) {
            filterFn = (node) => node.displayField.toLowerCase().indexOf(filter.toLowerCase()) !== -1
        } else if (isFunction(filter)) {
            filterFn = filter
        } else {
            console.error('Don\'t know what to do with filter', filter)
            console.error('Should be either a string or function')

            return
        }

        const ids = {}
        this.roots.forEach((node) => this._filterNode(ids, node, filterFn, autoShow))
        this.hiddenNodeIds = ids
        this.fireEvent({ eventName: TREE_EVENTS.changeFilter })
    }

    clearFilter() {
        this.hiddenNodeIds = {}
        this.fireEvent({ eventName: TREE_EVENTS.changeFilter })
    }

    moveNode(node, to) {
        const fromIndex = node.getIndexInParent()
        const fromParent = node.parent

        if (!this._canMoveNode(node, fromIndex, to)) {
            return
        }

        const fromChildren = fromParent.getField('children')

        // If node doesn't have children - create children array
        if (!to.parent.getField('children')) {
            to.parent.setField('children', [])
        }
        const toChildren = to.parent.getField('children')

        const originalNode = fromChildren.splice(fromIndex, 1)[0]

        // Compensate for index if already removed from parent:
        const toIndex = (fromParent === to.parent && to.index > fromIndex) ? to.index - 1 : to.index

        toChildren.splice(toIndex, 0, originalNode)

        fromParent.treeModel.update()
        if (to.parent.treeModel !== fromParent.treeModel) {
            to.parent.treeModel.update()
        }

        this.fireEvent({
            eventName: TREE_EVENTS.moveNode,
            node: originalNode,
            to: { parent: to.parent.data, index: toIndex },
        })
    }

    // private methods
    private _canMoveNode(node, fromIndex, to) {
        // same node:
        if (node.parent === to.parent && fromIndex === to.index) {
            return false
        }

        return !to.parent.isDescendantOf(node)
    }


    private _filterNode(ids, node, filterFn, autoShow) {
        // if node passes function then it's visible
        let isVisible = filterFn(node)

        if (node.children) {
            // if one of node's children passes filter then this node is also visible
            node.children.forEach((child) => {
                if (this._filterNode(ids, child, filterFn, autoShow)) {
                    isVisible = true
                }
            })
        }

        // mark node as hidden
        if (!isVisible) {
            ids[node.id] = true
        }
        // auto expand parents to make sure the filtered nodes are visible
        if (autoShow && isVisible) {
            node.ensureVisible()
        }

        return isVisible
    }

    private _calculateExpandedNodes(startNode = null) {
        startNode = startNode || this.virtualRoot

        if (startNode.data[this.options.isExpandedField]) {
            this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, { [startNode.id]: true })
        }
        if (startNode.children) {
            startNode.children.forEach((child) => this._calculateExpandedNodes(child))
        }
    }

    private _setActiveNodeSingle(node, value) {
        // Deactivate all other nodes:
        this.activeNodes
            .filter((activeNode) => activeNode !== node)
            .forEach((activeNode) => {
                this.fireEvent({ eventName: TREE_EVENTS.deactivate, node: activeNode })
            })

        if (value) {
            this.activeNodeIds = { [node.id]: true }
        } else {
            this.activeNodeIds = {}
        }
    }

    private _setActiveNodeMulti(node, value) {
        this.activeNodeIds = Object.assign({}, this.activeNodeIds, { [node.id]: value })
    }

}
