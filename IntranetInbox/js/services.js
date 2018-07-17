(function() {
    if (!window["NP"]) {
        window["NP"] = {};
    }
    NP.Namespace = {
        Register: function(namespace) {
            var parts,
                context,
                nsPath,
                partsLength;

            parts = namespace.split(".");
            partsLength = parts.length;
            context = window;
            nsPath = "";
            for (var i = 0, l = partsLength; i < l; ++i) {
                var name = parts[i];
                if (!context[name]) {
                    context[name] = {};
                    context[name].__namespace = name;
                }
                nsPath += name + ".";
                context = context[name];
                if (!context.__namespace) {
                    context.__namespace = nsPath.substring(0, nsPath.length - 1);
                }
            }
            return context;
        }
    };
})();

/**
 * This namespace contains utility functions used across application.
 */
(function() {
    NP.Namespace.Register("NP");
    NP.Namespace.Register("NP.UTILS");

    /**
     * This namespace contains enums used across application.
     */

    NP.ENUM = (function() {
        var scriptType = {
            CSOM: 1,
            Taxonomy: 2,
            UserProfile: 3,
            UserProfileCSOM: 4,
            Search: 5,
            WebTaggingUI: 6,
            RTE: 7,
            Dialog: 8,
            Publishing: 9,
            AjaxControlToolKit: 10,
            Ribbon: 11
        };

        return {
            ScriptType: scriptType
        };
    })();

    /**
     * This namespace contains constants used across application.
     */

    NP.CONSTANTS = {
        Lists: {
            GLOBAL_NAVIGATION: "GlobalNavigation",
            APPLICATION_CONFIGURATIONS: "Application_Configuration"
        },
        CacheKeys: {
            APPLICATION_CONFIGURATIONS: "ApplicationConfigurations"
        }
    }

    NP.UTILS = {
        loadedScripts: [],
        qs: null,

        ConvertToHierarchy: function(arry) {
            var nodeObjects = NP.UTILS.CreateStructure(arry);
            for (var i = nodeObjects.length - 1; i >= 0; i--) {
                var currentNode = nodeObjects[i];
                if (!currentNode.value.Parent) {
                    continue;
                }
                var parent = NP.UTILS.GetParent(currentNode, nodeObjects);

                if (parent === null) {
                    continue;
                }

                parent.children.push(currentNode);
                nodeObjects.splice(i, 1);
            }
            console.dir(nodeObjects);
            return nodeObjects;
        },
        CreateStructure: function(nodes) {
            var objects = [];
            for (var i = 0; i < nodes.length; i++) {
                objects.push({
                    value: nodes[i],
                    children: [],
                    name: nodes[i].Title,
                    url: nodes[i].LinkURL ? nodes[i].LinkURL.Url : '#',
                    openInNewTab: nodes[i].OpenInNewTab
                });
            }
            return objects;
        },
        GetParent: function(child, nodes) {
            var parent = null;
            for (var i = 0; i < nodes.length; i++) {
                if (child.value.Parent && nodes[i].value.ID === child.value.Parent.ID) {
                    return nodes[i];
                }
            }
            return parent;
        },

        /*
         * Logs the exception message in browser console
         * @param {string} message - Exception Message
         */
        ClientLog: function(message) {
            if (typeof console === "undefined" || typeof message === "undefined") {
                return;
            }

            console.log(message);
        },

        /* Retrieves query string value by key from the current URL.
         *  @key {string} Query string key to be retrieved.
         */
        QS: function(key) {
            var match, pl, search, decode, query;

            if (!this.qs) {
                pl = /\+/g;
                search = /([^&=]+)=?([^&]*)/g;
                decode = function(enc) { return decodeURIComponent(enc.replace(pl, " ")); };
                query = window.location.search.substring(1);

                this.qs = {};

                // Intentional shortcut assignment and condition matching.
                while (match = search.exec(query)) {
                    this.qs[decode(match[1])] = decode(match[2]);
                }
            }

            return this.qs[key] ? this.qs[key] : "";
        },

        /*Set cookie*/
        SetCookie: function(cname, cvalue, exdays) {
            var expires,
                d = new Date();

            if (exdays) {
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                expires = "expires=" + d.toUTCString();
            }

            if (expires) {
                document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
            } else {
                document.cookie = cname + "=" + cvalue + "; path=/";
            }
        },

        /*Get cookie*/
        GetCookie: function(cname) {
            var i, c,
                name = cname + "=",
                ca = document.cookie.split(';');

            for (i = 0; i < ca.length; i++) {
                c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }

            return "";
        },

        GetLayoutsFolderUrl: function() { return _spPageContextInfo.siteServerRelativeUrl + "/_layouts/15/"; },


        /*
         * Asynchronously loads OOTB SharePoint on-demand script as required.
         * @param {number} - type - Type of script to load - CSOM, Taxonomy or User Profile.
         * @returns {object} - Promise object.
         */
        LoadSODScript: function(type) {
            var deferred = $.Deferred();

            switch (type) {
                case NP.ENUM.ScriptType.CSOM:
                    SP.SOD.executeFunc("sp.js", "SP.ClientContext", function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.Taxonomy:
                    SP.SOD.registerSod("sp.taxonomy.js", NP.UTILS.GetLayoutsFolderUrl() + "sp.taxonomy.js");
                    SP.SOD.executeFunc("sp.taxonomy.js", "SP.Taxonomy.TaxonomySession", function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.UserProfile:
                    SP.SOD.executeFunc("userprofile", "SP.UserProfiles.PeopleManager", function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.UserProfileCSOM:
                    SP.SOD.executeFunc("sp.js", "SP.ClientContext", function() { SP.SOD.executeFunc("userprofile", "SP.UserProfiles.js", function() { deferred.resolve(); }); });
                    break;
                case NP.ENUM.ScriptType.Search:
                    SP.SOD.executeFunc("", "", function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.WebTaggingUI:
                    SP.SOD.executeFunc("scriptforwebtaggingui.js", "Microsoft.SharePoint.Taxonomy", function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.RTE:
                    SP.SOD.executeFunc("sp.ui.rte.publishing.js", null, function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.Dialog:
                    SP.SOD.executeFunc("sp.ui.dialog.js", "SP.ClientContext", function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.Publishing:
                    SP.SOD.registerSod("SP.ClientContext", SP.Utilities.Utility.getLayoutsPageUrl("sp.js"));
                    SP.SOD.registerSod("SP.Publishing.PublishingWeb", SP.Utilities.Utility.getLayoutsPageUrl("sp.publishing.js"));
                    SP.SOD.loadMultiple(["SP.ClientContext", "SP.Publishing.PublishingWeb"], function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.AjaxControlToolKit:
                    SP.SOD.registerSod("ajaxtoolkit.js", null, function() { deferred.resolve(); });
                    break;
                case NP.ENUM.ScriptType.Ribbon:
                    SP.SOD.executeOrDelayUntilScriptLoaded(function() { deferred.resolve(); }, "sp.ribbon.js");
                    break;
            }

            return deferred.promise();
        },

        /*
         * Simulates .NET framework's string.Format method to format a string with one or more replaceable tokens.
         * @param {object} arguments - A default array of arguments with the first argument being the tokenized string.
         * @returns {string} - Formatted value.
         */
        FormatString: function() {
            var paramStr = arguments[0] || "",
                re = null,
                counter,
                argLength = arguments.length - 1;

            for (counter = 0; counter < argLength; counter++) {
                re = new RegExp("\\{" + counter + "\\}", "igm");
                paramStr = paramStr.replace(re, arguments[counter + 1]);
            }

            return paramStr;
        },
    };
})();

/**
 * This namespace contains Term sore functions used across application.
 */
(function() {
    NP.Namespace.Register("NP.CLIENT");
    NP.Namespace.Register("NP.CLIENT.MMS");
    NP.CLIENT.MMS = (function() {
        function getTermSet(id) {
            var deferred = $.Deferred();
            try {
                var ctx = SP.ClientContext.get_current();
                var taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx);
                var termStore = taxonomySession.getDefaultSiteCollectionTermStore();
                var termSet = termStore.getTermSet(id);
                var terms = termSet.getAllTerms();

                ctx.load(terms);
                ctx.executeQueryAsync(function() {
                    deferred.resolve(terms);
                }, function(sender, args) {
                    deferred.reject(args);
                });
            } catch (e) {
                NP.UTILS.ClientLog(e);
            }
            return deferred.promise();
        }

        function getTermSetAsTree(id, termSetName) {
            var deferred = $.Deferred();
            getTermSet(id).then(function(terms) {
                var customerProps,
                    termsEnumerator = terms.getEnumerator(),
                    tree = {
                        name: termSetName,
                        guid: id,
                        term: terms,
                        children: [],
                        url: '#'
                    };

                // Loop through each term
                while (termsEnumerator.moveNext()) {
                    var currentTerm = termsEnumerator.get_current();
                    var currentTermPath = currentTerm.get_pathOfTerm().split(';');
                    var children = tree.children;

                    // Loop through each part of the path
                    for (var i = 0; i < currentTermPath.length; i++) {
                        var foundNode = false;

                        for (var j = 0; j < children.length; j++) {
                            if (children[j].name === currentTermPath[i]) {
                                foundNode = true;
                                break;
                            }
                        }

                        // Select the node, otherwise create a new one
                        var term = foundNode ? children[j] : { name: currentTermPath[i], children: [] };
                        // If we're a child element, add the term properties
                        if (i === currentTermPath.length - 1) {
                            term.term = currentTerm;
                            term.title = currentTerm.get_name();
                            term.guid = currentTerm.get_id().toString();
                            customerProps = currentTerm.get_customProperties();
                            term.url = customerProps ? customerProps.Url : '#';
                        }

                        // If the node did exist, let's look there next iteration
                        if (foundNode) {
                            children = term.children;
                        }
                        // If the segment of path does not exist, create it
                        else {
                            children.push(term);

                            // Reset the children pointer to add there next iteration
                            if (i !== currentTermPath.length - 1) {
                                children = term.children;
                            }
                        }
                    }
                }

                tree = sortTermsFromTree(tree);
                deferred.resolve(tree);
            });
            return deferred.promise();
        }

        function sortTermsFromTree(tree) {
            // Check to see if the get_customSortOrder function is defined. If the term is actually a term collection,
            // there is nothing to sort.
            if (tree.children.length && tree.term.get_customSortOrder) {
                var sortOrder = null;

                if (tree.term.get_customSortOrder()) {
                    sortOrder = tree.term.get_customSortOrder();
                }

                // If not null, the custom sort order is a string of GUIDs, delimited by a :
                if (sortOrder) {
                    sortOrder = sortOrder.split(':');

                    tree.children.sort(function(a, b) {
                        var indexA = sortOrder.indexOf(a.guid);
                        var indexB = sortOrder.indexOf(b.guid);

                        if (indexA > indexB) {
                            return 1;
                        } else if (indexA < indexB) {
                            return -1;
                        }

                        return 0;
                    });
                }
                // If null, terms are just sorted alphabetically
                else {
                    tree.children.sort(function(a, b) {
                        if (a.title > b.title) {
                            return 1;
                        } else if (a.title < b.title) {
                            return -1;
                        }

                        return 0;
                    });
                }
            }

            for (var i = 0; i < tree.children.length; i++) {
                tree.children[i] = sortTermsFromTree(tree.children[i]);
            }
            return tree;
        }
        return {
            GetTermSetAsTree: getTermSetAsTree,
        };
    })();
})();

/************** METHOD RELATED TO CACHING ***************/
(function() {
    NP.Namespace.Register("NP.CLIENT.CACHE");
    NP.CLIENT.CACHE = (function() {
        var setCache = function(cacheKey, cacheValue, cacheType, expirationMins) {
            var record, expirationMs;
            cacheType = "localStorage";
            expirationMins = 60;
            if (cacheKey) {
                try {
                    cacheKey = getStorageKey(cacheKey);
                    expirationMs = expirationMins ? (expirationMins * 60 * 1000) : null;

                    record = {
                        value: JSON.stringify(cacheValue),
                        timestamp: expirationMs ? (new Date().getTime() + expirationMs) : null
                    };

                    window[cacheType].setItem(cacheKey, JSON.stringify(record));
                } catch (e) {
                    NP.UTILS.ClientLog(e.message);
                }
            }
        };

        /*
         * Gets local storage cache value using the cache key.
         * @param {string} cacheKey - Cache key.
         */
        var getCache = function(cacheKey, cacheType) {
            var record;
            cacheType = "localStorage";
            if (cacheKey) {
                try {
                    cacheKey = getStorageKey(cacheKey);
                    record = tryParseJSON(window[cacheType].getItem(cacheKey));
                    if (record) {
                        if (record.timestamp) {
                            if (new Date().getTime() < record.timestamp) {
                                record = tryParseJSON(record.value);
                            } else {
                                record = null;
                                window[cacheType].removeItem(cacheKey);
                            }
                        } else {
                            record = tryParseJSON(record.value);
                        }
                    }
                } catch (e) {
                    NP.UTILS.ClientLog(e.message);
                }
            }

            return record;
        };

        var tryParseJSON = function(str) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return false;
            }
        };

        var getStorageKey = function(key) {
            return (_spPageContextInfo.siteAbsoluteUrl.replace(/\W/g, '') +
                _spPageContextInfo.userId.toString().replace(/\W/g, '') + key).toLowerCase();
        };
        return {
            GetCache: getCache,
            SetCache: setCache
        };
    })();
})();

NP.NAVIGATIONCOMPONENT = function() {
    function viewModel(navigationTree) {
        var self = this;
        self.navigationTree = navigationTree;
    }

    function bindNaivagionEvents() {
        $('.menu > ul > li:has( > ul)').addClass('menu-dropdown-icon');
        $('.menu > ul > li > ul:not(:has(ul))').addClass('normal-sub');
        $(".menu > ul").before("<a href=\"#\" class=\"menu-mobile\">Navigation</a>");
        $(".menu > ul > li").hover(
            function(e) {
                if ($(window).width() > 943) {
                    $(this).children("ul").addClass("show_menu");
                    e.preventDefault();
                }
            },
            function(e) {
                if ($(window).width() > 943) {
                    $(this).children("ul").removeClass("show_menu");
                    e.preventDefault();
                }
            }
        );
        $(".menu > ul > li").click(function() {
            if ($(window).width() < 943) {
                $(this).children("ul").fadeToggle(150);
            }
        });
        $(".menu-mobile").click(function(e) {
            $(".menu > ul").toggleClass('show-on-mobile');
            e.preventDefault();
        });
    }

    function bindNaivagion(menuObject) {
        var koNode = $("#navigation-container")[0];
        var navigationModel = new viewModel(menuObject);
        if (koNode) {
            ko.cleanNode(koNode);
            ko.applyBindings(navigationModel, koNode);
            bindNaivagionEvents();
        }
    }
    return {
        ViewModel: viewModel,
        BindNaivagion: bindNaivagion

    }
};

NP.DATASERVICES = function() {
    var getApplicationConfig = function() {
        var deferred = $.Deferred();
        var appConfig = NP.CLIENT.CACHE.GetCache(NP.CONSTANTS.CacheKeys.APPLICATION_CONFIGURATIONS);
        if (appConfig) {
            deferred.resolve(appConfig);
        }
        $pnp.sp.web.lists.getByTitle(NP.CONSTANTS.Lists.APPLICATION_CONFIGURATIONS).items
            .top(100).get().then(function(configurations) {
                var appConfig = {};
                configurations && configurations.length &&
                    $.map(configurations, function(configuration) {
                        appConfig[configuration.Key] = configuration.Value;
                    });
                NP.CLIENT.CACHE.SetCache(NP.CONSTANTS.CacheKeys.APPLICATION_CONFIGURATIONS, appConfig);
                deferred.resolve(appConfig);
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise();
    };

    return {
        GetApplicationConfig: getApplicationConfig
    };
};


$(document).on("pnpReady", function() {
    $pnp.setup({
        sp: {
            headers: {
                "Accept": "application/json;odata=verbose",
            }
        }
    });

    var dataService = new NP.DATASERVICES();
    dataService.GetApplicationConfig().then(function(appConfig) {
        if (appConfig) {
            var navigationFromList = appConfig.NAVIGATION_FROM_LIST.toUpperCase() === "YES" ? true : false;
            var navigationComponent = new NP.NAVIGATIONCOMPONENT();
            if (!navigationFromList) {
                NP.UTILS.LoadSODScript(NP.ENUM.ScriptType.CSOM).then(function() {
                    NP.UTILS.LoadSODScript(NP.ENUM.ScriptType.Taxonomy).then(function() {
                        NP.CLIENT.MMS.GetTermSetAsTree(appConfig.Navigation_Term_Set_ID, "Global Naivation").then(function(termsetTree) {
                            navigationComponent.BindNaivagion(termsetTree);
                        });
                    });
                });
            } else {
                var navTreeObj = {};
                var navigationTree = [];
                var parent;

                $pnp.sp.web.lists.getByTitle(NP.CONSTANTS.Lists.GLOBAL_NAVIGATION).items
                    .select("ID,Title,Parent/ID, Parent/Title, Sequence,Level, LinkURL, OpenInNewTab")
                    .expand("Parent")
                    .orderBy("Level", true)
                    .orderBy("Sequence", true)
                    .get().then(function(data) {
                        console.log(data);
                        navTreeObj = { children: NP.UTILS.ConvertToHierarchy(data) };
                        navigationComponent.BindNaivagion(navTreeObj);
                    }, function(err) {
                        deferred.reject(err);
                    });

            }
        }
    });
});