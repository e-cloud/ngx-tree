import { first, last, pullAt } from 'lodash'
import { TREE_EVENTS } from '../constants/events'
import { TreeEvent } from './index'
import { TreeModel } from './tree-model'

export class TreeNode {
    children: TreeNode[]
    index: number
    position = 0
    height: number

    get isHidden() {
        return this.treeModel.isNodeHidden(this)
    }

    get isExpanded() {
        return this.treeModel.isNodeExpanded(this)
    }

    get isCollapsed() {
        return !this.isExpanded
    }

    get isActive() {
        return this.treeModel.isNodeActive(this)
    }

    get isFocused() {
        return this.treeModel.isNodeFocused(this)
    }

    get isLeaf() {
        return !this.hasChildren
    }

    get isRoot() {
        return this.parent === null
    }

    get level() {
        return this.parent ? this.parent.level + 1 : 0
    }

    get path(): string[] {
        return this.parent ? [...this.parent.path, this.id] : []
    }

    // helper get functions:
    get hasChildren() {
        return !!(this.data.hasChildren || (this.children && this.children.length > 0))
    }

    // proxy functions:
    get options() {
        return this.treeModel.options
    }

    // field accessors:
    get displayField() {
        return this.getField('display')
    }

    get id() {
        return this.getField('id')
    }

    set id(value) {
        this.setField('id', value)
    }

    get visibleChildren() {
        return (this.children || []).filter((node) => !node.isHidden)
    }

    get cssClass() {
        return [this.options.nodeClass(this), `tree-node-level-${ this.level }`].join(' ')
    }

    constructor(public data: any, public parent: TreeNode, public treeModel: TreeModel, index: number) {
        if (this.id === undefined || this.id === null) {
            this.id = uuid()
        } // Make sure there's a unique id without overriding existing ids to work with immutable data structures
        this.index = index

        treeModel.addCache(this)
        if (data[this.options.isExpandedField]) {
            treeModel.setExpandedNodeInPlace(this)
        }

        if (this.getField('children')) {
            this.initChildren()
        }
    }

    fireEvent(event: TreeEvent) {
        this.treeModel.fireEvent(event)
    }

    getField(key: string) {
        return this.data[this.options[`${key}Field`]]
    }

    setField(key: string, value) {
        this.data[this.options[`${key}Field`]] = value
    }

    // traversing:
    findAdjacentSibling(steps: number, skipHidden = false) {
        return this.getParentChildren(skipHidden)[this.index + steps]
    }

    findNextSibling(skipHidden = false) {
        return this.findAdjacentSibling(+1, skipHidden)
    }

    findPreviousSibling(skipHidden = false) {
        return this.findAdjacentSibling(-1, skipHidden)
    }

    getFirstChild(skipHidden = false) {
        const children = skipHidden ? this.visibleChildren : this.children

        return first(children || [])
    }

    getLastChild(skipHidden = false) {
        const children = skipHidden ? this.visibleChildren : this.children

        return last(children || [])
    }

    findNextNode(goInside = true, skipHidden = false) {
        return goInside && this.isExpanded && this.getFirstChild(skipHidden) ||
            this.findNextSibling(skipHidden) ||
            this.parent && this.parent.findNextNode(false, skipHidden)
    }

    findPreviousNode(skipHidden = false) {
        const previousSibling = this.findPreviousSibling(skipHidden)
        if (!previousSibling) {
            return this.parent
        }

        return previousSibling.getLastOpenDescendant(skipHidden)
    }

    isDescendantOf(node: TreeNode) {
        if (this === node) {
            return true
        } else {
            return this.parent && this.parent.isDescendantOf(node)
        }
    }

    getNodePadding() {
        return this.options.levelPadding * (this.level - 1) + 'px'
    }

    getIndexInParent(skipHidden = false) {
        return this.getParentChildren(skipHidden).indexOf(this)
    }

    // helper methods:
    loadChildren() {
        if (!this.options.getChildren) {
            return Promise.resolve() // Not getChildren method - for using redux
        }

        return Promise.resolve(this.options.getChildren(this))
            .then((children) => {
                if (children) {
                    this.setField('children', children)
                    this.initChildren()
                    this.children.forEach((child) => {
                        if (child.getField('isExpanded') && child.hasChildren) {
                            child.expand()
                        }
                    })
                }
            })
            .then(() => {
                this.fireEvent({
                    eventName: TREE_EVENTS.loadChildren,
                    node: this,
                })
            })
    }

