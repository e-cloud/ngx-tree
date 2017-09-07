import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { createTreeUIOptions, TreeNode, TreeUIOptions } from '../../models'
import { TreeVirtualScroll, VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA } from '../../services/tree-virtual-scroll.service'
import { TreeNodeChildrenComponent } from './tree-node-children.component'

@Component({
    selector: 'ngx-tree-node',
    template: '',
})
export class FakeTreeNodeComponent {
    @Input() node: TreeNode
    @Input() options: TreeUIOptions
    @Input() index: number
    @Input() templates: any
}

@Component({
    selector: 'ngx-tree-loading',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FakeTreeLoadingComponent {
    @Input() template: TemplateRef<any>
    @Input() node: TreeNode
}

describe('TreeNodeChildrenComponent', () => {
    let component: TreeNodeChildrenComponent
    let fixture: ComponentFixture<TreeNodeChildrenComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    NoopAnimationsModule,
                ],
                declarations: [
                    TreeNodeChildrenComponent,
                    FakeTreeNodeComponent,
                    FakeTreeLoadingComponent,
                ],
                providers: [
                    TreeVirtualScroll,
                    {
                        provide: VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA,
                        useValue: 5,
                    },
                ]
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeChildrenComponent)
        component = fixture.componentInstance
        component.options = createTreeUIOptions()
        component.node = {} as any
        component.templates = {}
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
