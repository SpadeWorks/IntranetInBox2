﻿/////////////////////////////////////////////////////////////////////////////
// KPCU scripts
// by SpadeWorx  
// Functions organized alphabetically and camel cased
/////////////////////////////////////////////////////////////////////////////
"use strict";
var $ = jQuery.noConflict();
var allTermValues = []; //Used for happenings webpart
var strContactAndCommitmentItem = "";
var chkEmergencyTicker = false;
var quickLinksCount = 0;
var myKPCUID = "";
var siteAbsoluteURL = "";
var webAbsoluteURL = "";
var clientContext;
/////////////////////////////////////////////////////////////////////////////
// KPCU object functions
// Most KPCU function are found here
/////////////////////////////////////////////////////////////////////////////
var KPCU = {
    Init: function () {
        KPCU.GetSiteURLForMultipleSiteCollection();
        KPCU.HideShowLeftNavMenu(); //Used for toggle left navigation on subsites(HR)
        KPCU.AddClassToBreadCrumb(); //Used to override SP CSS for breadcrumb
        //This is used for happenings webpart, default data selected value should be set to "All"
        $(".happenings-wrapper").data("selectedValue", "All");
        //This is used for recently updated docs webpart, default data selected value should be set to "Policy"
        $(".recently-updated-doc-wrapper").data("selectedValue", "Policy");
        //Added by design team for happeing webpart
        $(window).on('resize', function () {
            $(".happening_box").height($(".banner-image").height() + 160);
        });
        $(window).load(function () {
            $(".happening_box").height($(".banner-image").height() + 160);
        });
        $(".search_wrapper i").click(function () {
            $("#overlay").show(200);
            $(".search-box-cont").addClass("animated slideInUp");
            $(".search-box-cont").toggleClass("hidden-xs");
            $(".search-box-cont").css("background", "none");
        });
        $("#overlay i").click(function () {
            $("#overlay").hide(100);
            $(".search-box-cont").addClass("hidden-xs");
        });
        $(".weather_wrapper i").click(function () {
            $("#overlay").show(100);
            $(".weather_containbox").addClass("animated slideInUp");
            $(".weather_containbox").removeClass("hidden-xs");
            $(".WeatherInfo").removeClass("hidden-xs");
        });
        $("#overlay i").click(function () {
            $("#overlay").hide(100);
            $(".weather_containbox").addClass("hidden-xs");
        });
        if ($("#dvPublishDate").length > 0) {
            $("#dvPublishDate").text(KPCU.DateFormat($("#dvPublishDate").text()));
        }
        //New project request open in modal popup
        KPCU.OpenInModalNewProjectRequest();
    },
    //Add classes to breadcrumb to modify the breeadcrumb look
    AddClassToBreadCrumb: function () {
        $("#breadcrumb-pub").find("span:not(:has(a))").addClass("breadcrumb-icon");
        $("#breadcrumb-pub").find("span:not(:has(a))").html('<i class="fa fa-chevron-right" aria-hidden="true"></i>');
    },
    //Added comma into number which in used in KPI and StarIncentive Webpart
    //nStr: It will be number as parameter
    AddCommasToNumber: function (nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    //Add KPCU Logo on Suite Bar
    AddKPCULogoOnSuiteBar: function () {
        $(".o365cs-nav-centerAlign").append("<img src='/sites/Intranet-Dev/Style Library/KPCU/Images/Keypoint_logo.png'>");
    },
    //Add list item (My Quick Link) to MyShortcuts list
    AddQuickLinkListItem: function () {
        if (KPCU.ValidateQuickLinkItem("Add")) return false;
        else {
            $("#addLinkButton").attr("disabled", "disabled");
            try {
                var clientContext = new SP.ClientContext(siteAbsoluteURL);
                var oList = clientContext.get_web().get_lists().getByTitle(KPCU.ListName.spListMyShortcuts);
                var itemCreateInfo = new SP.ListItemCreationInformation();
                this.oListItem = oList.addItem(itemCreateInfo);
                this.oListItem.set_item('Title', $("#quickLinkTitleBoxAdd").val());
                this.oListItem.set_item('MyShortcutsOwner', SP.FieldUserValue.fromUser(_spPageContextInfo.userEmail));
                this.oListItem.set_item('LinkURL', $("#quickLinkURLBoxAdd").val());
                this.oListItem.set_item('OpenInNewTab', document.getElementById("quickLinkOpenInNewTabAdd").checked);
                this.oListItem.update();
                clientContext.load(this.oListItem);
                clientContext.executeQueryAsync(Function.createDelegate(this, function () {
                    $("#addQuickLink").modal("toggle");
                    KPCU.ShowToaster("Item Added Successfully");
                    KPCU.GetMyQuickLaunch();
                }), Function.createDelegate(this, function (sender, args) {
                    KPCU.ClientLog("Error on AddQuickLinkListItem onQueryFailed : " + args.get_message(), "Error");
                }));
            } catch (ex) {
                KPCU.ClientLog("Error on AddQuickLinkListItem : " + ex, "Error");
            }
        }
    },
    //This will show all user birthdays and anniversaries from user profile properties
    BirthdayAndAnniversariesWebpart: function () {

        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                var birthday = 'RefinableDate00';
                var hireDate = 'RefinableDate05';
                // Get current date
                var currentTime = new Date();
                var startMonth = currentTime.getMonth() + 1;
                var startDay = currentTime.getDate();
                // Get current date + birthday frequency				
                currentTime.setDate(currentTime.getDate() + parseInt(getData[0].KPCUValue));
                var endMonth = currentTime.getMonth() + 1;
                var endDay = currentTime.getDate();
                var endYear = currentTime.getFullYear();
                var querytextBirthday = "";
                var querytextAnniversary = "";
                // build query with the magic 2000 year
                if (startMonth != '12') {
                    querytextBirthday += birthday + ">" + startMonth + '-' + startDay + '-2000 AND ' + birthday + '<' + endMonth + '-' + endDay + '-2000';
                } else {
                    querytextBirthday += birthday + ">" + startMonth + '-' + startDay + '-2000 OR ' + birthday + '<' + endMonth + '-' + endDay + '-2000';
                }
                // build query with the old year i.e. 1900
                if (startMonth != '12') {
                    querytextAnniversary += hireDate + ">" + startMonth + '-' + startDay + '-1900 AND ' + hireDate + '<' + endMonth + '-' + endDay + '-' + endYear;
                } else {
                    querytextAnniversary += hireDate + ">" + startMonth + '-' + startDay + '-1900 OR ' + hireDate + '<' + endMonth + '-' + endDay + '-' + endYear;
                }
                var birthdayURL = webAbsoluteURL + "/_api/search/query?querytext='" + querytextBirthday + "'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'&selectproperties='Title," + birthday + ",Path,PictureURL,WorkEmail'&sortlist='" + birthday + ":ascending'";
                var AnniversaryURL = webAbsoluteURL + "/_api/search/query?querytext='" + querytextAnniversary + "'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'&selectproperties='Title," + hireDate + ",Path,PictureURL,WorkEmail'&sortlist='" + hireDate + ":ascending'";
                KPCU.FetchDatafromList(birthdayURL, "GET").then(function (data) {
                    var birthdayHtml = "";
                    var arrayBirthAnni = [];
                    var resultsBirthday = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                    arrayBirthAnni = $.map(resultsBirthday, function (item) {
                        var date = new Date(Date.parse(item.Cells.results[3].Value));
                        date.setFullYear(endYear);
                        return {
                            Date: date,
                            AnniversaryDate: "",
                            ProfileImage: "/sites/Intranet-Dev/_layouts/15/userphoto.aspx?size=L&accountname=" + item.Cells.results[6].Value,
                            BuddyName: item.Cells.results[2].Value,
                            Type: "Birthday",
                            WorkEmail: item.Cells.results[6].Value
                        }
                    });
                    KPCU.FetchDatafromList(AnniversaryURL, "GET").then(function (data) {
                        var resultsAnniversary = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                        arrayBirthAnni = $.merge($.map(resultsAnniversary, function (item) {
                            var date = new Date(Date.parse(item.Cells.results[3].Value));
                            var newArrayBirthAnni = $.grep(arrayBirthAnni, function (e) {
                                return e.WorkEmail == item.Cells.results[6].Value;
                            });
                            if ((new Date().getFullYear() - date.getFullYear()) % 5 == 0 && new Date().getFullYear() != date.getFullYear() && new Date().getDate() == date.getDate()) {
                                if (newArrayBirthAnni.length == 0) {
                                    return {
                                        Date: (new Date().getFullYear() - date.getFullYear()) + "th Anniversary",
                                        ProfileImage: "/sites/Intranet-Dev/_layouts/15/userphoto.aspx?size=L&accountname=" + item.Cells.results[6].Value,
                                        BuddyName: item.Cells.results[2].Value,
                                        Type: "Anniversary",
                                        WorkEmail: item.Cells.results[6].Value
                                    }
                                } else {
                                    newArrayBirthAnni[0].AnniversaryDate = (new Date().getFullYear() - date.getFullYear()) + "th Anniversary";
                                }
                            }
                        }), arrayBirthAnni);
                        arrayBirthAnni.sort(function (a, b) {
                            var dateA = new Date(a.Date),
                                dateB = new Date(b.Date);
                            return dateA - dateB;
                        });
                        if (arrayBirthAnni) {
                            birthdayHtml += '<div class="cauraosal"><div id="myCarousel1" class="carousel slide" data-ride="carousel"><div class="carousel-inner">';
                            var nextKey = 0;
                            $.each(arrayBirthAnni, function (key, item) {
                                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                if (key % 5 == 0) {
                                    if (key == 0) birthdayHtml += '<div class="item active">';
                                    else birthdayHtml += '<div class="item">';
                                    nextKey = key;
                                }
                                if (item.AnniversaryDate) {
                                    birthdayHtml += "<div class='col-md-2 col-sm-2 col-xs-12 bday_info text-center'><div class='bday_buddy'><img alt='" + item.BuddyName + "' src='" + item.ProfileImage + "' class='rounded-circle'><p><span class='buddy_name'>" + item.BuddyName + "</span><br />Birthday, " + months[item.Date.getMonth()] + " " + item.Date.getDate() + "<br />" + item.AnniversaryDate + "</p></div></div>";
                                } else if (item.Type == "Birthday") {
                                    birthdayHtml += "<div class='col-md-2 col-sm-2 col-xs-12 bday_info text-center'><div class='bday_buddy'><img alt='" + item.BuddyName + "' src='" + item.ProfileImage + "' class='rounded-circle'><p><span class='buddy_name'>" + item.BuddyName + "</span><br /> " + item.Type + ", " + (months[item.Date.getMonth()] + " " + item.Date.getDate()) + "</p></div></div>";
                                } else {
                                    birthdayHtml += "<div class='col-md-2 col-sm-2 col-xs-12 bday_info text-center'><div class='bday_buddy'><img alt='" + item.BuddyName + "' src='" + item.ProfileImage + "' class='rounded-circle'><p><span class='buddy_name'>" + item.BuddyName + "</span><br /> " + item.Date + "</p></div></div>";
                                }
                                if ((nextKey + 5) % 5 == 0 && (nextKey + 4) == key || key == arrayBirthAnni.length - 1) {
                                    birthdayHtml += '</div>';
                                }
                            });
                            birthdayHtml += '</div>';
                            if (arrayBirthAnni.length > 5) birthdayHtml += '<a class="left carousel-control carousel-control_left" href="#myCarousel1" data-slide="prev"><span class="fa fa-chevron-left"></span></a><a class="right carousel-control carousel-control_right" href="#myCarousel1" data-slide="next"><span class="fa fa-chevron-right"></span></a>';
                            birthdayHtml += '</div></div>';
                        } else birthdayHtml += "There are no birthdays and anniversaries for this month.";
                        $('.bday_list').html(birthdayHtml);
                    });
                });
            }
        });
    },
    //Fetch data from recognition list to show in Bravo webpart
    Bravo: function () {
        //Get data from Recognition list
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListRecognition + "')/" + "items?$expand=BravoUserName,BravoGivenBy&$select=*,BravoUserName/Id,BravoUserName/FirstName,BravoUserName/LastName,BravoUserName/JobTitle,BravoUserName/Department,BravoUserName/EMail,BravoGivenBy/FirstName,BravoGivenBy/LastName&$top=3&$orderby=Created desc";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                var bravoData = "";
                var carouselIndicatorsBravo = "";
                $.map(getData, function (item, key) {
                    var userURL = siteAbsoluteURL + "/_layouts/15/userdisp.aspx?ID=" + item.BravoUserName.Id;
                    var clsActive = (key == 0) ? "active" : "";
                    if (getData.length > 1) carouselIndicatorsBravo += "<li data-target='#myCarousel' data-slide-to='" + key + "' class='" + clsActive + "'></li>";
                    var department = (item.BravoUserName.Department == null) ? "" : item.BravoUserName.Department;
                    var jobTitle = (item.BravoUserName.JobTitle == null) ? "" : item.BravoUserName.JobTitle;
                    var firstName = (item.BravoUserName.FirstName == null) ? "" : item.BravoUserName.FirstName;
                    var lastName = (item.BravoUserName.LastName == null) ? "" : item.BravoUserName.LastName;
                    var description = item.BravoDescription; //Bravo Description column should be plain text
                    if (description.length > 200) description = description.substring(0, 200) + "...";
                    bravoData += "<div class='item " + clsActive + "'><div class='bravo_winner'>" + "<img src='" + _spPageContextInfo.siteServerRelativeUrl + "/_layouts/15/userphoto.aspx?size=L&accountname=" + item.BravoUserName.EMail + "' class='img-responsive'></div><div class='bravo_winnerinfo'>" + "<a href='" + userURL + "' target='_blank'><h3 class='winner_name'>" + firstName + " " + lastName + "</h3></a><div class='winner_jobtitle'>" + jobTitle + "</div><div class='winner_dept'> Branch: " + department + "</div></div>" + "<div><div class='bravo_for'><img src='../Style%20Library/KPCU/Images/recognition_bulb.png' class='img-responive'>" + "<h3 class='recognition'>" + item.BravoTitle + "</h3></div><div class='bravo_note'>" + description + "<br> -" + "<span class='bravo_creator'> " + item.BravoGivenBy.FirstName + " " + item.BravoGivenBy.LastName + "</span></div><div class='bravo_actions'><a href='#' class='comment'>Comment</a>" + "<a href='#' class='comment'>Say Bravo to " + firstName + "</a></div></div></div>"
                });
                $(".bravo_section").html(bravoData);
                $(".carousel-indicators-bravo").html(carouselIndicatorsBravo);
            }
        });
    },
    //This mechanism is used for Emergency Ticker. If ticker is closed by user then save this action in cache and dont show ticker again for that user
    Cache: (function () {
        /*
         * Sets local storage cache with the key/value pair and expiration.
         * @param {string} cacheKey - Cache key.
         * @param {object} cacheValue - Cache value.
         * @param {number} expirationMin - Expiration (In minutes).
         */
        function setCache(cacheKey, cacheValue, expirationMins) {
            var record, expirationMs;
            if (cacheKey && cacheValue) {
                try {
                    cacheKey = getStorageKey(cacheKey);
                    expirationMs = expirationMins ? (parseInt(expirationMins) * 60 * 1000) : null;
                    record = {
                        value: JSON.stringify(cacheValue),
                        timestamp: expirationMs ? (new Date().getTime() + expirationMs) : null
                    };
                    localStorage.setItem(cacheKey, JSON.stringify(record));
                } catch (e) {
                    KPCU.ClientLog(e.message);
                }
            }
        }
        /*
         * Gets local storage cache value using the cache key.
         * @param {string} cacheKey - Cache key.
         */
        function getCache(cacheKey) {
            var record;
            if (cacheKey) {
                try {
                    cacheKey = getStorageKey(cacheKey);
                    record = tryParseJSON(localStorage.getItem(cacheKey));
                    if (record) {
                        if (record.timestamp) {
                            if (new Date().getTime() < record.timestamp) {
                                record = tryParseJSON(record.value);
                            } else {
                                record = null;
                                localStorage.removeItem(cacheKey);
                            }
                        } else {
                            record = tryParseJSON(record.value);
                        }
                    }
                } catch (e) {
                    KPCU.ClientLog(e.message);
                }
            }
            return record;
        }

        function getStorageKey(key) {
            return (siteAbsoluteURL.replace(/\W/g, "") + _spPageContextInfo.userLoginName.replace(/\W/g, "") + key).toLowerCase();
        }

        function tryParseJSON(value) {
            return jQuery.parseJSON(value);
        }
        return {
            SetCache: setCache,
            GetCache: getCache
        };
    })(),
    //This will logs the messages in browser console
    //message: Message to show in console
    ClientLog: function (message) {
        if (typeof console !== "undefined" && typeof message !== "undefined") {
            console.log(message);
        }
    },
    //Used for home page nad department page carousels
    //checkPage: Name of the page
    Carousel: function (checkPage) {
        var owl = $('.owl-carousel');
        if (owl.length > 0) //Check if class present
        {
            owl.owlCarousel({
                loop: true,
                nav: true,
                margin: 10,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    960: {
                        items: 3
                    },
                    1200: {
                        items: checkPage == "Home" ? 4 : 3 //If home page then show 4 images otherwise show 3 images (department page).
                    }
                }
            });
            owl.on('mousewheel', '.owl-stage', function (e) {
                if (e.deltaY > 0) {
                    owl.trigger('next.owl');
                } else {
                    owl.trigger('prev.owl');
                }
                e.preventDefault();
            });
        }
    },
    //This will fetch data from ContactsAndCommitments list for ContactsAndCommitments webpart
    ContactsAndCommitment: function () {
        //Get data from contacts and commitments list
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListContactsAndCommitments + "')/GetItems(query=@v1)?@v1={'ViewXml':'<View><Query></Query><RowLimit>1000</RowLimit></View>'}";
        KPCU.FetchDatafromList(query, "POST").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                var arrayAllItems = [];
                var uniqueSubjectArray = [];
                arrayAllItems = $.map(getData, function (item) {
                    if ($.inArray(item.KPCUSubject && item.KPCUSubject.Label, uniqueSubjectArray) == -1) {
                        uniqueSubjectArray.push(item.KPCUSubject.Label);
                    }
                    return {
                        Subject: item.KPCUSubject && item.KPCUSubject.Label ? item.KPCUSubject.Label : "",
                        Topic: item.Topic && item.Topic.Label ? item.Topic.Label : "",
                        Procedure: item.Procedure ? item.Procedure : "",
                        Commitment: item.Commitment ? item.Commitment : "",
                        Escalation: item.Escalation ? item.Escalation : ""
                    }
                });
                var buildPopUps = "";
                $.map(uniqueSubjectArray, function (item, key) {
                    var innerArray = $.grep(arrayAllItems, function (value) {
                        return value.Subject == item;
                    })
                    var createLI = "";
                    //Added inner array to show all topics under subjects ----- Added popup for each topic.
                    $.map(innerArray, function (itemInner, keyInner) {
                        if (itemInner.Topic) {
                            createLI += "<li>" + "<a href='#' data-toggle='modal' title='Popover Header' data-target='#PopUp" + key + keyInner + "' data-content='Some content inside the popover'>" + itemInner.Topic + "</a>" + "</li>";
                            buildPopUps += "<div id='PopUp" + key + keyInner + "' class='modal fade' role='dialog'>" + "<div class='modal-wrapper'>" + "<div class='modal-dialog'>" + "<div class='modal-content'>" + "<div class='modal-header text-center'>" + "<button type='button' class='close' data-dismiss='modal'>&times;</button>" + "<h4 class='modal-title'>Contacts and Commitments</h4>" + "</div>" + "<div class='modal-body contactscommitemtsPopUp'>" + "<table><tr><th>Subject</th><th>Topic</th><th>Procedure</th><th>Commitment</th><th>Escalation</th></tr>" + "<tr><td>" + itemInner.Subject + "</td><td>" + itemInner.Topic + "</td><td>" + itemInner.Procedure + "</td><td>" + itemInner.Commitment + "</td><td>" + itemInner.Escalation + "</td></tr></table>" + "</div>" + "<div class='modal-footer'>" + "<button type='button' class='btn btn-red' data-dismiss='modal'>Close</button>" + "</div>" + "</div>" + "</div>" + "</div>" + "</div>";
                        }
                    });
                    //This will add all subjects
                    strContactAndCommitmentItem += "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'>" + "<a class='accordion-toggle collapsed' data-toggle='collapse' data-parent='#contactscommitemtsRow' href='#ContactsAndCommitments" + key + "'>" + item + "</a>" + "</h4>" + "</div>" + "<div id='ContactsAndCommitments" + key + "' class='panel-collapse collapse'>" + "<div class='panel-body'>" + "<ul class='commitment_list'>" + createLI + "</ul>" + "</div>" + "</div>" + "</div>";
                });
                $("#contactscommitemtsRow").append(strContactAndCommitmentItem);
                $(".contacts-wrapper").append(buildPopUps);
                $('.contactscommitemtsPopUp').slimScroll({
                    alwaysVisible: true
                });
            }
        });
    },
    //Used to modify date format
    //date: Value in date format. 
    DateFormat: function (date) {
        return date ? new Date(date).format('MMM dd, yyyy') : "";
    },
    //Used to Delete list item
    //listItemId: List Item ID.
    DeleteQuickLinkListItem: function (listItemId) {
        $("#deleteLinkButton").attr("disabled", "disabled");
        try {
            clientContext = new SP.ClientContext(siteAbsoluteURL);
            var oList = clientContext.get_web().get_lists().getByTitle(KPCU.ListName.spListMyShortcuts);
            var oListItemDelete = oList.getItemById(listItemId);
            oListItemDelete.deleteObject();
            clientContext.executeQueryAsync(Function.createDelegate(this, function () {
                $("#editQuickLink").modal("toggle");
                KPCU.ShowToaster("Item Deleted Successfully");
                KPCU.GetMyQuickLaunch();
            }), Function.createDelegate(this, function (sender, args) {
                KPCU.ClientLog("Error on DeleteQuickLinkListItem onQueryFailedDelete : " + args.get_message());
            }));
        } catch (error) {
            KPCU.ClientLog("Error in DeleteQuickLinkListItem: " + JSON.stringify(error.message));
        }
    },
    //Used to Edit list item
    //listItemId: List Item ID.
    EditQuickLinkListItem: function (listItemId) {
        if (KPCU.ValidateQuickLinkItem("Edit")) return false;
        else {
            $("#editLinkButton").attr("disabled", "disabled");
            try {
                clientContext = new SP.ClientContext(siteAbsoluteURL);
                var oList = clientContext.get_web().get_lists().getByTitle(KPCU.ListName.spListMyShortcuts);
                var oListItemUpdate = oList.getItemById(listItemId);
                oListItemUpdate.set_item('Title', $("#quickLinkTitleBoxEdit").val());
                oListItemUpdate.set_item('LinkURL', $("#quickLinkURLBoxEdit").val());
                oListItemUpdate.set_item('OpenInNewTab', document.getElementById("quickLinkOpenInNewTabEdit").checked);
                oListItemUpdate.update();
                clientContext.executeQueryAsync(Function.createDelegate(this, function () {
                    $("#editQuickLink").modal("toggle");
                    KPCU.ShowToaster("Item Updated Successfully");
                    KPCU.GetMyQuickLaunch();
                }), Function.createDelegate(this, function (sender, args) {
                    KPCU.ClientLog("Error on EditQuickLinkListItem onQueryFailedEdit : " + args.get_message());
                }));
            } catch (error) {
                KPCU.ClientLog("Error in EditQuickLinkListItem : " + JSON.stringify(error.message));
            }
        }
    },
    //This will fetch data from EmergencyTicker List. This ticker will appear on top of master page
    EmergencyTicker: function () {
        //Get latest item from emergency ticker list 
        var today = new Date();
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListEmergencyTicker + "')/items?$expand=TaxCatchAll/Term&$filter=EmergencyTickerPublishedDate lt datetime'" + today.toISOString() + "' and Expires gt datetime'" + today.toISOString() + "'&$select=*,TaxCatchAll/Term&$orderby=Modified desc";
        //GetItems(query=@v1)?@v1={'ViewXml':'<View><Query><Where><And><Leq><FieldRef Name=\"EmergencyTickerPublishedDate\" /><Value Type=\"DateTime\"><Today /></Value></Leq><Geq><FieldRef Name=\"Expires\" /><Value Type=\"DateTime\"><Today /></Value></Geq></And></Where><OrderBy><FieldRef Name=\"Modified\" Ascending=\"False\" /></OrderBy></Query></View>'}";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                //Set data to emergency ticker values
                chkEmergencyTicker = true;
                var emergencyTickerHtml = "";
                var classActive = "";
                var emergencyTitle = "";
                var emergencyDepartment = "";
                $.map(getData, function (item, key) {
                    emergencyTitle = item.Title ? item.Title : "";
                    emergencyDepartment = item.TaxCatchAll.results.length > 0 ? "<li>" + item.TaxCatchAll.results[0].Term + "</li>" : ""
                    if (key == 0) classActive = "active";
                    else classActive = "";
                    emergencyTickerHtml += "<div class='item " + classActive + "'><ul><li>" + emergencyTitle + "</li>" + emergencyDepartment + "<li>" + KPCU.DateFormat(item.EmergencyTickerPublishedDate) + "</li></ul></div>"
                });
                //If tickers are more than 1 then show prev next buttons
                if (getData.length > 1) $("#myCarousel .arrow_container").removeClass("hide");
                $("#emergencyTickerContent").html(emergencyTickerHtml);
            }
            //Cache added for emergency ticker
            var getCache = KPCU.Cache.GetCache("Notification" + _spPageContextInfo.userId);
            var getCacheetTitle = KPCU.Cache.GetCache("etTitle");
            var getCacheetDepartment = KPCU.Cache.GetCache("etDepartment");
            var getCacheetDate = KPCU.Cache.GetCache("etDate");
            //If user has closed emergency ticker then hide it 
            if (chkEmergencyTicker) {
                //if (getCache == "Closed") && getCacheetTitle == $("#etTitle").text() && getCacheetDepartment == $("#etDepartment").text() && getCacheetDate == $("#etDate").text()) {
                //    $(".notification_wrapper").addClass("hide");
                //    $(".notification_wrapper").fadeOut(200);
                //} else {
                $(".notification_wrapper").removeClass("hide");
                $(".notification_wrapper").fadeIn(200);
                //}
                if ($(".notification_wrapper").is(':visible')) {
                    //If user closes emergency ticker then set cache for 1 day
                    $("#closeNotificationInner").click(function () {
                        KPCU.Cache.SetCache("Notification" + _spPageContextInfo.userId, "Closed", 0);
                        KPCU.Cache.SetCache("etTitle", $("#etTitle").text(), 0);
                        KPCU.Cache.SetCache("etDepartment", $("#etDepartment").text(), 0);
                        KPCU.Cache.SetCache("etDate", $("#etDate").text(), 0);
                    });
                    $(".close_notification a").click(function () {
                        $(".notification_strip").fadeOut(200);
                    });
                }
            }
        });
    },
    //To fetch data from list using REST
    //siteURL: Site URL
    //listName: Name of the List
    //strQuery: REST query used for list
    FetchDatafromList: function (queryURL, queryType, asyncValue) {
        var deferred = $.Deferred();
        asyncValue = asyncValue || false;
        try {
            $.ajax({
                url: queryURL,
                type: queryType,
                cache: false,
                async: asyncValue,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (xhr, status, error) {
                    KPCU.ClientLog("Error in KPCU_Main.js KPCU.FetchDatafromList Inner : " + JSON.stringify(xhr.responseText));
                    deferred.reject(xhr.responseText);
                }
            });
        } catch (error) {
            KPCU.ClientLog("Error in KPCU_Main.js KPCU.FetchDatafromList : " + JSON.stringify(error.message));
            deferred.reject(error);
        }
        return deferred.promise();
    },
    // Get List Item Type metadata
    GetItemTypeForListName: function (name) {
        return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
    },
    //This is used to fetch my quick links from MyShortcuts list
    GetMyQuickLaunch: function () {
        var createLinks = "";
        //Get all my links in alphabetical order using title
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListMyShortcuts + "')/items?$filter=MyShortcutsOwner/EMail eq '" + _spPageContextInfo.userEmail + "'&$select=Id,LinkURL,Title,OpenInNewTab&$orderby=Title asc&$top=33";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            quickLinksCount = getData.length;
            if (quickLinksCount >= 32) {
                $("#btnMyQuickLaunchMenuAddLink").removeAttr("data-toggle");
                $("#btnMyQuickLaunchMenuAddLink").addClass("low_opacity");
                $("#btnMyQuickLaunchMenuAddLink").attr("title", "You can add only 32 links");
            } else {
                $("#btnMyQuickLaunchMenuAddLink").attr("data-toggle", "modal");
                $("#btnMyQuickLaunchMenuAddLink").removeClass("low_opacity");
                $("#btnMyQuickLaunchMenuAddLink").removeAttr("title");
            }
            if (quickLinksCount > 0) {
                $("#btnMyQuickLaunchMenuEditLink").removeClass("hide");
            } else {
                $("#btnMyQuickLaunchMenuEditLink").addClass("hide");
            }
            if (quickLinksCount > 0) {
                var nextKey = 0;
                $.map(getData, function (item, key) {
                    var targetBlank = "";
                    if (item.OpenInNewTab) targetBlank = "target='_blank'";
                    if (key % 8 == 0) {
                        createLinks += "<li><ul>";
                        nextKey = key;
                    }
                    createLinks += "<li><a href='" + item.LinkURL.Url + "' " + targetBlank + ">" + item.Title + "</a><span class='editIcon hide' id='" + item.Id + "'><i class='fa fa-pencil'></i></span></li>";
                    if ((nextKey + 8) % 8 == 0 && (nextKey + 7) == key || key == getData.length - 1) {
                        createLinks += "</ul></li>";
                    }
                });
                $('#' + myKPCUID + ' li:not(:last-child)').remove();
                $("#myQuickLaunchMenu").before(createLinks);
                $('.editIcon').click(function () {
                    $("#deleteLinkButton").removeAttr("disabled");
                    $("#editLinkButton").removeAttr("disabled");
                    var itemID = $(this).attr("id");
                    var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListMyShortcuts + "')/" + "items?$filter=Id eq " + $(this).attr("id") + "&$top=1";
                    KPCU.FetchDatafromList(query, "GET").then(function (getData) {
                        getData = getData.d.results;
                        if (getData.length > 0) {
                            $("#quickLinkTitleBoxEdit").val(getData[0].Title);
                            $("#quickLinkURLBoxEdit").val(getData[0].LinkURL.Url);
                            $("#quickLinkOpenInNewTabEdit").prop('checked', getData[0].OpenInNewTab);
                            $('#editQuickLink').modal('toggle');
                            $('#editLinkButton').attr('onClick', 'KPCU.EditQuickLinkListItem(' + itemID + ');');
                            $('#deleteLinkButton').attr('onClick', 'KPCU.DeleteQuickLinkListItem(' + itemID + ');');
                        }
                    });
                });
                $('#btnMyQuickLaunchMenuAddLink').click(function () {
                    $("#addLinkButton").removeAttr("disabled");
                    $("#quickLinkURLBoxAdd").val("http://");
                    $("#quickLinkTitleBoxAdd").val("");
                    $('#quickLinkOpenInNewTabAdd').prop('checked', false);
                });
            } else {
                $('#' + myKPCUID + ' li:not(:last-child)').remove();
                $("#myQuickLaunchMenu").before(createLinks);
            }
        });
    },
    //Used to get site URL if it is stored in different site collection
    GetSiteURLForMultipleSiteCollection: function () {
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListConfiguration + "')/" + "items?$filter=KPCUKey eq 'SiteURL'&$select=KPCUKey,KPCUValue&$top=1";
        KPCU.FetchDatafromList(query, "GET", true).then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                siteAbsoluteURL = getData[0].KPCUValue;
            }
            //It is used to show carousel on home page
            KPCU.GlobalNavigationLinks();
            $("#Ticker").load("/sites/Intranet-Dev/_catalogs/masterpage/KPCU/Menu/EmergencyTicker.html");
        });
    },
    //Used to fecth termsets
    //termSetID: Term set ID
    GetTermSets: function (termSetID) {
        var deferred = $.Deferred();
        //Current Context
        var context = SP.ClientContext.get_current();
        //Current Taxonomy Session
        var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
        //Term Stores
        var termStores = taxSession.get_termStores();
        //Name of the Term Store from which to get the Terms.
        var termStore = termStores.getByName("Taxonomy_TeJaHMTszzDcpSE8SqeJYw==");
        //GUID of Term Set from which to get the Terms.
        var termSet = termStore.getTermSet(termSetID);
        var terms = termSet.getAllTerms();
        context.load(terms);
        context.executeQueryAsync(function () {
            var termEnumerator = terms.getEnumerator();
            while (termEnumerator.moveNext()) {
                allTermValues.push(termEnumerator.get_current().get_name());
            }
            deferred.resolve(allTermValues);
        }, function (sender, args) {
            KPCU.ClientLog(args.get_message());
            deferred.reject(args.get_message());
        });
        return deferred.promise();
    },
    //This is used to load user profile properties
    GetUserProperties: function (userName) {
        var userProfileProperties = "";
        var user = userName;
        if (userName.indexOf("|") >= 0) {
            userName = userName.split("|");
            user = userName[2];
        }
        user = "i%3A0%23.f" + "|" + userName[1] + "|" + userName[2];
        var siteURL = webAbsoluteURL + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + user + "'";
        $.ajax({
            url: siteURL,
            method: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            },
            async: false,
            success: function (data) {
                userProfileProperties = data.d;
            },
            error: function (error) { }
        });
        return userProfileProperties;
    },
    //This is used to show global navigation links
    GlobalNavigationLinks: function () {
        var createLinks = "<ul>";
        var Level1Arr = [],
            Level2Arr = [],
            Level3Arr = [];
        //Get data from Global Navigation Links list
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListGlobalNavigationLinks + "')/" + "items?$filter=KPCUIsActive eq 1&$expand=Parent&$select=*,Parent/Title&$orderby=Title asc&$top=1000";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            var globalLinksCount = getData.length;
            if (globalLinksCount > 0) {
                $.map(getData, function (item) {
                    if (item.Level == "Level 1")
                        //Add first level items in array Level1Arr
                        Level1Arr.push({
                            Title: item.Title,
                            Sequence: item.Sequence
                        });
                    if (item.Level == "Level 2")
                        //Add second level items in array Level2Arr
                        Level2Arr.push({
                            Title: item.Title,
                            Sequence: item.Sequence,
                            Parent: item.Parent.Title
                        });
                    if (item.Level == "Level 3")
                        //Add third level items in array Level3Arr
                        Level3Arr.push({
                            Title: item.Title,
                            Sequence: item.Sequence,
                            Parent: item.Parent.Title,
                            URL: item.LinkURL ? item.LinkURL.Url : '',
                            OpenInNewTab: item.OpenInNewTab
                        });
                });
                //Arrays should be sorted using sequence number mentioned in list 
                Level1Arr.sort(function (a, b) {
                    return a.Sequence - b.Sequence
                });
                //Use below arrays to store new values
                var arrayMenuItemsLevel2 = [];
                var arrayMenuItemsLevel3 = [];
                //Traverse throuth first array (Level1Arr) to show first level values
                $.map(Level1Arr, function (item, key) {
                    //Get the menu items from second array which are childs of first array and sort that array using sequence number           
                    arrayMenuItemsLevel2 = findMenuItems(item.Title, Level2Arr).sort(function (a, b) {
                        return a.Sequence - b.Sequence
                    });
                    if (item.Title === "My KPCU") myKPCUID = item.Title.replace(/ /g, '') + '-menu';
                    createLinks += "<li><a href='javascript:;'>" + item.Title + "</a><div id='" + item.Title.replace(/ /g, '') + "-menu'>";
                    if (arrayMenuItemsLevel2.length > 0) {
                        createLinks += "<ul>";
                        //Traverse throuth second array (Level2Arr) to show second level values
                        $.map(arrayMenuItemsLevel2, function (item, key) {
                            //Get the menu items from third array which are childs of second array and sort that array using sequence number
                            arrayMenuItemsLevel3 = findMenuItems(item.Title, Level3Arr).sort(function (a, b) {
                                return a.Sequence - b.Sequence
                            });
                            createLinks += "<li><span class='menu_name'>" + item.Title + "</span>";
                            if (arrayMenuItemsLevel3.length > 0) {
                                createLinks += "<ul>";
                                //Traverse throuth third array (Level3Arr) to show third level values
                                $.map(arrayMenuItemsLevel3, function (item, key) {
                                    if (key != 0 && key % 12 == 0) createLinks += "</ul></li><li><ul style='margin-top:32px'>";
                                    var openTab = item.OpenInNewTab == true ? '_blank' : '';
                                    createLinks += "<li><a href='" + item.URL + "' target='" + openTab + "'>" + item.Title + "</a></li>";
                                });
                                createLinks += "</ul>";
                            }
                            createLinks += "</li>";
                        });
                        createLinks += "</ul>";
                    } else {
                        createLinks += "<ul></ul>";
                    }
                    createLinks += "</div>";
                });
                createLinks += "</ul>";
                $(".menu").append(createLinks);
                //Note : MyKPCU should be second last item in menu bar. According to this we are binding below MyKPCU links.                
                //Append MyKPCU links
                //myKPCUID = "parentMenuItem-"+(Level1Arr.length-2).toString();
                $("#" + myKPCUID).load("/sites/Intranet-Dev/_catalogs/masterpage/KPCU/Menu/MyKPCU.html");
                //Used for mega menu global navigation
                KPCU.MegaMenuDropdown();
            }
        });

        function findMenuItems(menuTitle, arrayName) {
            return $.grep(arrayName, function (n, i) {
                return n.Parent == menuTitle;
            });
        };
    },
    //Update CSS of left navigation apperas in department sites
    HideShowLeftNavMenu: function () {
        if ($("#sideNavBox").length > 0) {
            $("#sideNavBox .ms-core-listMenu-root li ul").hide();
            $("#sideNavBox .ms-core-listMenu-root li").each(function (index) {
                if ($(this).has("ul").length > 0) {
                    $(this).addClass("has-sub-menu" + index);
                    $(this).find("ul").addClass("toggle-sub-menu" + index);
                    $(this).find("ul").addClass("toggle-all");
                    $(".has-sub-menu" + index).click(function () {
                        var currentClass = "toggle-sub-menu" + index;
                        $(".toggle-all").map(function () {
                            if ($(this).hasClass("show_menu") && !$(this).hasClass(currentClass)) $(this).siblings().next().removeClass("show_menu");
                        });
                        $(".toggle-sub-menu" + index).toggleClass("show_menu");
                    });
                }
            });
        }
    },
    //Check if my quick links is valid URL
    IsValidUrl: function (url) {
        var myVariable = url;
        if (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(myVariable)) {
            return true;
        } else {
            return false;
        }
    },
    //This function is used to load key contacts
    KeyContacts: function () {
        //Get data from Quick Links
        var query = webAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListKeyContacts + "')/items?$expand=KeyContactUserName&$select=*,KeyContactUserName/Id,KeyContactUserName/FirstName,KeyContactUserName/LastName,KeyContactUserName/JobTitle,KeyContactUserName/Department,KeyContactUserName/EMail&$top=4&$orderby=Sequence asc";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            var strQuickLinksItem = "";
            getData = getData.d.results;
            if (getData.length > 0) {
                var keyContactsHTML = "";
                $.map(getData, function (item, key) {
                    var pictureURL = _spPageContextInfo.siteServerRelativeUrl + "/_layouts/15/userphoto.aspx?size=L&accountname=" + item.KeyContactUserName.EMail;
                    var userURL = siteAbsoluteURL + "/_layouts/15/userdisp.aspx?ID=" + item.KeyContactUserName.Id;
                    var keyContactUserName = item.KeyContactUserName.FirstName + " " + item.KeyContactUserName.LastName;
                    var department = (item.KeyContactUserName.Department == null) ? "" : item.KeyContactUserName.Department;
                    var jobTitle = (item.KeyContactUserName.JobTitle == null) ? "" : item.KeyContactUserName.JobTitle + ",";
                    keyContactsHTML += "<div class='news_list'><div class='news_image'><img src=" + pictureURL + "></div><a href='" + userURL + "' target='_blank'><h3 class='name'>" + keyContactUserName + "</h3></a><div class='keycontact_info'>" + jobTitle + "</div><div class='keycontact_info'>" + department + "</div></div>"
                });
                $(".keycontacts_card").append(keyContactsHTML);
            }
        });
    },
    //This is used to fetch data from KPIs list
    KPIs: function () {
        //Get data from KPI list
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListKPI + "')/items?$select=KPCUValue,Title&$top=3&$orderby=Created desc";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                var KPIHtml = "";
                var KPIValue = "";
                var KPITitle = "";
                $.map(getData, function (item) {
                    KPIValue = item.KPCUValue ? item.KPCUValue : "";
                    KPITitle = item.Title ? item.Title : "";
                    KPIHtml += "<div class='col-md-4 col-sm-4 col-xs-12'><div class='main_points'><div class='mainpoint_heading blue'>" + KPIValue + "</div><div class='mainpoint_heading kpis_title gray'>" + KPITitle + "</div></div></div>";
                });
                $(".kpis").html(KPIHtml);
            }
        });
    },
    //List names
    ListName: {
        spListContactsAndCommitments: "Contacts And Commitments",
        spListKPI: "KPI",
        spListStarIncentive: "Star Incentive",
        spListExecutiveCorner: "Executive Corner",
        spListRecognition: "Recognition",
        spListNewJoinee: "New Joinee",
        spListEmergencyTicker: "Emergency Ticker",
        spListKeyContacts: "Key Contacts",
        spListMyShortcuts: "My Shortcuts",
        spListProjects: "Project Details",
        spListGlobalNavigationLinks: "Global Navigation Links",
        spListConfiguration: "Configuration",
        spListQuickLinks: "Quick Links"
    },
    //Load department banner used on department home page
    LoadDepartmentBanner: function () {
        //Get data from KPI list
        var query = webAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListConfiguration + "')/items?$filter=KPCUKey eq 'Image'&$select=KPCUKey,KPCUValue,KPCUDescription,Title&$top=1";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                var banneImage = getData[0].KPCUValue;
                var kpcuDesp = "";
                document.getElementById("bannerimage").style.backgroundImage = "url('" + banneImage + "')";
                //$("#bannerimage").attr("src", getData[0].Value);
                $("#BannerHeading").append(getData[0].Title);
                var kpcuDescription = getData[0].KPCUDescription;
                if (kpcuDescription && kpcuDescription.length > 300) {
                    kpcuDesp = kpcuDescription.substring(0, 300) + "… ";
                } else {
                    kpcuDesp = kpcuDescription == "null" ? "" : kpcuDescription;
                }
                $("#BannerDescription").append(kpcuDesp);
            }
        });
    },
    //Mega menu hover behaviour
    MegaMenuDropdown: function () {
        $('.menu > ul > li:has( > div > ul)').addClass('menu-dropdown-icon');
        //Checks if li has sub (ul) and adds class for toggle icon - just an UI		
        $('.menu > ul > li > ul:not(:has(> div> ul))').addClass('normal-sub');
        //Checks if drodown menu's li elements have anothere level (ul), if not the dropdown is shown as regular dropdown, not a mega menu (thanks Luka Kladaric)	
        $(".menu > ul").before("<a href=\"#\" class=\"menu-mobile\"></a>");
        //Adds menu-mobile class (for mobile toggle menu) before the normal menu
        //Mobile menu is hidden if width is more then 959px, but normal menu is displayed
        //Normal menu is hidden if width is below 959px, and jquery adds mobile menu
        //Done this way so it can be used with wordpress without any trouble	
        $(".menu > ul > li").hover(function (e) {
            $(".editIcon").addClass("hide");
            if ($(window).width() > 943) {
                $(this).children("div").children("ul").addClass("show_menu");
                e.preventDefault();
            }
        }, function (e) {
            if ($(window).width() > 943) {
                $(this).children("div").children("ul").removeClass("show_menu");
                e.preventDefault();
            }
        });
        //If width is more than 943px dropdowns are displayed on hover	
        $(".menu > ul > li").click(function () {
            if ($(window).width() < 943) {
                $(this).children("div").children("ul").fadeToggle(150);
            }
        });
        //If width is less or equal to 943px dropdowns are displayed on click (thanks Aman Jain from stackoverflow)	
        $(".menu-mobile").click(function (e) {
            $(".menu > ul").toggleClass('show-on-mobile');
            e.preventDefault();
        });
        //when clicked on mobile-menu, normal menu is shown as a list, classic rwd menu story (thanks mwl from stackoverflow)
    },
    //Fetch data from NewJoinee list to show new joinees
    NewJoinee: function () {
        //Get data from New Joinee list
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListNewJoinee + "')/" + "items?$expand=NewJoineeUsername&$select=*,NewJoineeUsername/Id,NewJoineeUsername/FirstName,NewJoineeUsername/LastName,NewJoineeUsername/JobTitle,NewJoineeUsername/Department,NewJoineeUsername/EMail&$top=3&$orderby=Created desc";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                var newJoineeData = "";
                var carouselIndicatorsNewJoinee = "";
                $.map(getData, function (item, key) {
                    var userURL = siteAbsoluteURL + "/_layouts/15/userdisp.aspx?ID=" + item.NewJoineeUsername.Id;
                    var clsActive = (key == 0) ? "active" : "";
                    if (getData.length > 1) carouselIndicatorsNewJoinee += "<li data-target='#myCarousel1' data-slide-to='" + key + "' class='" + clsActive + "'></li>";
                    var department = (item.NewJoineeUsername.Department == null) ? "" : item.NewJoineeUsername.Department;
                    var jobTitle = (item.NewJoineeUsername.JobTitle == null) ? "" : item.NewJoineeUsername.JobTitle;
                    var firstName = (item.NewJoineeUsername.FirstName == null) ? "" : item.NewJoineeUsername.FirstName;
                    var lastName = (item.NewJoineeUsername.LastName == null) ? "" : item.NewJoineeUsername.LastName;
                    var description = item.KPCUDescription; //Description column should be plain text
                    if (description.length > 400) description = description.substring(0, 400) + "...";
                    newJoineeData += "<div class='item " + clsActive + "'><div class='bravo_winner'>" + "<img src='" + _spPageContextInfo.siteServerRelativeUrl + "/_layouts/15/userphoto.aspx?size=L&accountname=" + item.NewJoineeUsername.EMail + "' class='img-responsive'></div><div class='newjoinee_box'>" + "<a href='" + userURL + "' target='_blank'><div class='newjoinee_name'>" + firstName + " " + lastName + "</div></a><div class='newjoinee_designation'>" + jobTitle + "</div><div class='newjoinee_branch'> Branch: " + department + "</div><div class='newjoinee_email'>" + item.NewJoineeUsername.EMail + "</div></div><div><div class='bravo_note'>" + description + "</div></div></div>"
                });
                $(".newJoinee_section").html(newJoineeData);
                $(".carousel-indicators-newJoinee").html(carouselIndicatorsNewJoinee);
            }
        });
    },
    //This function used to open links in modal dialog
    OpenInDialog: function (url, title) {
        var options = SP.UI.$create_DialogOptions();
        options.url = url;
        options.title = title;
        options.dialogReturnValueCallback = Function.createDelegate(null, null);
        SP.UI.ModalDialog.showModalDialog(options);
    },
    OpenInModalNewProjectRequest: function () {
        if ($(".menu-item-text").length > 0) {
            $(".menu-item-text").each(function () {
                if ($(this).text() == "New Project Request") {
                    var projectNewHref = "javascript:KPCU.OpenInDialog('" + $(this).parent().parent().attr("href") + "', 'New Project Request Form')";
                    $(this).parent().parent().attr("href", projectNewHref);
                    return false;
                }
            });
        }
    },
    //Picture library js init point which is used in department sites
    PictureLibraryCarousel: function () {
        if ($(".fancybox-thumbs").length > 0) {
            $('.fancybox-thumbs').fancybox({
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                arrows: true,
                nextClick: true,
                helpers: {
                    thumbs: {
                        width: 50,
                        height: 50
                    }
                }
            });
        }
    },
    //Project Hub Init function
    ProjectHubInit: function () {
        $("a.show_all_pro").click(function () {
            $(".searched_ontrack").parent().removeClass("hide_card");
            $(".searched_critical").parent().removeClass("hide_card");
            $(".searched_caution").parent().removeClass("hide_card");
        });
        $("a.show_ontrack_pro").click(function () {
            $(".searched_ontrack").parent().removeClass("hide_card");
            $(".searched_critical").parent().addClass("hide_card");
            $(".searched_caution").parent().addClass("hide_card");
        });
        $("a.show_caution_pro").click(function () {
            $(".searched_caution").parent().removeClass("hide_card");
            $(".searched_ontrack").parent().addClass("hide_card");
            $(".searched_critical").parent().addClass("hide_card");
        });
        $("a.show_critical_pro").click(function () {
            $(".searched_critical").parent().removeClass("hide_card");
            $(".searched_ontrack").parent().addClass("hide_card");
            $(".searched_caution").parent().addClass("hide_card");
        });
        $(".change_view a i.fa.fa-list-ul").click(function () {
            $(".change_view a i.fa.fa-list-ul").hide(50);
            $(".change_view a i.fa.fa-table").show(50);
            $(".card_wrapper").hide(50);
            $(".strip_wrapper").show(50);
        });
        $(".change_view a i.fa.fa-table").click(function () {
            $(".change_view a i.fa.fa-table").hide(50);
            $(".change_view a i.fa.fa-list-ul").show(50);
            $(".card_wrapper").show(50);
            $(".strip_wrapper").hide(50);
        });
    },
    //This is used to fetch data from project site 
    ProjectSiteProjectInformation: function () {
        var query = webAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListProjects + "')/" + "items?$expand=ProjectSponsorer,ProjectManager&$select=*,ProjectSponsorer/FirstName,ProjectSponsorer/LastName,ProjectManager/Id,ProjectManager/FirstName,ProjectManager/LastName&$orderby=Created desc&$top=1";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                var dashboardHtml = "";
                $.map(getData, function (item) {
                    var projectOnTargetClassName = "ontrack_projects";
                    var projectAtRiskClassName = "caution_projects";
                    var projectHighRiskClassName = "critical_projects";
                    var strOnTarget = "On Target";
                    var strAtRisk = "At Risk";
                    var strHighRisk = "High Risk";
                    var project_sponsorer = (item.ProjectSponsorer.FirstName ? item.ProjectSponsorer.FirstName : "") + " " + (item.ProjectSponsorer.LastName ? item.ProjectSponsorer.LastName : "");
                    var project_manager = (item.ProjectManager.FirstName ? item.ProjectManager.FirstName : "") + " " + (item.ProjectManager.LastName ? item.ProjectManager.LastName : "");
                    $("#ps_project_name").html(item.ProjectName ? item.ProjectName : "");
                    $("#ps_project_desc").html(item.KPCUDescription ? item.KPCUDescription : "");
                    $("#ps_project_sponsorer").html(project_sponsorer);
                    $("#ps_project_manager").html(project_manager);
                    $("#ps_project_startdate").html(KPCU.DateFormat(item.ProjectStartDate));
                    $("#ps_project_enddate").html(KPCU.DateFormat(item.ProjectEndDate));
                    $("#ps_project_budget").html(item.ProjectBudget ? "$" + item.ProjectBudget : "");
                    if (item.ProjectTimeSchedule && item.ProjectTimeSchedule == strOnTarget) {
                        $("#circleClrTimeScheduleProjects").addClass(projectOnTargetClassName);
                    } else if (item.ProjectTimeSchedule && item.ProjectTimeSchedule == strAtRisk) {
                        $("#circleClrTimeScheduleProjects").addClass(projectAtRiskClassName);
                    } else if (item.ProjectTimeSchedule && item.ProjectTimeSchedule == strHighRisk) {
                        $("#circleClrTimeScheduleProjects").addClass(projectHighRiskClassName);
                    }
                    if (item.ProjectRisks && item.ProjectRisks == strOnTarget) {
                        $("#circleClrRisksProjects").addClass(projectOnTargetClassName);
                    } else if (item.ProjectRisks && item.ProjectRisks == strAtRisk) {
                        $("#circleClrRisksProjects").addClass(projectAtRiskClassName);
                    } else if (item.ProjectRisks && item.ProjectRisks == strHighRisk) {
                        $("#circleClrRisksProjects").addClass(projectHighRiskClassName);
                    }
                    if (item.ProjectResources && item.ProjectResources == strOnTarget) {
                        $("#circleClrResourcesProjects").addClass(projectOnTargetClassName);
                    } else if (item.ProjectResources && item.ProjectResources == strAtRisk) {
                        $("#circleClrResourcesProjects").addClass(projectAtRiskClassName);
                    } else if (item.ProjectResources && item.ProjectResources == strHighRisk) {
                        $("#circleClrResourcesProjects").addClass(projectHighRiskClassName);
                    }
                    if (item.ProjectStatus && item.ProjectStatus == strOnTarget) {
                        $("#circleClrOverallProjects").addClass(projectOnTargetClassName);
                    } else if (item.ProjectStatus && item.ProjectStatus == strAtRisk) {
                        $("#circleClrOverallProjects").addClass(projectAtRiskClassName);
                    } else if (item.ProjectStatus && item.ProjectStatus == strHighRisk) {
                        $("#circleClrOverallProjects").addClass(projectHighRiskClassName);
                    } else {
                        $("#circleClrOverallProjects").addClass(projectOnTargetClassName);
                    }
                    $("#statusOverallProjects").html(item.ProjectStatus);
                    if (item.ProjectManager.Id == _spPageContextInfo.userId) {
                        var projectEditURL = 'javascript:KPCU.OpenInDialog("' + webAbsoluteURL + '/Lists/Projects/EditForm.aspx?ID=' + item.Id + '","Edit Project")';
                        $("#projectEditInformation").attr("href", projectEditURL);
                        $("#projectEditInformation").removeClass("hide");
                    }
                });
                $(".card_wrapper").html(dashboardHtml);
            }
        });
    },
    //This function is used to load quick links on project site
    ProjectSiteQuickLinks: function () {
        //Get data from Quick Links
        var query = webAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListQuickLinks + "')/items?$select=*";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            var strQuickLinksItem = "";
            getData = getData.d.results;
            if (getData.length > 0) {
                $.map(getData, function (item, key) {
                    var targetBlank = "";
                    if (item.OpenInNewTab) targetBlank = "target='_blank'";
                    //This will add all quick links
                    strQuickLinksItem += "<div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><a href='" + item.URL.Url + "' " + targetBlank + ">" + item.Title + "</a></h4>" + "</div></div>";
                });
                $("#quicklinksRow").append(strQuickLinksItem);
            }
        });
    },
    //This is used to show toaster message after doing operations on my quick links(like Add, Edit, Delete)
    ShowToaster: function (textToDisplay) {
        $("#lblToasterSuccess").html(textToDisplay);
        var x = document.getElementById("lblToasterSuccess");
        x.className = "show";
        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 3000);
        //location.reload();
    },
    //This is used to fetch data from StarIncentive list
    StarIncentive: function () {
        var newDate = new Date().format("MMMM yyyy");
        $("#dvPublishDate").text(newDate);
        //Get data from Star Incentive list
        var query = siteAbsoluteURL + "/_api/web/lists/GetByTitle('" + KPCU.ListName.spListStarIncentive + "')/items?$select=KPCUValue,KPCUGoalValue,Title&$top=4&$orderby=Created desc";
        KPCU.FetchDatafromList(query, "GET").then(function (getData) {
            getData = getData.d.results;
            if (getData.length > 0) {
                var starIncentiveHtml = "";
                var starIncentiveTitle = "";
                var starIncentiveValue = "";
                var starIncentiveGoalValue = "";
                $.map(getData, function (item) {
                    starIncentiveTitle = item.Title ? item.Title : "";
                    starIncentiveValue = item.KPCUValue ? item.KPCUValue : "";
                    starIncentiveGoalValue = item.KPCUGoalValue ? item.KPCUGoalValue : "";
                    starIncentiveHtml += "<div class='col-md-3 col-sm-3 col-xs-12'><div class='main_points'><div class='mainpoint_heading orange outof_value'>" + starIncentiveValue + "</div><div class='mainpoint_heading gray goal_value'>" + starIncentiveGoalValue + "</div><div class='mainpoint_heading startincentive_title clrs-section'>" + starIncentiveTitle + "</div></div></div>"
                });
                $(".star_incentive").html(starIncentiveHtml);
            }
        });
    },
    //Validation on my KPCU quick links
    ValidateQuickLinkItem: function (appendID) {
        var chkError = false;
        if ($("#quickLinkTitleBox" + appendID).val().trim() == "") {
            $("#errorMsgTitle" + appendID).removeClass("hide");
            chkError = true;
        }
        if ($("#quickLinkURLBox" + appendID).val().trim() == "") {
            $("#errorMsgURL" + appendID).removeClass("hide");
            chkError = true;
        } else {
            if (!KPCU.IsValidUrl($("#quickLinkURLBox" + appendID).val().trim())) {
                $("#errorMsgValidURL" + appendID).removeClass("hide");
                chkError = true;
            } else $("#errorMsgValidURL" + appendID).addClass("hide");
        }
        return chkError;
    }
}
$(document).ready(function () {
    siteAbsoluteURL = _spPageContextInfo.siteAbsoluteUrl;
    webAbsoluteURL = _spPageContextInfo.webAbsoluteUrl;
    KPCU.Init();
});
// Functions that require the DOM to be fully loaded
$(window).load(function () {
    //Apply KPCU Logo to the Suite Bar
    var interval = setInterval(function () {
        if ($("#O365_MainLink_Logo").length > 0) {
            KPCU.AddKPCULogoOnSuiteBar();
            clearInterval(interval);
            //Adding div to activity feed
            $("#ms-newsfeedpartdiv").wrap("<div id='activityFeedSlimScroll'></div>");
        }
    }, 1000);
    //Adding div to activity feed
    var intervalActivityFeed = setInterval(function () {
        if ($("#ms-newsfeedpartdiv").length > 0) {
            $("#ms-newsfeedpartdiv").wrap("<div id='activityFeedSlimScroll'></div>");
            //Added div at the end of activity feed.
            $(".activity_feedbox").append("<div class='activity_footer_strip'></div>");
            if ($(".activity_feedbox").height() > 300) {
                $('#activityFeedSlimScroll').slimScroll({
                    alwaysVisible: true
                });
            }
            clearInterval(intervalActivityFeed);
        }
    }, 1000);
});
