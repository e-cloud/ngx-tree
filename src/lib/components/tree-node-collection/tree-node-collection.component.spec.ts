import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TreeNodeCollectionComponent } from './tree-node-collection.component'

describe('TreeNodeCollectionComponent', () => {
    let component: TreeNodeCollectionComponent
    let fixture: ComponentFixture<TreeNodeCollectionComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [TreeNodeCollectionComponent],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeCollectionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