    expand() {
        if (!this.isExpanded) {
            return this.toggleExpanded()
        }

        return Promise.resolve()
    }

    collapse() {
        if (this.isExpanded) {
            this.toggleExpanded()
        }

        return this
    }

    traverse(fn: (node: TreeNode) => any) {
        Promise.resolve(fn(this)).then(() => {
            if (this.children) {
                this.children.forEach((child) => child.traverse(fn))
            }
        })
    }

    expandAll() {
        this.traverse((node) => node.expand())
    }

    collapseAll() {
        this.traverse((node) => node.collapse())
    }

    toggleExpanded(isExpanded = !this.isExpanded) {
        if (this.hasChildren) {
            this.treeModel.setExpandedNode(this, isExpanded)

            if (!this.children && this.hasChildren && isExpanded) {
                return this.loadChildren()
            }
        }

        return Promise.resolve()
    }

    setActive(isActive = true, isMulti = false) {
        this.treeModel.setActiveNode(this, isActive, isMulti)
        if (isActive) {
            this.focus()
        }

        return this
    }

    setHidden(isHidden = true) {
        this.treeModel.setHiddenNode(this, isHidden)

        return this
    }

    toggleActivated(isMulti = false) {
        this.setActive(!this.isActive, isMulti)

        return this
    }

    setActiveAndVisible(isMulti = false) {
        return this.setActive(true, isMulti)
            .ensureVisible()
    }

    ensureVisible() {
        if (this.parent) {
            this.parent.expand()
            this.parent.ensureVisible()
        }

        return this
    }

    focus() {
        const previousNode = this.treeModel.getFocusedNode()
        this.treeModel.setFocusedNode(this)
        if (previousNode) {
            this.fireEvent({ eventName: TREE_EVENTS.blur, node: previousNode })
        }
        this.fireEvent({ eventName: TREE_EVENTS.focus, node: this })

        return this
    }

    blur() {
        const previousNode = this.treeModel.getFocusedNode()
        this.treeModel.setFocusedNode(null)
        if (previousNode) {
            this.fireEvent({ eventName: TREE_EVENTS.blur, node: this })
        }

        return this
    }

    hide() {
        this.setHidden(true)

        return this
    }

    show() {
        this.setHidden(false)

        return this
    }

    addChild(data: any, index: number) {
        const node = new TreeNode(data, this, this.treeModel, null)

        this.children.splice(index, 0, node)
        this.children = this.children.slice()

        this.reCalcChildrenIndices(index)

        this.fireEvent({ eventName: TREE_EVENTS.addNode, node })
    }

    remove() {
        this.parent.removeChild(this)
    }

    removeChild(node: TreeNode) {
        pullAt(this.getField('children'), node.index)
        this.children = pullAt(this.children, node.index).slice()

        this.reCalcChildrenIndices(0)

        this.fireEvent({ eventName: TREE_EVENTS.removeNode, node })

        if (node.isFocused) {
            this.treeModel.setFocusedNode(null)
            this.treeModel.setActiveNode(node, false)
        }

        if (node.isExpanded) {
            this.treeModel.setExpandedNodeInPlace(node, false)
        }

        node.treeModel = null
    }

    mouseAction(actionName: string, $event: MouseEvent, data: any = null) {
        this.treeModel.setFocus(true)

        const actionMapping = this.options.actionMapping.mouse
        const action = actionMapping[actionName]

        if (action) {
            action(this.treeModel, this, $event, data)
        }
    }

    private reCalcChildrenIndices(offset) {
        this.children.slice(this.index).forEach((child, index) => {
            child.index = index + offset
        })
    }

    private initChildren() {
        this.children = this.getField('children')
            .map((data, index) => new TreeNode(data, this, this.treeModel, index))
    }

    private getLastOpenDescendant(skipHidden = false) {
        const lastChild = this.getLastChild(skipHidden)

        return (this.isCollapsed || !lastChild)
            ? this
            : lastChild.getLastOpenDescendant(skipHidden)
    }

    private getParentChildren(skipHidden = false): TreeNode[] {
        return this.parent
            ? (skipHidden ? this.parent.visibleChildren : this.parent.children)
            : []
    }
}

let _uuid = 0

function uuid() {
    return `ngx-tid-${_uuid++}`
}
