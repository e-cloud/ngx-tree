import { inject, TestBed } from '@angular/core/testing'

import { TreeDraggingTarget } from './tree-dragging-target.service'

describe('TreeDraggingTargetService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeDraggingTarget],
        })
    })

    it('should be created', inject([TreeDraggingTarget], (service: TreeDraggingTarget) => {
        expect(service).toBeTruthy()
    }))
})
