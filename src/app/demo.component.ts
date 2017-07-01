import { Component } from '@angular/core'
import { TreeOptions } from '../lib/models/tree-options.model'

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
            {
                name: 'asyncroot',
                hasChildren: true,
            },
        ]

        for (let i = 0; i < 4; i++) {
            this.nodes.push({
                name: `root Dynamic${i}`,
                subTitle: `root created dynamically ${i}`,
                children: new Array((i + 1) * 100).fill(null).map((item, n) => ({
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
}
