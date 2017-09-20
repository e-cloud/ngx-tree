import {
    Component,
    ContentChild,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import 'element-closest'
import each from 'lodash-es/each'
import { EventsMap, TREE_EVENTS } from '../../constants/events'
import {
    createTreeUIOptions,
    IAllowDragFn,
    IAllowDropFn,
    ILevelPaddingFn,
    TreeDataOptions,
    TreeModel,
    TreeNode,
    TreeUIOptions,
} from '../../models'
import { TreeDraggingTargetService } from '../../services/tree-dragging-target.service'
import { TreeNodeChildrenComponent } from '../tree-node-children/tree-node-children.component'
import { TreeViewportComponent } from '../tree-viewport/tree-viewport.component'

@Component({
    selector: 'ngx-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnChanges, OnDestroy {
    emitterMap: EventsMap
    treeModel: TreeModel = null
    UIOptions: TreeUIOptions
    refreshTree = false

    @Input() nodes: TreeNode[]
    @Input() focusTarget: string
    @Input() activateTarget: string
    @Input() dataOptions: TreeDataOptions

    @Input() allowDrag: boolean | IAllowDragFn
    @Input() allowDrop: boolean | IAllowDropFn
    @Input() levelPadding: number | ILevelPaddingFn
    @Input() useVirtualScroll: boolean
    @Input() nodeClass: (node: TreeNode) => string
    @Input() enableAnimation = true
    @Input() keepNodesExpanded = false

    @Output() expand: EventEmitter<any> = null
    @Output() collapse: EventEmitter<any> = null
    @Output() toggleExpander: EventEmitter<any> = null
    @Output() activate: EventEmitter<any> = null
    @Output() deactivate: EventEmitter<any> = null
    @Output() focus: EventEmitter<any> = null
    @Output() blur: EventEmitter<any> = null
    @Output() initialized: EventEmitter<any> = null
    @Output() moveNode: EventEmitter<any> = null
    @Output() loadChildren: EventEmitter<any> = null
    @Output() changeFilter: EventEmitter<any> = null
    @Output() addNode: EventEmitter<any> = null
    @Output() removeNode: EventEmitter<any> = null

    @HostBinding('class.ngx-tree') className = true

    @ContentChild('loadingTemplate') loadingTemplate: TemplateRef<any>
    @ContentChild('expanderTemplate') expanderTemplate: TemplateRef<any>
    @ContentChild('treeNodeTemplate') treeNodeTemplate: TemplateRef<any>
    @ContentChild('treeNodeWrapperTemplate') treeNodeWrapperTemplate: TemplateRef<any>
    @ContentChild('treeNodeFullTemplate') treeNodeFullTemplate: TemplateRef<any>

    @ViewChild('viewport') viewportComponent: TreeViewportComponent
    @ViewChild('root') root: TreeNodeChildrenComponent

    constructor(public treeDraggingTargetService: TreeDraggingTargetService) {
        this.emitterMap = Object.keys(TREE_EVENTS).reduce((map, name) => {
            if (!this.hasOwnProperty(name)) {
                throw new TypeError(`Unmatched events: [${name}]`)
            }

            this[name] = map[name] = new EventEmitter()

            return map
        }, {}) as any

        this.UIOptions = createTreeUIOptions()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nodes && changes.nodes.currentValue) {
            const oldTreeModel = this.treeModel
            this.treeModel = new TreeModel(changes.nodes.currentValue, this.emitterMap, this.dataOptions)
            if (oldTreeModel && this.keepNodesExpanded) {
                oldTreeModel.expandedNodes.forEach(node => {
                    this.treeModel.setExpandedNodeInPlace(node)
                })
            }
            if (!changes.nodes.isFirstChange()) {
                this.refreshTree = true
            }
        } else if (changes.dataOptions && changes.dataOptions.currentValue && this.treeModel) {
            this.treeModel.updateOptions(changes.dataOptions.currentValue)
        }

        if (changes.focusTarget && changes.focusTarget.currentValue && this.treeModel) {
            this.treeModel.focusNode(this.focusTarget)
        }

        if (changes.activateTarget && changes.activateTarget.currentValue && this.treeModel) {
            this.treeModel.activateNode(this.activateTarget)
        }

        if (changes.allowDrag
            || changes.allowDrop
            || changes.levelPadding
            || changes.useVirtualScroll
            || changes.nodeClass) {
            this.UIOptions = createTreeUIOptions({
                allowDrag: this.allowDrag,
                allowDrop: this.allowDrop,
                levelPadding: this.levelPadding,
                useVirtualScroll: this.useVirtualScroll,
                nodeClass: this.nodeClass,
            })
        }
    }

    ngOnDestroy() {
        each(this.emitterMap, function (emitter) {
            emitter.complete()
        })
    }

    @HostListener('body: keydown', ['$event'])
    onKeydown($event) {
        if (!this.treeModel.isFocused) {
            return
        }

        if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
            return
        }

        const focusedNode = this.treeModel.focusedNode

        this.treeModel.performKeyAction(focusedNode, $event)
    }

    @HostListener('body: mousedown', ['$event'])
    onMousedown($event) {
        const insideClick = $event.target.closest('ngx-tree')

        if (!insideClick) {
            this.treeModel.setFocus(false)
        }
    }

    sizeChanged() {
        this.viewportComponent.setViewport()
    }

}
