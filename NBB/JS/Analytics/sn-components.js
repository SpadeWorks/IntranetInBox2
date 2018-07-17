"use strict";
/*
File Name       :   sn-components.js
Author          :   Cognizant Technology Solutions
Description     :   This application component acts as a bootstrapper for google analytics framework infrastructure.
*/
//test
SN.Comps = (function() {

    function initialize() {
        SN.Global = {};
        /* Loads Application Configuration */
        loadAppConfiguration().then(function() {
            $(document).trigger(SN.Constants.EVENT_SN_GA_INIT);
        });
    }

    /*
     * Loads application configuration to a global namespace.
     * @returns {object} - Promise object.
     */
    function loadAppConfiguration() {
        var options = {
            listTitle: SN.Constants.LIST_APPLICATION_CONFIGURATION,
            siteUrl: _spPageContextInfo.siteAbsoluteUrl,
            fields: SN.Constants.LIST_APPLICATION_CONFIGURATION_KEY + "," + SN.Constants.LIST_APPLICATION_CONFIGURATION_VALUE + "," + 
                SN.Constants.LIST_APPLICATION_CONFIGURATION_CATEGORY  + "," + SN.Constants.LIST_APPLICATION_CONFIGURATION_TITLE,
            appConfigTimeout: SN.Constants.CACHE_APP_CONFIG_TIME_OUT,
            cacheKey: 'ApplicationConfiguration'
        },
        deferred = $.Deferred();

        return SN.Services.GetConfigListItems(options).then(function(appConfigData) {
            SN.Global.AppConfig = $.Enumerable.From(appConfigData)
                .OrderByDescending(function (configObject) { return configObject.key ? configObject.key.length : 0  })
                .ThenBy(function (configObject) { return configObject.key})
                .Select(function (configObject) { return configObject });
            deferred.resolve();
        });
    }

    return {
        Initialize: initialize
    };

})();

$(function() {
    SN.Comps.Initialize();
});
