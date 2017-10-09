# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.5.3"></a>
## [0.5.3](https://github.com/e-cloud/ngx-tree/compare/v0.5.2...v0.5.3) (2017-10-09)


### Bug Fixes

* **subscription:** assign empty subscription to related variables ([78afac1](https://github.com/e-cloud/ngx-tree/commit/78afac1))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/e-cloud/ngx-tree/compare/v0.5.1...v0.5.2) (2017-10-09)


### Bug Fixes

* **filter:** correct the broken filter functionality ([63674e2](https://github.com/e-cloud/ngx-tree/commit/63674e2))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/e-cloud/ngx-tree/compare/v0.5.0...v0.5.1) (2017-09-25)


### Bug Fixes

* **tree-node:** only display children when node has children ([3e3fd7b](https://github.com/e-cloud/ngx-tree/commit/3e3fd7b))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/e-cloud/ngx-tree/compare/v0.4.0...v0.5.0) (2017-09-20)


### Bug Fixes

* **refresh:** ensure proper view update after nodes updated ([dc6758b](https://github.com/e-cloud/ngx-tree/commit/dc6758b))
* **viewport:** fire `initialized` event when virtualScroll disabled ([da5d86a](https://github.com/e-cloud/ngx-tree/commit/da5d86a))


### Features

* **keepNodesExpanded:** support keep nodes expanded when data change ([103b9b8](https://github.com/e-cloud/ngx-tree/commit/103b9b8))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/e-cloud/ngx-tree/compare/v0.3.4...v0.4.0) (2017-09-18)


### Bug Fixes

* **expander:** center the expander, optimize template and style ([5e3be34](https://github.com/e-cloud/ngx-tree/commit/5e3be34))
* **options:** ensure tree component has default data options ([aa32c1b](https://github.com/e-cloud/ngx-tree/commit/aa32c1b))


### Features

* **activateTarget:** support specifying the activated node ([02fa222](https://github.com/e-cloud/ngx-tree/commit/02fa222))
* **expander-template:** support custom template for tree expander ([9158c38](https://github.com/e-cloud/ngx-tree/commit/9158c38))
* **template-context:** deprecate $implicit context for template context ([5ef5498](https://github.com/e-cloud/ngx-tree/commit/5ef5498))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/e-cloud/ngx-tree/compare/v0.3.3...v0.3.4) (2017-09-15)


### Bug Fixes

* **ngOutlet:** add missing field for ngOutletContext ([7023a8e](https://github.com/e-cloud/ngx-tree/commit/7023a8e))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/e-cloud/ngx-tree/compare/v0.3.2...v0.3.3) (2017-09-15)


### Bug Fixes

* **tree:** correct the TreeDraggingTargetService module path ([c9ddfef](https://github.com/e-cloud/ngx-tree/commit/c9ddfef))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/e-cloud/ngx-tree/compare/v0.3.1...v0.3.2) (2017-09-15)


### Bug Fixes

* **tree:** use correct modifier for template ([a16b4cb](https://github.com/e-cloud/ngx-tree/commit/a16b4cb))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/e-cloud/ngx-tree/compare/v0.3.0...v0.3.1) (2017-09-15)


### Reverts

* **tree:** restore the treeDraggingTargetService injection ([b2868bf](https://github.com/e-cloud/ngx-tree/commit/b2868bf))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/e-cloud/ngx-tree/compare/v0.2.2...v0.3.0) (2017-09-15)


### Bug Fixes

* **exports:** use direct import for correct aot ([06bd7a9](https://github.com/e-cloud/ngx-tree/commit/06bd7a9))


### Features

* **tree-node:** support tree-node-full-template ([4debcf5](https://github.com/e-cloud/ngx-tree/commit/4debcf5))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/e-cloud/ngx-tree/compare/v0.2.1...v0.2.2) (2017-09-14)


### Bug Fixes

* **BrowserModule:** remove BrowserAnimationsModule as not for library ([64027fb](https://github.com/e-cloud/ngx-tree/commit/64027fb))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/e-cloud/ngx-tree/compare/v0.2.0...v0.2.1) (2017-09-14)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/e-cloud/ngx-tree/compare/v0.1.0...v0.2.0) (2017-09-14)


### Features

* **exports:** export most module for external reference ([677284d](https://github.com/e-cloud/ngx-tree/commit/677284d))


### Performance Improvements

* **tree-node:** avoid usage of function bind ([abe0775](https://github.com/e-cloud/ngx-tree/commit/abe0775))



<a name="0.1.0"></a>
# 0.1.0 (2017-09-07)


### Bug Fixes

* add missing file ([686acaf](https://github.com/e-cloud/ngx-tree/commit/686acaf))
* missing type for ngc ([21a101e](https://github.com/e-cloud/ngx-tree/commit/21a101e))
* **expander:** stop expand event propagation as default ([2b3f565](https://github.com/e-cloud/ngx-tree/commit/2b3f565))
* **memory-leak:** ensure removed node has no ref to elementRef ([aef71bf](https://github.com/e-cloud/ngx-tree/commit/aef71bf))
* **options:** avoid reference error ([86f2219](https://github.com/e-cloud/ngx-tree/commit/86f2219))
* **style:** prevent wraping the node content ([302b6fc](https://github.com/e-cloud/ngx-tree/commit/302b6fc))


### Features

* **animation:** support animation and option to switch it on or off ([6ed7b97](https://github.com/e-cloud/ngx-tree/commit/6ed7b97))
* **core:** set up code base ([8e79fa0](https://github.com/e-cloud/ngx-tree/commit/8e79fa0))
* **drag:** add dragging target service ([b82fc9e](https://github.com/e-cloud/ngx-tree/commit/b82fc9e))
* **drag&drop:** improve UX and performance ([420967a](https://github.com/e-cloud/ngx-tree/commit/420967a))
* **drag&drop:** support drag and drop feature ([21a2e3c](https://github.com/e-cloud/ngx-tree/commit/21a2e3c))
* **focusNode:** support focusing a node from input with node id ([a1f5cfb](https://github.com/e-cloud/ngx-tree/commit/a1f5cfb))
* **levelPadding:** allow function as levelPadding for flexible style ([acb8d68](https://github.com/e-cloud/ngx-tree/commit/acb8d68))
* **model:** emit sub-events before toggleExpander & loadingChildren ([2e85611](https://github.com/e-cloud/ngx-tree/commit/2e85611))
* **model:** refine the model layer ([2c2a966](https://github.com/e-cloud/ngx-tree/commit/2c2a966))
* **model:** refine the model layer ([2b51365](https://github.com/e-cloud/ngx-tree/commit/2b51365))
* **model:** replace the object cache to map cache ([dc20dfa](https://github.com/e-cloud/ngx-tree/commit/dc20dfa))
* **module:** add moduleId for system.js ([9a54282](https://github.com/e-cloud/ngx-tree/commit/9a54282))
* **scroll:** support scrollIntoView either in virutal scroll or not ([e2cc6d0](https://github.com/e-cloud/ngx-tree/commit/e2cc6d0))
* **tree-node:** redesign the drag&drop target and style ([6efc4e4](https://github.com/e-cloud/ngx-tree/commit/6efc4e4))
* **tree-options:** redesign options processing ([13067d3](https://github.com/e-cloud/ngx-tree/commit/13067d3))
* **virtual-scroll:** leggy implementation of virtual-scroll feature ([33ca365](https://github.com/e-cloud/ngx-tree/commit/33ca365))
* **virtual-scroll:** support disabling virtual scroll ([6324459](https://github.com/e-cloud/ngx-tree/commit/6324459))
* **vitual-scroll:** simulate the scrollHeight with another way ([4c9d403](https://github.com/e-cloud/ngx-tree/commit/4c9d403))


### Performance Improvements

* move changeable internal host bindings to parent template ([785af75](https://github.com/e-cloud/ngx-tree/commit/785af75))
* **virtual-scroll:** use a limit to end average node height collection ([3bf532b](https://github.com/e-cloud/ngx-tree/commit/3bf532b))
