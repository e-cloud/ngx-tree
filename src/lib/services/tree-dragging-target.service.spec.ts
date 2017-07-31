import { inject, TestBed } from '@angular/core/testing'

import { TreeDraggingTargetService } from './tree-dragging-target.service'

describe('TreeDraggingTargetService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeDraggingTargetService],
        })
    })

    it('should be created', inject([TreeDraggingTargetService], (service: TreeDraggingTargetService) => {
        expect(service).toBeTruthy()
    }))
})
