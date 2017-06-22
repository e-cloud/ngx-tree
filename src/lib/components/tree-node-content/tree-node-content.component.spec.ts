import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TreeNodeContentComponent } from './tree-node-content.component'

describe('TreeNodeContentComponent', () => {
    let component: TreeNodeContentComponent
    let fixture: ComponentFixture<TreeNodeContentComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [TreeNodeContentComponent],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeContentComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
