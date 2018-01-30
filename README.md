# ngx-tree

## Claims

This module derivates from [angular-tree-component](https://github.com/500tech/angular-tree-component/). We remove the mobx dependency and do some performance improvements, whilst keep a similar component interface.

## Installation

To install this library, run:

```bash
$ npm install @e-cloud/ngx-tree --save
```

## Usage

For details, please take a look at [document site](https://e-cloud.github.io/ngx-tree)

### Imports
Once you have installed the library, you can import it in your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { NgxTreeModule } from '@e-cloud/ngx-tree';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    NgxTreeModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Applications

#### demo usage

```html
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<ngx-tree
  [nodes]="nodes"
  [dataOptions]="customOptions">
  <ng-template #treeNodeTemplate let-node="node">
    <span title="{{node.data.subTitle}}">{{ node.data.name }}</span>
  </ng-template>
</ngx-tree>
```

> **NOTE**: the minimum input for `ngx-tree` component is `nodes`.

#### Root config

There is a `forRoot()` method on `NgxTreeModule`, which should be used only on root module of apps.

`forRoot` injects two providers, `TreeDraggingTargetService` and `VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA`. The first holds the dragging element. The other specify the round size to calculate the average tree item height.

#### Tree options

We split the tree options into two category, `TreeDataOptions` and `TreeUIOptions`. `dataOptions` inputted by user will be passed into `TreeModel` which handle the tree data operations. `uiOption` will be passed into every child components required and declared tree templates(will introduce late).

#### Tree templates

We predefine five tree templates for flexible customization.

* `loadingTemplate` - loading indicator for async nodes
* `expanderTemplate` - for tree expander customization,
* `treeNodeTemplate` - for customization of tree node contents(not including node children components and node expander, only for every single node's content)
* `treeNodeWrapperTemplate` - `treeNodeTemplate` + full customization over expander
* `treeNodeFullTemplate` - `treeNodeWrapperTemplate` + full customization over how the node children display.


## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [e-cloud](mailto:saintscott119@gmail.com)
