'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-tree</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/NgxTreeModule.html" data-type="entity-link">NgxTreeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NgxTreeModule-7eb1353f93ecd90c151cf643406d0bb7"' : 'data-target="#xs-components-links-module-NgxTreeModule-7eb1353f93ecd90c151cf643406d0bb7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NgxTreeModule-7eb1353f93ecd90c151cf643406d0bb7"' :
                                            'id="xs-components-links-module-NgxTreeModule-7eb1353f93ecd90c151cf643406d0bb7"' }>
                                            <li class="link">
                                                <a href="components/TreeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeLoadingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeLoadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeNodeChildrenComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeNodeChildrenComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeNodeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeNodeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeNodeContentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeNodeContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeNodeDropSlotComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeNodeDropSlotComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeNodeExpanderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeNodeExpanderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeNodeWrapperComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeNodeWrapperComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeViewportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeViewportComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-NgxTreeModule-7eb1353f93ecd90c151cf643406d0bb7"' : 'data-target="#xs-directives-links-module-NgxTreeModule-7eb1353f93ecd90c151cf643406d0bb7"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NgxTreeModule-7eb1353f93ecd90c151cf643406d0bb7"' :
                                        'id="xs-directives-links-module-NgxTreeModule-7eb1353f93ecd90c151cf643406d0bb7"' }>
                                        <li class="link">
                                            <a href="directives/TreeDragDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeDragDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/TreeDropDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeDropDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/TreeModel.html" data-type="entity-link">TreeModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/TreeNode.html" data-type="entity-link">TreeNode</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/TreeDraggingTargetService.html" data-type="entity-link">TreeDraggingTargetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TreeVirtualScroll.html" data-type="entity-link">TreeVirtualScroll</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ActionHandler.html" data-type="entity-link">ActionHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ActionMapping.html" data-type="entity-link">ActionMapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DragAndDropEvent.html" data-type="entity-link">DragAndDropEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DropTarget.html" data-type="entity-link">DropTarget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventsMap.html" data-type="entity-link">EventsMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PosPair.html" data-type="entity-link">PosPair</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RawTreeUIOptions.html" data-type="entity-link">RawTreeUIOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScrollIntoViewTarget.html" data-type="entity-link">ScrollIntoViewTarget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TreeDataOptions.html" data-type="entity-link">TreeDataOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TreeEvent.html" data-type="entity-link">TreeEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TreeTemplateMapping.html" data-type="entity-link">TreeTemplateMapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TreeUIOptions.html" data-type="entity-link">TreeUIOptions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});