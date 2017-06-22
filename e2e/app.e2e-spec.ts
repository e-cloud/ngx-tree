import { TestPage } from './app.po'

describe('ngx-tree Demo', () => {
    let page: TestPage

    beforeEach(() => {
        page = new TestPage()
    })

    it('should display welcome message', () => {
        page.navigateTo()
        page.getParagraphText().then((text) => {
            expect(text).toEqual('Welcome to demo!!')
        })
    })
})
