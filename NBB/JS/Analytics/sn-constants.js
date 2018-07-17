'use strict';

/*
File Name       :   sn-constants.js
Author          :   Cognizant Technology Solutions
Description     :   This application component defines the constants used in google analytics framework infrastructure.
*/

(function() {

    if (typeof window.SN === 'undefined') {
        window.SN = {};
    }
    SN.Constants = (function() {
        var CACHE_APP_CONFIG_TIME_OUT = '60',
            CACHE_KEY_WILDCARDS = 'Wildcard',
            CACHE_KEY_OPERATORS = 'Operators',
            CACHE_KEY_URL_MASK = 'URL Mask',
            EVENT_SN_GA_INIT = 'SNGAInit',
            LIST_APPLICATION_CONFIGURATION = 'Application Configuration',
            LIST_APPLICATION_CONFIGURATION_KEY = 'SNApplicationKey',
            LIST_APPLICATION_CONFIGURATION_VALUE = 'SNApplicationValue',
            LIST_APPLICATION_CONFIGURATION_CATEGORY = 'SNApplicationCategory',
            LIST_APPLICATION_CONFIGURATION_TITLE = 'Title',
            LIST_CATEGORY_SYSTEM_DIVISION = 'System Type & Division',
            LIST_CATEGORY_DOC_TYPE = 'Document Type',
            LIST_CATEGORY_SYSTEM_CATEGORY = 'System Category',
            LIST_CATEGORY_OPERATOR = 'Operator',
            DATALAYER = 'novartisDataLayer',
            DEFAULT = 'Default',
            EXTERNAL = 'external',
            REFINEMENT_TYPE_FACET_SEARCH = 'Facet Search',
            REFINEMENT_TYPE_ADVANCED_PEOPLE_SEARCH = 'Advanced People Search',
            REFINEMENT_TYPE_RECENT_KEYWORD_SEARCH = 'Recent Keyword Search',
            SEARCHJOURNEY_ENTRY = 'Entry',
            SEARCH_BOX_HOME = 'Home',
            SEARCH_BOX_RESULT_PAGE = 'Result Page',
            SEARCH_BOX_ADVANCED = 'Advanced',
            SEARCH_BOX_DEFAULT_VALUE = "Search...",
            SEARCH_CATEGORY_ADVANCED_PEOPLE_SEARCH = 'Advanced People Search',
            SEARCH_CATEGORY_GLOBAL = 'Global',
            SEARCH_CATEGORY_EVERYTHING = 'Everything',
            SEARCH_CATEGORY_PEOPLE = 'People',
            SEARCH_CATEGORY_NEWS = 'News',
            SEARCH_CATEGORY_TOOLSET = 'Toolset',
            SEARCH_CATEGORY_SERVICE = 'Service',
            SEARCH_CATEGORY_INTRANET = 'Intranet',
            SEARCH_CATEGORY_ACRONYMS = 'Acronyms',
            SEARCH_CATEGORY_CAMPUS_MAPS = 'Campus Maps',
            SEARCH_CATEGORY_HOLIDAY_CALENDARS = 'Holiday Calendars',
            SEARCH_CATEGORY_NOVARTIS_KNOWLEDGE_CENTER = 'Novartis Knowledge Center',
            SEARCH_CATEGORY_POLICIES = 'Policies',
            SEARCH_CATEGORY_YAMMER = 'Yammer',
            SEARCH_CATEGORY_SITE_SEARCH = 'Site Search',
            SEARCH_ITEM_SECTION_BEST_BET = 'Best Bet',
            SEARCH_ITEM_SECTION_PEOPLE = 'People',
            SEARCH_ITEM_SECTION_LIST = 'List',
            SEARCH_TRIGGER_CLICK = 'Click',
            SEARCH_TRIGGER_KEYPRESS = 'Keypress',
            SEARCH_TRIGGER_SUGGESTIONS = 'Suggestions',
            SEARCH_TRIGGER_LOAD = 'Page Load',
            SEARCH_EVENT_SEARCH = 'ce.search',
            SEARCH_EVENT_PAGE_LOAD = 'ce.pageload',
            SEARCH_EVENT_ENTRY = 'ce.entry',
            SEARCH_EVENT_RESULTS = 'ce.results',
            SEARCH_EVENT_REFINEMENT = 'ce.refinement',
            SEARCH_EVENT_CLICK = 'ce.click',
            SEARCH_EVENT_PREVIEW = 'ce.preview',
            SOURCE_REFERER_VAR = ['src', 'u'],
            SOURCE_REFERER_DIRECT = 'Direct',
            SOURCE_REFERER_OTHER = 'Other',
            SOURCE_REFERER_DIRECT_URLS = ['login.microsoftonline.com', _spPageContextInfo.webAbsoluteUrl.toLowerCase()],
            PAGE_TYPE_DEFAULT = 'default.aspx',
            PAGE_TYPE_ADVANCED = 'advanced.aspx',
            URL_PARAM_MAPLOCATION = 'maplocation',
            USER_ID_MASK = "{USER ID}";
            

        return {
            CACHE_APP_CONFIG_TIME_OUT: CACHE_APP_CONFIG_TIME_OUT,
            CACHE_KEY_OPERATORS: CACHE_KEY_OPERATORS,
            CACHE_KEY_WILDCARDS: CACHE_KEY_WILDCARDS,
            CACHE_KEY_URL_MASK: CACHE_KEY_URL_MASK,
            EVENT_SN_GA_INIT: EVENT_SN_GA_INIT,
            LIST_APPLICATION_CONFIGURATION: LIST_APPLICATION_CONFIGURATION,
            LIST_APPLICATION_CONFIGURATION_KEY: LIST_APPLICATION_CONFIGURATION_KEY,
            LIST_APPLICATION_CONFIGURATION_VALUE: LIST_APPLICATION_CONFIGURATION_VALUE,
            LIST_APPLICATION_CONFIGURATION_CATEGORY: LIST_APPLICATION_CONFIGURATION_CATEGORY,
            LIST_CATEGORY_SYSTEM_DIVISION: LIST_CATEGORY_SYSTEM_DIVISION,
            LIST_CATEGORY_DOC_TYPE: LIST_CATEGORY_DOC_TYPE,
            LIST_CATEGORY_OPERATOR: LIST_CATEGORY_OPERATOR,
            LIST_CATEGORY_SYSTEM_CATEGORY: LIST_CATEGORY_SYSTEM_CATEGORY,
            DEFAULT: DEFAULT,
            DATALAYER: DATALAYER,
            EXTERNAL: EXTERNAL,
            REFINEMENT_TYPE_FACET_SEARCH: REFINEMENT_TYPE_FACET_SEARCH,
            REFINEMENT_TYPE_ADVANCED_PEOPLE_SEARCH: REFINEMENT_TYPE_ADVANCED_PEOPLE_SEARCH,
            REFINEMENT_TYPE_RECENT_KEYWORD_SEARCH: REFINEMENT_TYPE_RECENT_KEYWORD_SEARCH,
            SEARCHJOURNEY_ENTRY: SEARCHJOURNEY_ENTRY,
            SEARCH_BOX_HOME: SEARCH_BOX_HOME,
            SEARCH_BOX_ADVANCED: SEARCH_BOX_ADVANCED,
            SEARCH_BOX_DEFAULT_VALUE: SEARCH_BOX_DEFAULT_VALUE,
            SEARCH_CATEGORY_ADVANCED_PEOPLE_SEARCH: SEARCH_CATEGORY_ADVANCED_PEOPLE_SEARCH,
            SEARCH_BOX_RESULT_PAGE: SEARCH_BOX_RESULT_PAGE,
            SEARCH_CATEGORY_GLOBAL: SEARCH_CATEGORY_GLOBAL,
            SEARCH_CATEGORY_EVERYTHING: SEARCH_CATEGORY_EVERYTHING,
            SEARCH_CATEGORY_PEOPLE: SEARCH_CATEGORY_PEOPLE,
            SEARCH_CATEGORY_NEWS: SEARCH_CATEGORY_NEWS,
            SEARCH_CATEGORY_TOOLSET: SEARCH_CATEGORY_TOOLSET,
            SEARCH_CATEGORY_SERVICE: SEARCH_CATEGORY_SERVICE,
            SEARCH_CATEGORY_INTRANET: SEARCH_CATEGORY_INTRANET,
            SEARCH_CATEGORY_ACRONYMS: SEARCH_CATEGORY_ACRONYMS,
            SEARCH_CATEGORY_CAMPUS_MAPS: SEARCH_CATEGORY_CAMPUS_MAPS,
            SEARCH_CATEGORY_HOLIDAY_CALENDARS: SEARCH_CATEGORY_HOLIDAY_CALENDARS,
            SEARCH_CATEGORY_NOVARTIS_KNOWLEDGE_CENTER: SEARCH_CATEGORY_NOVARTIS_KNOWLEDGE_CENTER,
            SEARCH_CATEGORY_POLICIES: SEARCH_CATEGORY_POLICIES,
            SEARCH_CATEGORY_SITE_SEARCH: SEARCH_CATEGORY_SITE_SEARCH,
            SEARCH_CATEGORY_YAMMER: SEARCH_CATEGORY_YAMMER,
            SEARCH_ITEM_SECTION_BEST_BET: SEARCH_ITEM_SECTION_BEST_BET,
            SEARCH_ITEM_SECTION_PEOPLE: SEARCH_ITEM_SECTION_PEOPLE,
            SEARCH_ITEM_SECTION_LIST: SEARCH_ITEM_SECTION_LIST,
            SEARCH_TRIGGER_CLICK: SEARCH_TRIGGER_CLICK,
            SEARCH_TRIGGER_KEYPRESS: SEARCH_TRIGGER_KEYPRESS,
            SEARCH_TRIGGER_SUGGESTIONS: SEARCH_TRIGGER_SUGGESTIONS,
            SEARCH_TRIGGER_LOAD: SEARCH_TRIGGER_LOAD,
            SEARCH_EVENT_SEARCH: SEARCH_EVENT_SEARCH,
            SEARCH_EVENT_PAGE_LOAD: SEARCH_EVENT_PAGE_LOAD,
            SEARCH_EVENT_ENTRY: SEARCH_EVENT_ENTRY,
            SEARCH_EVENT_RESULTS: SEARCH_EVENT_RESULTS,
            SEARCH_EVENT_REFINEMENT: SEARCH_EVENT_REFINEMENT,
            SEARCH_EVENT_CLICK: SEARCH_EVENT_CLICK,
            SEARCH_EVENT_PREVIEW: SEARCH_EVENT_PREVIEW,
            SOURCE_REFERER_VAR: SOURCE_REFERER_VAR,
            SOURCE_REFERER_DIRECT: SOURCE_REFERER_DIRECT,
            SOURCE_REFERER_DIRECT_URLS: SOURCE_REFERER_DIRECT_URLS,
            SOURCE_REFERER_OTHER: SOURCE_REFERER_OTHER,
            LIST_APPLICATION_CONFIGURATION_TITLE: LIST_APPLICATION_CONFIGURATION_TITLE,
            PAGE_TYPE_DEFAULT: PAGE_TYPE_DEFAULT,
            PAGE_TYPE_ADVANCED: PAGE_TYPE_ADVANCED,
            URL_PARAM_MAPLOCATION: URL_PARAM_MAPLOCATION,
            USER_ID_MASK: USER_ID_MASK

        };
    })();

    SN.Enums = (function() {
        var analyticsObjectTypes = {
                UserInfo: 1,
                SearchEntry: 2,
                SearchSource: 3,
                SearchInfo: 4,
                SearchType: 5,
                Results: 6,
                Refinements: 7,
                ResultClick: 8,
                ResultPreview: 9
            },
            pageType = { 
                HomePage: 1,
                Results: 2,
                PeopleResults: 3,
                Advanced: 4,
                CampusMap: 5,
                HolidayCalender: 6,
                NKCNew: 7,
                SiteSearch: 8,
                YammerRedirect: 9,
                PortalResults: 10
            };

            return {
                AnalyticsObjectTypes: analyticsObjectTypes,
                PageType: pageType
            };
    })();
}());
