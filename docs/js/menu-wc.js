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
                    <a href="index.html" data-type="index-link">train-spotter documentation</a>
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
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
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
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-5cc85c39673ff564c84b518ba6475287"' : 'data-target="#xs-components-links-module-AppModule-5cc85c39673ff564c84b518ba6475287"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-5cc85c39673ff564c84b518ba6475287"' :
                                            'id="xs-components-links-module-AppModule-5cc85c39673ff564c84b518ba6475287"' }>
                                            <li class="link">
                                                <a href="components/AllStationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AllStationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalamityItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CalamityItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DisruptionItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisruptionItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainLayoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MainLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StationPopupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StationPopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainMapComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrainMapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainMapSidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrainMapSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainPopupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrainPopupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-5cc85c39673ff564c84b518ba6475287"' : 'data-target="#xs-directives-links-module-AppModule-5cc85c39673ff564c84b518ba6475287"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-5cc85c39673ff564c84b518ba6475287"' :
                                        'id="xs-directives-links-module-AppModule-5cc85c39673ff564c84b518ba6475287"' }>
                                        <li class="link">
                                            <a href="directives/NgbdSortableHeaderDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgbdSortableHeaderDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
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
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpOptions.html" data-type="entity-link">HttpOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalStorageSaveOptions.html" data-type="entity-link">LocalStorageSaveOptions</a>
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
                                    <a href="injectables/ApiService.html" data-type="entity-link">ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CacheRouteReuseStrategy.html" data-type="entity-link">CacheRouteReuseStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CacheService.html" data-type="entity-link">CacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GlobalSearchService.html" data-type="entity-link">GlobalSearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HelperFunctionsService.html" data-type="entity-link">HelperFunctionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpClientService.html" data-type="entity-link">HttpClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SharedDataService.html" data-type="entity-link">SharedDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StationsService.html" data-type="entity-link">StationsService</a>
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
                                <a href="interfaces/CacheRecord.html" data-type="entity-link">CacheRecord</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/definitions.html" data-type="entity-link">definitions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/definitions-1.html" data-type="entity-link">definitions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/definitions-2.html" data-type="entity-link">definitions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GlobalSearchResult.html" data-type="entity-link">GlobalSearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/operations.html" data-type="entity-link">operations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/operations-1.html" data-type="entity-link">operations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/operations-2.html" data-type="entity-link">operations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/paths.html" data-type="entity-link">paths</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/paths-1.html" data-type="entity-link">paths</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/paths-2.html" data-type="entity-link">paths</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchResult.html" data-type="entity-link">SearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SortEvent.html" data-type="entity-link">SortEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/State.html" data-type="entity-link">State</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrainMapType.html" data-type="entity-link">TrainMapType</a>
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
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
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
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});