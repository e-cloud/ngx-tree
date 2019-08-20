import { TemplateRef } from '@angular/core'

export * from './tree-options'
export * from './tree-model'
export * from './tree-node'
export * from './events'
export * from './actions'

export interface TreeTemplateMapping {
    expanderTemplate: TemplateRef<any>
    loadingTemplate: TemplateRef<any>
    treeNodeTemplate: TemplateRef<any>
    treeNodeWrapperTemplate: TemplateRef<any>
    treeNodeFullTemplate: TemplateRef<any>
}
