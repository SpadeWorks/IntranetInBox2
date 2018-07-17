"use strict";
/*
File Name       :   sn-analytics.js
Author          :   Cognizant Technology Solutions
Description     :   This application component contains functionality for google analytics framework infrastructure.
*/

SN.Comps.Analytics = (function() {
    var appConfig;

    /**
     * Initializes GTM logging.
     */
    function initialize() {
        var pageType = SN.Utils.GetUrlComponents().pageType;
        appConfig = SN.Global.AppConfig;
        switch (pageType) {
            case SN.Enums.PageType.HomePage:
                bindHomePageEvents();
                break;
            case SN.Enums.PageType.Results:
                bindResultsPageEvents();
                break;
            case SN.Enums.PageType.PeopleResults:
                bindPeopleResultsPageEvents();
                break;
            case SN.Enums.PageType.Advanced:
                bindAdvancedPageEvents();
                break;
            case SN.Enums.PageType.CampusMap:
                bindCampusMapPageEvents();
                break;
            case SN.Enums.PageType.HolidayCalender:
                bindHolidayCalenderPageEvents();
                break;
            case SN.Enums.PageType.NKCNew:
                bindNKCPageEvents();
                break;
            case SN.Enums.PageType.SiteSearch:
                bindSiteSearchPageEvents();
                break;
            case SN.Enums.PageType.YammerRedirect:
                bindYammerPageEvents();
                break;
            case SN.Enums.PageType.PortalResults:
                bindPortalResultsPageEvents();
                break;
        }
    }

    String.prototype.repeat = function(n) {
        n = n || 1;
        return Array(n + 1).join(this);
    };

    /**
     * Binds events on home page.
     */
    function bindHomePageEvents() {
        logUserInfo();
        logReferrerInfo();
        bindSearchEvents();
    }

    /**
     * Binds Results page evetns.
     */
    function bindResultsPageEvents() {
        logUserInfo();
        logReferrerInfo();
        bindBestBetEvents();
        bindSearchEvents();
        bindQuickSearchAndNavigationEvents();
        bindResultEvents();
        bindCustomPeopleResultEvents();
        bindRefinerEvents();
        bindRecentSearchEvents();
    }

    /**
     * Binds People Results page events.
     */
    function bindPeopleResultsPageEvents() {
        logUserInfo();
        logReferrerInfo();
        bindSearchEvents();
        bindQuickSearchAndNavigationEvents();
        bindPeopleResultEvents();
        bindRefinerEvents();
        bindRecentSearchEvents();
    }

    /**
     * Binds Advanced page events.
     */
    function bindAdvancedPageEvents() {
        var searchTrigger = SN.Constants.SEARCH_TRIGGER_CLICK,
            keyword;

        logUserInfo();
        logReferrerInfo();
        $(document).on('keypress', 'input.ms-advsrchText-v2box', function(event) {
            if (event.which === 13) {
                searchTrigger = SN.Constants.SEARCH_TRIGGER_KEYPRESS;
            }
        });

        window.DoAdvancedSearch = function DoAdvancedSearch(queryParameterName, resultsPage,
            idOuterTable, idAndQueryTextBox, idPhraseQueryTextBox,
            idOrQueryTextBox, idNotQueryTextBox, idPrefixScopeCheckBox,
            idPrefixLangsCheckBox, idResultTypeList,
            idPrefixPropNameSelect, idPrefixPropOperatorSelect,
            idPrefixPropValueTextBox, idPrefixPropAndOrSelect) {

            if (ValidateForm()) {
                var elements = findElements(idOuterTable, idAndQueryTextBox,
                    idPhraseQueryTextBox, idOrQueryTextBox,
                    idNotQueryTextBox, idPrefixScopeCheckBox,
                    idPrefixLangsCheckBox, idResultTypeList,
                    idPrefixPropNameSelect, idPrefixPropOperatorSelect,
                    idPrefixPropValueTextBox, idPrefixPropAndOrSelect);

                var query = ComposeQuery(elements);
                keyword = query ? decodeURIComponent(query) : '';
                if (query !== '') {
                    var url = resultsPage + '?' + queryParameterName + '=' + query;
                    setSearchInfo(null, searchTrigger,
                        keyword, SN.Constants.SEARCH_CATEGORY_GLOBAL,
                        SN.Constants.SEARCH_BOX_ADVANCED);

                    STSNavigate(url);
                } else {
                    alert(emptyQueryMessage);
                }
            }
        };
    }

    /**
     * Binds campus map page events.
     */
    function bindCampusMapPageEvents() {
        if (SN.Utils.GetUrlParameters(window.location.href, SN.Constants.URL_PARAM_MAPLOCATION)) {
            logUserInfo();
            logReferrerInfo();
            bindMapCalenderResultEvents(SN.Constants.SEARCH_CATEGORY_CAMPUS_MAPS);
            bindQuickSearchAndNavigationEvents();
        }
    }

    /**
     * Binds Holiday Calender page events. 
     */
    function bindHolidayCalenderPageEvents() {
        if (SN.Utils.GetUrlParameters(window.location.href, SN.Constants.URL_PARAM_MAPLOCATION)) {
            logUserInfo();
            logReferrerInfo();
            bindMapCalenderResultEvents(SN.Constants.SEARCH_CATEGORY_HOLIDAY_CALENDARS);
            bindQuickSearchAndNavigationEvents();
        }
    }

    /**
     * Binds Search page events.
     */
    function bindSiteSearchPageEvents() {
        logUserInfo();
        logReferrerInfo();
        bindSearchEvents();
        bindQuickSearchAndNavigationEvents();
        bindResultEvents();
        bindRecentSearchEvents();
    }

    /**
     * Binds NKC page events.
     */
    function bindNKCPageEvents() {
        logUserInfo();
        logReferrerInfo();
        bindSearchEvents();
        bindQuickSearchAndNavigationEvents();
        bindResultEvents();
        bindRefinerEvents();
        bindRecentSearchEvents();
    }

    /**
     * Binds yammer page events.
     */
    function bindYammerPageEvents() {
        //TODO Implement gtm for yammer pages.
    }

    /**
     * Binds Porta Results page events.
     */
    function bindPortalResultsPageEvents() {
        logUserInfo();
        logReferrerInfo();
        bindSearchEvents();
        bindCustomPeopleResultEvents();
        bindQuickSearchAndNavigationEvents();
        bindResultEvents();
        bindCustomPeopleResultEvents();
        bindRefinerEvents();
        bindRecentSearchEvents();
    }

    /**
     * Binds refiner events.
     */
    function bindRefinerEvents() {
        $(document).on('click', '.div-refiner-item', function() {
            logRefinerInfo(SN.Constants.REFINEMENT_TYPE_FACET_SEARCH);
        });

		$(document).on('change', '.slideronly_container input', function(event) {
			logRefinerInfo(SN.Constants.REFINEMENT_TYPE_FACET_SEARCH); 	
		});
    }

    /**
     * Binds Recent Search refiner events. 
     */
    function bindRecentSearchEvents() {
        $(document).on('click', '#MyRecentSearch a', function() {
            logRefinerInfo(SN.Constants.REFINEMENT_TYPE_RECENT_KEYWORD_SEARCH);
        });
    }

    /**
     * Binds result events. 
     */
    function bindResultEvents() {
        //Optimize methods. to use required object types and reduce use of jQuery selectors.
        var selectorDivResultItem = '.gtm-result-item',
            selectorDivResultItemContainer = '.gtm-result-item-container';

        $(selectorDivResultItemContainer).livequery(function() {
            $(this).hoverIntent(function() {
                var resultPreviewInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.ResultPreview);
                resultPreviewInfo.ossItem = $(this).find(selectorDivResultItem).data();
                logToGTM(resultPreviewInfo);
            }, function() {
                return;
            });
        });

        $(document).on('click', '.gtm-result-item-container a', function() {
            var resultClickInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.ResultClick);
            resultClickInfo.ossItem = $(this).closest(selectorDivResultItemContainer).find(selectorDivResultItem).data();
            logToGTM(resultClickInfo);
        });
        
    }

    /**
     * Binds events related to people results.
     */
    function bindPeopleResultEvents() {
        $(document).on('click', '.gtm-people-item-container a', function() {
            var resultClickInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.ResultClick);
            resultClickInfo.ossItem = $(this).closest('.gtm-people-item-container').find('.gtm-result-item').data();
            logToGTM(resultClickInfo);
        });
    }

    /**
     * Binds custom people results events.
     * @return {[type]} [description]
     */
    function bindCustomPeopleResultEvents() {
        SN.Global.PeopleResultsPromise = $.Deferred();
        $(document).on('click', '#divUserProfiles #NameField a', function() {
            var resultClickInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.ResultClick);
            resultClickInfo.ossItem = $(this).closest('.gtm-people-link-container').find('.gtm-result-people').data();
            logToGTM(resultClickInfo);
        });
    }

    /**
     * Bind search events.
     */
    function bindSearchEvents() {
        var searchTerm;

        SP.Utilities.HttpUtility.navigateTo = function(urlString) {
            searchTerm = decodeURIComponent(SN.Utils.GetUrlParameters(urlString, "k"));
            if (SN.Global.suggestedKeyword === searchTerm) {
                setSearchInfo(null, SN.Constants.SEARCH_TRIGGER_SUGGESTIONS);
            }

            STSNavigate(urlString);
        };

        $(document).on('mouseenter', '.ms-qSuggest-listItem, .ms-qSuggest-hListItem', function() {
            SN.Global.suggestedKeyword = $(".ms-qSuggest-hListItem").text();
        });

        $(document).on('change paste keyup', '[id$="_csr_sbox"]', function() {
            SN.Global.suggestedKeyword = $('.ms-qSuggest-hListItem').text();
        });
    }

    /**
     * Binds Quick Search and navigation events.
     * @return {[type]} [description]
     */
    function bindQuickSearchAndNavigationEvents() {
        $(document).on('click', '.quicklinks-icons a, .ms-srchnav a, .ms-srchnav-menu-title', function() {
            setSearchInfo($(this), SN.Constants.SEARCH_TRIGGER_CLICK);
        });
    }

    /**
     * Binds Map results events.
     * @return {[type]} [description]
     */
    function bindMapCalenderResultEvents(category) {
        var keyword;
        $(document).on('change', 'select#drpLocation', function() {
            keyword = $('#drpLocation option:selected').text();
            setSearchInfo(null, SN.Constants.SEARCH_TRIGGER_CLICK, keyword,
                category);
        });

        $(document).on('click', '.gtm-result-map-container a.ms-srch-item-link', function() {
            var resultClickInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.ResultClick);
            resultClickInfo.ossItem = $(this).closest('.gtm-result-map-container').find('.gtm-result-item').data();
            logToGTM(resultClickInfo);
        });
    }

    function bindBestBetEvents() {
        SN.Global.BestBetResultsPromise = $.Deferred();
        $(document).on('click', '#divPromotedUser a.ms-srch-item-link', function() {
            var resultClickInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.ResultClick);
            resultClickInfo.ossItem = $(this).closest('#divPromotedUser').find('.gtm-result-best-bet').data();
            logToGTM(resultClickInfo);
        });
    }

    /**
     * Logs search info.
     * @param {object} searchElement - jquery slector.
     * @param {string} trigger - trigger type.
     */
    function setSearchInfo(searchElement, trigger, keyword, category, paramSearchBoxType) {
        var searchInfo,
            searchText,
            searchBoxType = paramSearchBoxType || getSearchBoxType(window.location.href),
            searchBox = $('[id$="_csr_sbox"]');

        searchText = keyword || getSearchBoxValue(searchBox.attr('id'));
        if (searchElement || searchText !== SN.Constants.SEARCH_BOX_DEFAULT_VALUE) {
            searchInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.SearchInfo);
            searchInfo.ossBox = searchBoxType;
            searchInfo.ossCategory = category || getSearchCategory(searchElement);
            searchInfo.ossTrigger = trigger;
            searchInfo.ossKeyword = searchText.trim();
            searchInfo.ossFeatures = (searchBoxType === SN.Constants.SEARCH_BOX_ADVANCED) ?
                '' : getFeatures(searchInfo.ossKeyword);

            logToGTM(searchInfo);
        }
    }

    /**
     * Log Refiner Information.
     * @param  {string} refinementType - Refiner Type.
     */
    function logRefinerInfo(refinementType) {
        var refinerInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.Refinements);
        refinerInfo.refinementType = refinementType || '';
        logToGTM(refinerInfo);
    }

    /**
     * Log search results.
     * @param  {object} data - object having result count and page no. properties.
     */
    function logSearchResults(data) {
        var results = [],
            resultsInfo,
            searchBox = $('[id$="_csr_sbox"]'),
            selectorListResults = $('#Result .gtm-result-item'),
            selectorPeopleResults = $('#divUserProfiles .gtm-result-people'),
            itemDivsionObject;

        $.each(selectorListResults, function(index, item) {
            var itemData = $(item).data(),
                contentTypeString,
                itemDocTypeObject;

            if (itemData.ossItemSection === SN.Constants.SEARCH_ITEM_SECTION_LIST) {
                itemDivsionObject = getConfigurationByKey(SN.Constants.LIST_CATEGORY_SYSTEM_DIVISION, itemData.ossItemURL);
                itemDocTypeObject = getConfigurationByKey(SN.Constants.LIST_CATEGORY_DOC_TYPE, itemData.ossItemDocType);
                contentTypeString = itemData.ossItemContentType.replace(/\s/g, '_');

                itemData.ossItemContentType = contentTypeString
                    .substring(contentTypeString
                        .lastIndexOf('__') + 2).replace(/_/g, ' ') || '';
                itemData.ossItemDivision = (itemDivsionObject && itemDivsionObject.value) ? itemDivsionObject.value : '';
                itemData.ossItemDocType = (itemDocTypeObject && itemDocTypeObject.value) ? itemDocTypeObject.value : '';
            }
            itemData.ossItemPosition = itemData.ossItemPosition.toString() || '' ;
            results.push(itemData);
        });

        if($('#divPromotedUser').length > 0){
        	$.each($('#divPromotedUser .gtm-result-best-bet'), function(index, item) {
        		var itemData = $(item).data();
        		itemDivsionObject = getConfigurationByKey(SN.Constants.LIST_CATEGORY_SYSTEM_DIVISION, itemData.ossItemURL);
        		itemData.ossItemDivision = (itemDivsionObject && itemDivsionObject.value) ? itemDivsionObject.value : '';
        		itemData.ossItemPosition = itemData.ossItemPosition ? itemData.ossItemPosition.toString() : '' ;
                results.push(itemData);
        	});
        }

        if ($(".ms-srch-group-border").is(":visible")) {
            $.each(selectorPeopleResults, function(index, item) {
                var itemData = $(item).data();
                itemData.ossItemPosition = itemData.ossItemPosition ? itemData.ossItemPosition.toString() : '' ;
                results.push(itemData);
            });
        }
        resultsInfo = getGADataObject(SN.Enums.AnalyticsObjectTypes.Results);
        resultsInfo.ossItems = results;
        resultsInfo.ossKeyword = getSearchBoxValue(searchBox.attr('id'));
        if (data) {
            resultsInfo.ossPage = data.currentPage;
            resultsInfo.ossResults = data.resultCount;
        }
        logToGTM(resultsInfo);
    }

    /**
     * Logs data to gtm dayaLayer.
     * @param  {string} dataLayer- Name of of dataLayer. 
     * @param  {object} gtmObject- Object to be pushed in data layer.
     */
    function logToGTM(gtmObject) {
        var dataLayer = window[SN.Constants.DATALAYER];

        if (dataLayer) {
            gtmObject = JSON.parse(JSON.stringify(gtmObject)
                .replace(/"\s+|\s+"/g, '"')
                .replace(/\"\"/ig, '\"' + SN.Constants.DEFAULT + '\"'));
            dataLayer.push(gtmObject);
        }
    }

    /**
     * Logs user info to gtm dataLayer.
     */

    function logUserInfo() {
        var userInfoSelector = $('#div-user-info'),
            userInfo = updateGtmObject(SN.Enums.AnalyticsObjectTypes.UserInfo, userInfoSelector);
        logToGTM(userInfo);
    }

    /**
     * Logs search referrer information.
     */
    function logReferrerInfo() {
        var dlObject = getGADataObject(SN.Enums.AnalyticsObjectTypes.SearchSource),
            referrer = SN.Cache.GetCache('sessionStorage', 'referrer'),
            sourceSystem,
            sourceCategory,
            sourceCategoryString = '';

        if (referrer) {
            return;
        } else {
            $.each(SN.Constants.SOURCE_REFERER_VAR, function(index, item) {
                referrer = SN.Utils.GetUrlParameters(window.location.href, item);
                if (referrer) {
                    return false;
                }
            });
            referrer = referrer || window.document.referrer || '';

            referrer = referrer.toLowerCase();
            $.each(SN.Constants.SOURCE_REFERER_DIRECT_URLS, function(index, item) {
                if (referrer.indexOf(item.toLowerCase()) > -1) {
                    referrer = '';
                    return false;
                }
            });

            if (referrer === '') {
                dlObject.sourceReferrer = '';
                dlObject.sourceSystem = SN.Constants.SOURCE_REFERER_DIRECT;
                dlObject.sourceCategory = SN.Constants.SOURCE_REFERER_DIRECT;
            } else {
                sourceSystem = getConfigurationByKey(SN.Constants.LIST_CATEGORY_SYSTEM_DIVISION, referrer);
                sourceSystem = sourceSystem ? sourceSystem.title : '';
                sourceCategory = getConfigurationByKey(SN.Constants.LIST_CATEGORY_SYSTEM_CATEGORY, referrer);
                if (sourceCategory) {
                    sourceCategoryString += sourceCategory.title ? sourceCategory.title : '';
                    sourceCategoryString += sourceCategory.value ? " (" + sourceCategory.value + ")" : '';
                }
                if (sourceSystem || sourceCategoryString) {
                    dlObject.sourceSystem = sourceSystem;
                    dlObject.sourceCategory = sourceCategoryString;
                    dlObject.sourceReferrer = maskUrl(referrer);
                } else {
                    dlObject.sourceSystem = SN.Constants.SOURCE_REFERER_OTHER;
                    dlObject.sourceCategory = SN.Constants.SOURCE_REFERER_OTHER;
                }
            }
            SN.Cache.SetCache('sessionStorage', 'referrer', dlObject);
            logToGTM(dlObject);
        }
    }

    /**
     * Get search category.
     * @param  {object} searchElement - jquery selector.
     * @return {string} ossCategory - Search category.
     */
    function getSearchCategory(searchElement) {
        var ossCategory,
            navLink;
        searchElement = searchElement ? searchElement : $('.ms-srchnav-link-selected');
        navLink = (searchElement && searchElement.length > 0) ? searchElement.text().trim() ||
            searchElement.find('.ms-srchnav-menu-title').text().trim() : null;

        navLink = (navLink === SN.Constants.SEARCH_CATEGORY_EVERYTHING) ? SN.Constants.SEARCH_CATEGORY_GLOBAL : navLink;
        ossCategory = SN.Constants[$(searchElement).data('ossCategory')] || navLink;
        return ossCategory || SN.Constants.SEARCH_CATEGORY_GLOBAL;
    }

    function getSearchBoxType(location) {
        var searchBoxType;

        if (location.indexOf(SN.Constants.PAGE_TYPE_DEFAULT) > -1) {
            searchBoxType = SN.Constants.SEARCH_BOX_HOME;
        } else if (location.indexOf(SN.Constants.PAGE_TYPE_ADVANCED) > -1) {
            searchBoxType = SN.Constants.SEARCH_BOX_ADVANCED;
        } else {
            searchBoxType = SN.Constants.SEARCH_BOX_RESULT_PAGE;
        }

        return searchBoxType;
    }

    /**
     * Gets search features used in keyword. Boolean/ wildcard.
     * @param  {string} keyword - Search keyword.
     * @return {string} feature - feature used. Boolean/ wildcard.
     */
    function getFeatures(keyword) {
        var feature = '',
            operators = getConfigurationByCategory(SN.Constants.CACHE_KEY_OPERATORS);
        try {
            if (operators && keyword) {
                $.each(operators, function(index, el) {
                    $.each(el.value.split(','), function(index, value) {
                        value = value ? value.trim() : null;
                        if (value && new RegExp(value, 'i').test(keyword)) {
                            feature += (feature !== '') ? '; ' + el.key : el.key;
                            return false;
                        }
                    });
                });
            }
            return feature;
        } catch (e) {
            SN.Utils.ClientLog(e.message);
            return feature;
        }
    }

    /*
     * Returns data layer object.
     * @param  {string} objectType - Name of required object.
     * @return {object} object - json object object.
     */

    function getGADataObject(objectType) {
        var object;
        switch (objectType) {
            case SN.Enums.AnalyticsObjectTypes.UserInfo:
                object = {
                    event: SN.Constants.SEARCH_EVENT_PAGE_LOAD,
                    userDivision: '',
                    userOpLevel1: '',
                    userOpLevel2: '',
                    userFunction: '',
                    userSite: '',
                    userCountry: '',
                    userExternal: '',
                    userOpLevel3: '',
                    userOpLevelLocal: '',
                    userCostCenterDescription: '',
                    userLegalEntityDescription: ''
                };
                break;
            case SN.Enums.AnalyticsObjectTypes.SearchSource:
                object = {
                    event: SN.Constants.SEARCH_EVENT_ENTRY,
                    sourceReferrer: '',
                    sourceSystem: '',
                    sourceCategory: '',
                };
                break;
            case SN.Enums.AnalyticsObjectTypes.SearchInfo:
                object = {
                    event: SN.Constants.SEARCH_EVENT_SEARCH,
                    ossCategory: '',
                    ossBox: '',
                    ossFeatures: '',
                    ossTrigger: '',
                    ossKeyword: ''
                };
                break;
            case SN.Enums.AnalyticsObjectTypes.Results:
                object = {
                    event: SN.Constants.SEARCH_EVENT_RESULTS,
                    ossItems: [],
                    ossPage: '',
                    ossKeyword: '',
                    ossResults: '',
                };
                break;
            case SN.Enums.AnalyticsObjectTypes.Refinements:
                object = {
                    event: SN.Constants.SEARCH_EVENT_REFINEMENT,
                    refinementType: '',
                };
                break;
            case SN.Enums.AnalyticsObjectTypes.ResultClick:
                object = {
                    event: SN.Constants.SEARCH_EVENT_CLICK,
                    ossItem: {},
                };
                break;
            case SN.Enums.AnalyticsObjectTypes.ResultPreview:
                object = {
                    event: SN.Constants.SEARCH_EVENT_PREVIEW,
                    ossItem: {},
                };
                break;
            default:
                object = {};
                break;
        }
        return object;
    }

    /**
     * Get configuration value by key.
     * @param  {string} key - configuration key.
     * @return {string} value - configuartion value.
     */

    function getConfigurationByKey(category, key) {
        return SN.Global.AppConfig.FirstOrDefault(null, function(configObject) {
            return configObject && configObject.key &&
                (new RegExp(configObject.key, 'i').test(key) &&
                    configObject.category === category);
        });
    }

    /**
     * Gets application configuration keys by category.
     * @param  {string} category - category name.
     * @return {object} value - configuartion object.
     */
    function getConfigurationByCategory(category) {
        return SN.Global.AppConfig.Where(function(configObject) {
            return category === configObject.category;
        }).Select(function(configObject) {
            return configObject;
        }).ToArray();
    }

    /**
     * Get search box value
     */
    function getSearchBoxValue(sBoxId) {
        var searchBox = $('#' + sBoxId),
            searchPrompt = SN.Utils.GetSearchPrompt(sBoxId) || '',
            searchText = searchBox.length > 0 ? searchBox.val().trim() : null,
            mapLocation,
            dropDown = $('#drpLocation option:selected');

        if (searchText && searchText.toLowerCase() !== searchPrompt.toLowerCase()) {
            return searchText;
        } else {
            if (dropDown.length > 0) {
                mapLocation = SN.Utils.GetUrlParameters(window.location.href, 'maplocation');
                searchText = dropDown.text();
                searchText += mapLocation ? ' (' + mapLocation + ')' : '';
            }
            return (searchText.toLowerCase() === searchPrompt.toLowerCase()) ?
                SN.Constants.SEARCH_BOX_DEFAULT_VALUE : searchText;

        }
    }

    /**
     * Updates gtm object.
     * @param  {string} objectId - Id of object to be updated.
     * @param  {object} elementSelector - jquery selector object containering info.
     * @return {object} dlObject - update object.
     */
    function updateGtmObject(objectId, elementSelector) {
        var dlObject = getGADataObject(objectId),
            objectData;

        if (elementSelector.length > 0) {
            objectData = elementSelector.data();
            $.each(dlObject, function(key) {
                dlObject[key] = objectData[key] ? objectData[key] : dlObject[key];
            });
        }
        return dlObject;
    }

    /**
     * Masks part of url based on configurations.
     * @param  {string} urlString - input string.
     * @return {string} maskedString - masked string.
     */
    function maskUrl(urlString) {
        var matchedString,
            stringToBeReplaced,
            maskedUrl,
            maskProperties,
            seperator,
            maskValue;
        if (urlString) {
            var maskRegex = getConfigurationByCategory(SN.Constants.CACHE_KEY_URL_MASK);
            $.each(maskRegex, function(index, mask) {
                if (mask.key && mask.value) {
                    maskProperties = mask.value.split(",");
                    maskValue = maskProperties.length > 0 && maskProperties[0] ? maskProperties[0].trim() : 'x';
                    seperator = maskProperties.length > 0 && maskProperties[1] ? maskProperties[1].trim() : '/';
                    matchedString = urlString.match(new RegExp(mask.key, 'i'));
                    matchedString = matchedString ? matchedString[0] : null;
                    if (matchedString) {
                        stringToBeReplaced = matchedString.substring(matchedString.lastIndexOf(seperator) + 1);
                        maskedUrl = urlString.replace(stringToBeReplaced, maskValue.repeat(stringToBeReplaced.length));
                        return false;
                    }
                }
            });
            return maskedUrl ? maskedUrl : urlString;
        } else {
            return '';
        }
    }

    return {
        Initialize: initialize,
        SetSearchInfo: setSearchInfo,
        LogSearchResults: logSearchResults,
        LogRefinerInfo: logRefinerInfo
    };

})();


$(document).on(SN.Constants.EVENT_SN_GA_INIT, function() {
    SN.Comps.Analytics.Initialize();
});
