import { inject, TestBed } from '@angular/core/testing'

import { TreeVirtualScroll, VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA } from './tree-virtual-scroll.service'

describe('TreeVirtualScrollService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TreeVirtualScroll,
                {
                    provide: VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA,
                    useValue: 5,
                },
            ],
        })
    })

    it('should be created', inject([TreeVirtualScroll], (service: TreeVirtualScroll) => {
        expect(service).toBeTruthy()
    }))
})
