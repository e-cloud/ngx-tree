import {
    Component,
    ContentChild,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import 'element-closest'
import { EventsMap, TREE_EVENTS } from '../../constants/events'
import { TreeModel } from '../../models/tree-model'
import { TreeNode } from '../../models/tree-node'
import { TreeOptions } from '../../models/tree-options.model'
import { TreeViewportComponent } from '../tree-viewport/tree-viewport.component'

@Component({
    moduleId: module.id,
    selector: 'ngx-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnChanges {
    @Input() nodes: TreeNode[]
    @Input() options: TreeOptions
    @Input() focused

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
    @ContentChild('treeNodeTemplate') treeNodeTemplate: TemplateRef<any>
    @ContentChild('treeNodeWrapperTemplate') treeNodeWrapperTemplate: TemplateRef<any>
    @ContentChild('treeNodeFullTemplate') treeNodeFullTemplate: TemplateRef<any>

    @ViewChild('viewport') viewportComponent: TreeViewportComponent

    emitterMap: EventsMap
    treeModel: TreeModel = null

    constructor() {
        this.emitterMap = Object.keys(TREE_EVENTS).reduce((map, name) => {
            if (!this.hasOwnProperty(name)) {
                throw new TypeError(`Unmatched events: [${name}]`)
            }

            this[name] = map[name] = new EventEmitter()

            return map
        }, {}) as any
    }

    @HostListener('body: keydown', ['$event'])
    onKeydown($event) {
        if (!this.treeModel.isFocused) {
            return
        }

        if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
            return
        }

        const focusedNode = this.treeModel.getFocusedNode()

        this.treeModel.performKeyAction(focusedNode, $event)
    }

    @HostListener('body: mousedown', ['$event'])
    onMousedown($event) {
        const insideClick = $event.target.closest('ngx-tree')

        if (!insideClick) {
            this.treeModel.setFocus(false)
        }
    }

    ngOnChanges(changes) {
        if (changes.nodes && changes.nodes.currentValue) {
            this.treeModel = new TreeModel(changes.nodes.currentValue, this.emitterMap, this.options)
        } else if (changes.options && changes.options.currentValue && this.treeModel) {
            this.treeModel.updateOptions(changes.options.currentValue)
        }
    }

    sizeChanged() {
        this.viewportComponent.setViewport()
    }

}
