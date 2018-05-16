import { createTreeUIOptions, defaultUIOptions } from './tree-options'

describe('TreeDraggingTargetService', () => {
    let defaultRawOption
    beforeEach(() => {
        defaultRawOption = {}
    })

    it('should create a default tree UI options object with empty input', () => {
        const options = createTreeUIOptions()

        expect(options).toEqual(defaultUIOptions)
    })
})
