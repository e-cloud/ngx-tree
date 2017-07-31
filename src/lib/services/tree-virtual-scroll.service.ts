import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import { TreeModel } from '../models/tree-model'
import { TreeNode } from '../models/tree-node'

const Y_OFFSET_NODE_SIZE = 3
let id = 0

@Injectable()
export class TreeVirtualScroll {
    id: number
    averageNodeHeight = 0

    private currentViewport
    private lastScrollTop = 0
    private disabled = false

    private collectionMonitor$ = new BehaviorSubject(null)
    private nodeHeightAnalytics$ = new Subject()

    constructor() {
        this.id = id++
        this.collectAverageNodeHeight()
    }

    adjustViewport(viewport: ClientRect, scrollTop: number) {
        this.lastScrollTop = scrollTop
        this.currentViewport = viewport

        const Y_OFFSET = this.averageNodeHeight * Y_OFFSET_NODE_SIZE

        const startPos = scrollTop > Y_OFFSET ? scrollTop - Y_OFFSET : 0
        const endPos = viewport.height + scrollTop + Y_OFFSET

        this.collectionMonitor$.next({
            startPos,
            endPos,
        })
    }

    waitForCollection(observer): Subscription {
        return this.collectionMonitor$
            .filter(val => !!val)
            .subscribe(observer)
    }

    reportNodeHeight(data) {
        this.nodeHeightAnalytics$.next(data)
    }

    reCalcPositions(treeModel: TreeModel) {
        treeModel.virtualRoot.height = this.getPositionAfter(treeModel.getVisibleRoots(), 0)
    }

    setDisabled(isDisabled) {
        this.disabled = isDisabled
    }

    isDisabled() {
        return this.disabled
    }

    private getPositionAfter(nodes: TreeNode[], startPos: number) {
        let position = startPos

        nodes.forEach((node) => {
            node.position = position
            // as node is hidden, it should play as a shadow node for it next sibling node for
            // the proper position splitting
            position = this.getPositionAfterNode(node, node.position, node.isHidden)
        })

        return position
    }

    private getPositionAfterNode(node: TreeNode, startPos: number, isPrevShadow = false) {
        let position = isPrevShadow ? startPos : this.averageNodeHeight + startPos

        if (node.children && node.isExpanded) { // TBD: consider loading component as well
            position = this.getPositionAfter(node.visibleChildren, position)
        }

        // todo: here we assume the loading component's height is the same as averageNodeHeight
        node.height = position - startPos + (node.loadingChildren ? this.averageNodeHeight : 0)

        return position
    }

    private collectAverageNodeHeight() {
        this.nodeHeightAnalytics$
            .scan((acc, cur) => {
                const lastAvg = acc[0] / acc[1]
                const sum = cur + acc[0]
                const count = acc[1] + 1
                const avg = sum / count
                if (avg / lastAvg > 1.5 || lastAvg / avg > 1.5) {
                    return [cur, 1]
                }

                return [sum, count]
            }, [0, 0])
            .subscribe(pair => {
                this.averageNodeHeight = pair[0] / pair[1]
            })
    }
}
