'use strict';

/*
File Name       :   sn-utils.js
Author          :   Cognizant Technology Solutions
Description     :   This application component contains utility methods reqiured for googla analytics framework.
*/

(function() {
    SN.Utils = (function() {
        /*
         * Logs the exception message in browser console.
         * @param {string} message - Exception Message.
         */
        function clientLog(message) {
            if (typeof console !== 'undefined' && typeof message !== 'undefined') {
                console.log(message);
            }
        }

        /**
         * Gets url parameter by name.
         * @param  {string} url - Url from which parameters are to be fetched.
         * @param  {string} name - Name of parameter to be fetched.
         * @return {string} result - value of parameter in string format.     
         */
        function getUrlParameters(url, name) {
            var regexS, regex, results;
            if (!url) url = location.href;
            name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
            regexS = '[\\?&]' + name + '=([^&#]*)';
            regex = new RegExp(regexS);
            results = regex.exec(url);
            return results === null ? null : decodeURIComponent(results[1]);
        }

        /**
         * Gets search prompt.
         * @param  {string} searchBoxId - Id of search box.
         * @return {string} currentPrompt - Current prompt of search box.
         */
        function getSearchPrompt(searchBoxId) {
            var groups, currentPrompt;
            if (searchBoxId && typeof Srch !== 'undefined' && typeof Srch.ScriptApplicationManager !== 'undefined') {
                groups = Srch.ScriptApplicationManager.get_current().queryGroups;
                $.each(groups.Default.searchBoxes, function() {
                    var currentID = this.get_id() + '_sbox';
                    if (searchBoxId.toLowerCase() === currentID.toLowerCase()) {
                        currentPrompt = this.get_currentPrompt();
                    }
                });
            }
            return currentPrompt;
        }

        /**
         * Get information about the URL components viz. page type.
         * @returns {object} - Object with field pageType.
         */
        function getUrlComponents() {
            var urlComponents = {
                    pageType: ''
                },
                serverRequestPath = _spPageContextInfo.serverRequestPath.toLowerCase();

            if (serverRequestPath.indexOf('default.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.HomePage;
            } else if (serverRequestPath.indexOf('/results.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.Results;
            } else if (serverRequestPath.indexOf('/peopleresults.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.PeopleResults;
            }else if (serverRequestPath.indexOf('/advanced.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.Advanced;
            } else if (serverRequestPath.indexOf('/campusmap.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.CampusMap;
            } else if (serverRequestPath.indexOf('/holidaycalendar.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.HolidayCalender;
            } else if (serverRequestPath.indexOf('/nkc2010.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.NKCNew;
            } else if (serverRequestPath.indexOf('/sitesearch.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.SiteSearch;
            } else if (serverRequestPath.indexOf('/yammer-redirect.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.YammerRedirect;
            } else if (serverRequestPath.indexOf('/portalresults2010.aspx') !== -1) {
                urlComponents.pageType = SN.Enums.PageType.PortalResults;
            } 

            urlComponents.pageType = urlComponents.pageType || 0;

            return urlComponents;
        }

        return {
            ClientLog: clientLog,
            GetUrlParameters: getUrlParameters,
            GetSearchPrompt: getSearchPrompt,
            GetUrlComponents: getUrlComponents
        };
    })();
    SN.Cache = (function() {

        function setCache(cacheType, cacheKey, cacheValue, expirationMins) {
            var record, expirationMs;

            if (cacheKey && cacheValue) {
                try {
                    cacheKey = getStorageKey(cacheKey);
                    expirationMs = expirationMins ? (parseInt(expirationMins) * 60 * 1000) : null;

                    record = {
                        value: JSON.stringify(cacheValue),
                        timestamp: expirationMs ? (new Date().getTime() + expirationMs) : null
                    };

                    window[cacheType].setItem(cacheKey, JSON.stringify(record));
                } catch (e) {
                    SN.Utils.ClientLog(e.message);
                }
            }
        }

        /*
         * Gets local storage cache value using the cache key.
         * @param {string} cacheKey - Cache key.
         */
        function getCache(cacheType, cacheKey) {
            var record;

            if (cacheKey) {
                try {
                    cacheKey = getStorageKey(cacheKey);
                    record = SPComp.tryParseJSON(window[cacheType].getItem(cacheKey));

                    if (record) {
                        if (record.timestamp) {
                            if (new Date().getTime() < record.timestamp) {
                                record = SPComp.tryParseJSON(record.value);
                            } else {
                                record = null;
                                window[cacheType].removeItem(cacheKey);
                            }
                        } else {
                            record = SPComp.tryParseJSON(record.value);
                        }
                    }
                } catch (e) {
                    SN.Utils.ClientLog(e.message);
                }
            }

            return record;
        }

        function getStorageKey(key) {
            return (_spPageContextInfo.siteAbsoluteUrl.replace(/\W/g, '') + 
                    _spPageContextInfo.userLoginName.replace(/\W/g, '') + key).toLowerCase();
        }

        return {
            SetCache: setCache,
            GetCache: getCache
        };
    })();

    SN.Services = (function() {

        /*
         * Retrieves items from a SharePoint list based on a CAML query.
         * @param {object} options - JSON object containing method options.
         * @returns {object} - Promise object.
         */
        function getListItems(options) {
            var deferred = $.Deferred(),
                clientContext, currList, listItems,
                camlQuery;

            try {
                SPComp.RESTv2('Items', {
                    service: { type: 'SPS' },
                    fields: options.fields,
                    list: options.listName,
                    site: options.site,
                    query: options.query,
                    rowLimit: options.rowLimit,
                    queryOptions: options.queryOptions
                }).then(function(data) {
                    deferred.resolve(data.d.results);
                }).fail(function() {
                    deferred.resolve();
                });
            } catch (e) {
                SN.Utils.ClientLog(e.message);
                deferred.resolve();
            }

            return deferred.promise();
        }

        /*
         * Gets all list items from the application configuration list in key/value format.
         * @param {object} options - JSON object containing method options.
         * @returns {object} - Promise object.
         */
        function getConfigListItems(options) {
            var deferred = $.Deferred(),
                cacheKey = options.cacheKey || 'ApplicationConfiguration',
                itemKey,
                configurations = SN.Cache.GetCache('localStorage', cacheKey);

            try {
                if (configurations) {
                    deferred.resolve(configurations);
                } else {
                    getListItems({ 
                        listName: options.listTitle, 
                        site: _spPageContextInfo.siteAbsoluteUrl,
                        fields: options.fields
                    }).then(function(data) {
                            data.forEach(function(result) {
                                configurations = configurations || [];
                                configurations.push({
                                    key: result[SN.Constants.LIST_APPLICATION_CONFIGURATION_KEY],
                                    value: result[SN.Constants.LIST_APPLICATION_CONFIGURATION_VALUE],
                                    category: result[SN.Constants.LIST_APPLICATION_CONFIGURATION_CATEGORY],
                                    title: result[SN.Constants.LIST_APPLICATION_CONFIGURATION_TITLE]
                                });
                            });

                            SN.Cache.SetCache('localStorage', cacheKey, configurations, options.appConfigTimeout);


                            deferred.resolve(configurations);
                        },
                        function(err) {
                            deferred.reject(err);
                        });
                }
            } catch (e) {
                SN.Utils.ClientLog(e.message);
                deferred.resolve();
            }

            return deferred.promise();
        }

        return {
            GetConfigListItems: getConfigListItems,
            GetListItems: getListItems
        };
    })();
})();
