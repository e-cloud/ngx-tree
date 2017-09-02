import { Directive, EventEmitter, Input, Output } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserTestingModule } from '@angular/platform-browser/testing'

import { createTreeDataOptions, TreeNode } from '../../models'
import { TreeNodeDropSlotComponent } from './tree-node-drop-slot.component'

@Directive({
    selector: '[ngxTreeDrop]',
})
export class FakeTreeDropDirective {
    @Output('ngxTreeDrop') onDrop$ = new EventEmitter()
    @Output('treeDropDragOver') onDragOver$ = new EventEmitter()
    @Output('treeDropDragLeave') onDragLeave$ = new EventEmitter()
    @Output('treeDropDragEnter') onDragEnter$ = new EventEmitter()
    @Input() treeAllowDrop: any

    constructor() {}
}

@Directive({
    selector: '[ngxTreeDrag]',
})
export class FakeTreeDragDirective {
    @Input('ngxTreeDrag') draggingTarget: TreeNode
    @Input() treeDragEnabled: boolean

    constructor() {}
}

describe('TreeNodeDropSlotComponent', () => {
    let component: TreeNodeDropSlotComponent
    let fixture: ComponentFixture<TreeNodeDropSlotComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    BrowserTestingModule,
                ],
                declarations: [
                    TreeNodeDropSlotComponent,
                    FakeTreeDropDirective,
                    FakeTreeDragDirective,
                ],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeDropSlotComponent)
        component = fixture.componentInstance
        component.options = createTreeDataOptions()
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
