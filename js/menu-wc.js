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
                    <a href="index.html" data-type="index-link">
                        <img alt="" class="img-responsive" data-type="custom-logo" data-src="images/logo-blue.png">
                    </a>
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
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
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
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-572231f92f3b66fc4e1381d306b05c070c431b582cd2b0eed09c66e49947acd0eb7e4b5b248013d48af644027b13d5e62888ed675e9e38b3237e59402ea68cc1"' : 'data-target="#xs-components-links-module-AppModule-572231f92f3b66fc4e1381d306b05c070c431b582cd2b0eed09c66e49947acd0eb7e4b5b248013d48af644027b13d5e62888ed675e9e38b3237e59402ea68cc1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-572231f92f3b66fc4e1381d306b05c070c431b582cd2b0eed09c66e49947acd0eb7e4b5b248013d48af644027b13d5e62888ed675e9e38b3237e59402ea68cc1"' :
                                            'id="xs-components-links-module-AppModule-572231f92f3b66fc4e1381d306b05c070c431b582cd2b0eed09c66e49947acd0eb7e4b5b248013d48af644027b13d5e62888ed675e9e38b3237e59402ea68cc1"' }>
                                            <li class="link">
                                                <a href="components/AboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllStationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllStationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalamityItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalamityItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DisruptionItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisruptionItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RideInformationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RideInformationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StationPopupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StationPopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToastsContainerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToastsContainerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainMapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainMapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainMapSidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainMapSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainPopupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainPopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainsetInformationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainsetInformationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-572231f92f3b66fc4e1381d306b05c070c431b582cd2b0eed09c66e49947acd0eb7e4b5b248013d48af644027b13d5e62888ed675e9e38b3237e59402ea68cc1"' : 'data-target="#xs-directives-links-module-AppModule-572231f92f3b66fc4e1381d306b05c070c431b582cd2b0eed09c66e49947acd0eb7e4b5b248013d48af644027b13d5e62888ed675e9e38b3237e59402ea68cc1"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-572231f92f3b66fc4e1381d306b05c070c431b582cd2b0eed09c66e49947acd0eb7e4b5b248013d48af644027b13d5e62888ed675e9e38b3237e59402ea68cc1"' :
                                        'id="xs-directives-links-module-AppModule-572231f92f3b66fc4e1381d306b05c070c431b582cd2b0eed09c66e49947acd0eb7e4b5b248013d48af644027b13d5e62888ed675e9e38b3237e59402ea68cc1"' }>
                                        <li class="link">
                                            <a href="directives/NgInitDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgInitDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/NgbdSortableHeaderDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgbdSortableHeaderDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TrainMapModuleModule.html" data-type="entity-link" >TrainMapModuleModule</a>
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
                                <a href="classes/LocalStorageSaveOptions.html" data-type="entity-link" >LocalStorageSaveOptions</a>
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
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CacheService.html" data-type="entity-link" >CacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GlobalSearchService.html" data-type="entity-link" >GlobalSearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HelperFunctionsService.html" data-type="entity-link" >HelperFunctionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpClientService.html" data-type="entity-link" >HttpClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageEditorService.html" data-type="entity-link" >ImageEditorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MetaTagService.html" data-type="entity-link" >MetaTagService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RideInformationService.html" data-type="entity-link" >RideInformationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SharedDataService.html" data-type="entity-link" >SharedDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ShareService.html" data-type="entity-link" >ShareService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StationsService.html" data-type="entity-link" >StationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToastService.html" data-type="entity-link" >ToastService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TrainSpotterRouteReuseStrategy.html" data-type="entity-link" >TrainSpotterRouteReuseStrategy</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RideInformationResolver.html" data-type="entity-link" >RideInformationResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/TrainsetInformationResolver.html" data-type="entity-link" >TrainsetInformationResolver</a>
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
                                <a href="interfaces/CacheRecord.html" data-type="entity-link" >CacheRecord</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GlobalSearchResult.html" data-type="entity-link" >GlobalSearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpOptions.html" data-type="entity-link" >HttpOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICachedRoute.html" data-type="entity-link" >ICachedRoute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRouteConfigData.html" data-type="entity-link" >IRouteConfigData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Response.html" data-type="entity-link" >Response</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchResult.html" data-type="entity-link" >SearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SortEvent.html" data-type="entity-link" >SortEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/State.html" data-type="entity-link" >State</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Toast.html" data-type="entity-link" >Toast</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrainMapModuleModuleConfig.html" data-type="entity-link" >TrainMapModuleModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrainMapType.html" data-type="entity-link" >TrainMapType</a>
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
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});