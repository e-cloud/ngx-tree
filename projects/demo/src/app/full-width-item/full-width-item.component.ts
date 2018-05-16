import { Component } from '@angular/core'
import { TREE_ACTIONS, TreeDataOptions, TreeNode, TreeUIOptions } from '@e-cloud/ngx-tree'

@Component({
    selector: 'demo-full-width-item',
    templateUrl: './full-width-item.component.html',
    styleUrls: ['./full-width-item.component.scss'],
})
export class FullWidthItemComponent {
    nodes: any[]

    customOptions: TreeUIOptions & TreeDataOptions = {
        // displayField: 'subTitle',
        isExpandedField: 'expanded',
        idField: 'uuid',
        useVirtualScroll: true,
        allowDrag: false,
        allowDrop: false,
        actionMapping: {
            mouse: {
                dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
            },
        },
        levelPadding(node: TreeNode) {
            return (20 + 15 * (node.level - 1)) + 'px'
        },
    }

    constructor() {
        this.generateData()
    }

    generateData() {
        this.nodes = [
            {
                expanded: true,
                name: 'root expanded',
                subTitle: 'the root',
                children: [
                    {
                        name: 'child1',
                        subTitle: 'a good child',
                        hasChildren: false,
                    },
                    {
                        name: 'child2',
                        subTitle: 'a bad child',
                        hasChildren: false,
                    },
                ],
            },
            {
                name: 'root2',
                subTitle: 'the second root',
                children: [
                    {
                        name: 'child2.1',
                        subTitle: 'new and improved',
                        uuid: '11',
                        hasChildren: false,
                    },
                    {
                        name: 'child2.2',
                        subTitle: 'new and improved2',
                        children: [
                            {
                                uuid: 1001,
                                name: 'subsub',
                                subTitle: 'subsub',
                                hasChildren: false,
                            },
                        ],
                    },
                ],
            },
        ]

        for (let i = 0; i < 20; i++) {
            this.nodes.push({
                name: `rootDynamic${i}`,
                subTitle: `root created dynamically ${i}`,
                children: new Array((i + 1) * 500).fill(null).map((item, n) => ({
                    name: `childDynamic${i}.${n}`,
                    subTitle: `child created dynamically ${i}`,
                    hasChildren: false,
                })),
            })
        }
    }

}
