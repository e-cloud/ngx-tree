import { Component, Input } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserTestingModule } from '@angular/platform-browser/testing'

import { createTreeDataOptions, TreeNode, TreeUIOptions } from '../../models'
import { FakeTreeNodeChildrenComponent } from '../tree/tree.component.spec'
import { TreeNodeComponent } from './tree-node.component'

@Component({
    selector: 'ngx-tree-node-wrapper',
    template: '',
})
export class FakeTreeNodeWrapperComponent {
    @Input() node: TreeNode
    @Input() options: TreeUIOptions
    @Input() index: number
    @Input() templates: any

    constructor() {
    }
}

describe('TreeNodeComponent', () => {
    let component: TreeNodeComponent
    let fixture: ComponentFixture<TreeNodeComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    BrowserTestingModule,
                ],
                declarations: [
                    TreeNodeComponent,
                    FakeTreeNodeWrapperComponent,
                    FakeTreeNodeChildrenComponent,
                ],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeComponent)
        component = fixture.componentInstance
        component.options = createTreeDataOptions()
        component.node = {} as any
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
