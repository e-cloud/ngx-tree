import { Component } from '@angular/core'
import { TreeNode } from 'ngx-tree/models/tree-node'
import { TreeOptions } from 'ngx-tree/models/tree-options.model'

@Component({
    selector: 'demo-root',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss'],
})
export class DemoComponent {
    title = 'demo'

    nodes: any[]

    asyncChildren = [
        {
            name: 'child2.1',
            subTitle: 'new and improved',
        },
        {
            name: 'child2.2',
            subTitle: 'new and improved2',
        },
    ]

    customTemplateStringOptions = new TreeOptions({
        // displayField: 'subTitle',
        isExpandedField: 'expanded',
        idField: 'uuid',
        getChildren: this.getChildren.bind(this),
    })

    constructor() {
        this.generateData()
    }

    generateData() {
        this.nodes = [
            {
                expanded: true,
                name: 'root expanded 1',
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
                expanded: true,
                name: 'root expanded 2',
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
                name: 'asyncroot',
                hasChildren: true,
            },
            {
                expanded: true,
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
                        expanded: true,
                        name: 'child2.2',
                        subTitle: 'new and improved2',
                        children: [
                            {
                                uuid: 1001,
                                name: 'subsub',
                                subTitle: 'subsub',
                                hasChildren: false,
                            },
                            {
                                expanded: true,
                                name: 'root 3',
                                subTitle: 'the second root',
                                children: [
                                    {
                                        name: 'child2.1',
                                        subTitle: 'new and improved',
                                        uuid: '11',
                                        hasChildren: false,
                                    },
                                    {
                                        expanded: true,
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
                            {
                                expanded: true,
                                name: 'root 4',
                                subTitle: 'the second root',
                                children: [
                                    {
                                        name: 'child2.1',
                                        subTitle: 'new and improved',
                                        uuid: '11',
                                        hasChildren: false,
                                    },
                                    {
                                        expanded: true,
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
                        ],
                    },
                ],
            },
        ]

        for (let i = 0; i < 20; i++) {
            this.nodes.push({
                expanded: i === 0,
                name: `root Dynamic${i}`,
                subTitle: `root created dynamically ${i}`,
                children: new Array((i + 1) * 500).fill(null).map((item, n) => ({
                    name: `child Dynamic${i}.${n}`,
                    subTitle: `child created dynamically ${i}`,
                    hasChildren: false,
                })),
            })
        }
    }

    getChildren(node: any) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.asyncChildren.map((c) => {
                return Object.assign({}, c, {
                    hasChildren: node.level < 5,
                })
            })), 1000)
        })
    }

    childrenCount(node: TreeNode): string {
        return node && node.children ? `(${node.children.length})` : ''
    }

    log($event) {
        // console.log($event)
    }
}
