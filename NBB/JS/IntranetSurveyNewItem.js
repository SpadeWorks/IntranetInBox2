var NBB = NBB || {};

$(window).load(function () {

    NBB.Init();
    NBB.BindClickEvents();
});

NBB.Constants = {
    SameDateTitle: "Please change Dates!",
    SameDateMessage: "Survey already exist between selected start and end date.",
    AnimationType: "fade",
    RestContentType: "application/json;odata=verbose",
    Restheader: '"accept": "application/json;odata=verbose"',
    RedirectUrl: _spPageContextInfo.webAbsoluteUrl +"/Lists/IntranetSurvey/AllItems.aspx",
    DispDateFormat: "MM/DD/YYYY",
    DateFormat: "YYYY-MM-DD HH:mm:ss",
    ItemUpdateTitle: "Successful!",
    ItemUpdateMessage: "Survey List updates Successfully",
    NewItemTitle: "Successful!",
    NewItemMessage: "New Survey List Created Successfully",
    StartDateErroMessage: "Start date must be before end date",
    PollSuccessTitle: "Successful!",
    PollSuccesMessage: "Question Added.",
    ErrorTitle: "Some Error occured!",
    ErrorMessage: "Please Try again."
};

NBB.Init = function () {
    $("#PollQuestionSection").hide();
    NBB.emailYes = false;
    NBB.emailNo = false;
    NBB.pollYes = false;
    NBB.surveyListName = $("input[title='Title']");
    NBB.surveyDescription = $("textarea[id='surveyDescription']");
    NBB.startDate = $("input[title='Start Date']");
    NBB.endDate = $("input[title='End Date']");
    NBB.isPollYes = $("input[id='isPollYes']");
    NBB.emailNotificationYes = $("input[id='emailYes']");
    NBB.startDate.prop('readOnly', 'readOnly');
    NBB.endDate.prop('readOnly', 'readOnly');
    NBB.question = $("textarea[id='question']");
    NBB.options = $("textarea[id='options']");
    NBB.GUID = "";
    NBB.itemID = NBB.GetParameterByName("ID");
    if (NBB.itemID != null || NBB.itemID != undefined) {
        NBB.SetFieldValue(NBB.itemID);
    }
}

NBB.BindClickEvents = function () {
    NBB.emailNotificationYes.change(function () {
        NBB.emailYes = !NBB.emailYes;
    });
    NBB.isPollYes.change(function () {
        NBB.pollYes = !NBB.pollYes;
        if(NBB.pollYes)
        {
        	$("#pollQuestion").show();
        	$("#pollOptions").show();
        }
        else
        {
        	$("#pollQuestion").hide();
        	$("#pollOptions").hide();

        }
    });
}

NBB.PreSaveAction = function () {
    $(".validation").hide();

    if (!NBB.CheckError() && (NBB.itemID === undefined) && !NBB.pollYes) {
        NBB.IsSurveyExistWithSameDates().then(function (result) {
            if (result) {
                dialog.alert({
                    title: NBB.Constants.SameDateTitle,
                    message: NBB.Constants.SameDateMessage,
                    animation: NBB.Constants.AnimationType
                });
            }
            else {
                NBB.CreateList(NBB.surveyListName.val().trim());
            }
        });
    }
    else if(!NBB.CheckError() && !NBB.CheckPollError() && (NBB.itemID === undefined) && NBB.pollYes)
    {
    	NBB.IsSurveyExistWithSameDates().then(function (result) {
            if (result) {
                dialog.alert({
                    title: NBB.Constants.SameDateTitle,
                    message: NBB.Constants.SameDateMessage,
                    animation: NBB.Constants.AnimationType
                });
            }
            else {
                NBB.CreateList(NBB.surveyListName.val().trim());
            }
        });	
    }
    else if (!NBB.CheckError() && NBB.itemID && NBB.previousListName != NBB.surveyListName.val()) 
    {
        NBB.IsSurveyExistWithSameDates().then(function (result) {
            if (result) {
                dialog.alert({
                    title: NBB.Constants.SameDateTitle,
                    message: NBB.Constants.SameDateMessage,
                    animation: NBB.Constants.AnimationType,
                    callback: function (value) {
                    }
                });
            }
            else {
                NBB.UpdateSurveyListName(NBB.previousListName).then(function (data) {
                    if (data) {
                        if (NBB.pollYes && NBB.question.val() != NBB.previousQuestion) {
                            NBB.UpdatePollQuestion().then(function (data) {
                                if (data) {
                                    NBB.UpdatePollOptions().then(function (data) {
                                        if (data) {
                                            NBB.UpdateListItem();
                                        }
                                        else {
                                            dialog.alert({
                                                title: NBB.Constants.ErrorTitle,
                                                message: NBB.Constants.ErrorMessage,
                                                animation: NBB.Constants.AnimationType,
                                            });
                                        }
                                    });;
                                }
                                else {
                                    dialog.alert({
                                        title: NBB.Constants.ErrorTitle,
                                        message: NBB.Constants.ErrorMessage,
                                        animation: NBB.Constants.AnimationType,
                                    });
                                }

                            });

                        }
                        else {
                            NBB.UpdateListItem();
                        }
                    }
                });
            }
        });

    }
    else if (!NBB.CheckError() && !NBB.CheckPollError() && NBB.pollYes && NBB.question.val() != NBB.previousQuestion)
    {
        NBB.UpdatePollQuestion().then(function (data) {
            if (data) {
                NBB.UpdatePollOptions().then(function (data) {
                    if (data) {
                        NBB.UpdateListItem();
                    }
                    else {
                        dialog.alert({
                            title: NBB.Constants.ErrorTitle,
                            message: NBB.Constants.ErrorMessage,
                            animation: NBB.Constants.AnimationType,
                        });
                    }
                });;
            }
            else {
                dialog.alert({
                    title: NBB.Constants.ErrorTitle,
                    message: NBB.Constants.ErrorMessage,
                    animation: NBB.Constants.AnimationType,
                });
            }

        });
    }
    else if (!NBB.CheckError() && NBB.itemID) {
        NBB.UpdateListItem();
    }
}

NBB.UpdateSurveyListName = function (listName) {
    var deferred = $.Deferred(),
        result = false,
        siteUrl = _spPageContextInfo.webAbsoluteUrl,
        clientContext = new SP.ClientContext(siteUrl),
        oWebsite = clientContext.get_web(),
        list = oWebsite.get_lists().getByTitle(listName);

    list.set_title(NBB.surveyListName.val());
    list.update();
    clientContext.executeQueryAsync(
        function (data) {
            result = true;
            deferred.resolve(result);
        },
        function (sender, args) {
            deferred.resolve(result);
        });
    return deferred.promise();
}

NBB.UpdateListItem = function () {
    var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Intranet Survey')/items('" + NBB.itemID + "')";
    var item = {};
    var __metadata = { "type": "SP.Data.IntranetSurveyListItem" };
    var Title = NBB.surveyListName.val().trim();
    var EmailNotification = {"__metadata": {"type": "Collection(Edm.String)"},"results":[(NBB.emailYes ? "Yes" : "")]};
    var IsPoll = {"__metadata": {"type": "Collection(Edm.String)"},"results":[(NBB.pollYes ? "Yes" : "")]};
    var SurveyStartDate = NBB.startDate.val().trim();
    var SurveyEndDate = NBB.endDate.val().trim();
    var SurveyDescription = NBB.surveyDescription.val().trim();

    item = { 
    "__metadata":{ "type": "SP.Data.IntranetSurveyListItem" }, 
    "Title":NBB.surveyListName.val().trim(), 
    "IsPoll":{"__metadata": {"type": "Collection(Edm.String)"},"results":[(NBB.pollYes ? "Yes" : "")]},
    "EmailNotification" :{"__metadata": {"type": "Collection(Edm.String)"},"results":[(NBB.emailYes ? "Yes" : "")]}, 
    "SurveyStartDate":NBB.startDate.val().trim(), "SurveyEndDate" : NBB.endDate.val().trim(), 
    "SurveyDescription" :NBB.surveyDescription.val().trim()};    
    
    $.ajax({
        url: siteUrl,
        type: 'POST',
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "IF-MATCH": "*",
            "X-Http-Method": "PATCH"
        },
        success: function (data) {
            dialog.alert({
                title: NBB.Constants.ItemUpdateTitle,
                message: NBB.Constants.ItemUpdateMessage,
                animation: NBB.Constants.AnimationType,
                callback: function (value) {
                    window.location = NBB.Constants.RedirectUrl;
                }
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}
NBB.UpdatePollQuestion = function () {
    var deferred = $.Deferred(),
        result = false,
        siteUrl = _spPageContextInfo.webAbsoluteUrl,
        clientContext = new SP.ClientContext(siteUrl),
        oWebsite = clientContext.get_web(),
        list = oWebsite.get_lists().getByTitle(NBB.surveyListName.val().trim()),
    fieldCollection = list.get_fields(),
    field = fieldCollection.getByInternalNameOrTitle(NBB.previousQuestion);
    field.set_title(NBB.question.val().trim());
    field.update();
    clientContext.executeQueryAsync(
        function (data) {
            result = true;
            deferred.resolve(result);
        },
        function (sender, args) {
            deferred.resolve(result);
        });
    return deferred.promise();
}
NBB.UpdatePollOptions = function () {
    var deferred = $.Deferred(),
        result = false,
        siteUrl = _spPageContextInfo.webAbsoluteUrl,
        clientContext = new SP.ClientContext(siteUrl),
        oWebsite = clientContext.get_web(),
        list = oWebsite.get_lists().getByTitle(NBB.surveyListName.val().trim()),
        fieldCollection = list.get_fields(),
        field = fieldCollection.getByInternalNameOrTitle(NBB.question.val().trim()),
        fieldChoices = clientContext.castTo(field, SP.FieldChoice);
    clientContext.load(fieldChoices);

    clientContext.executeQueryAsync
    (
        function () 
        {
            var options = NBB.options.val().trim().split("\n");
            var currentChoices = fieldChoices.get_choices();
            fieldChoices.set_choices(options);
            fieldChoices.updateAndPushChanges();
            clientContext.executeQueryAsync(
            function () {
                result = true;
                deferred.resolve(result);
            },
            function (sender, args) {
                result = false;
                deferred.resolve(args.get_message());
            });
        },
        function (sender, args) {
            deferred.resolve(result);
            deferred.resolve(args.get_message());
        });
    return deferred.promise();
}

NBB.SetFieldValue = function (id) {
    var options = "";
    NBB.GetItemDetails(id).then(function (data) {
        NBB.previousListName = data.Title;
        NBB.surveyListName.val(data.Title);
        
        NBB.surveyListName.prop("readonly","readonly");
        
        NBB.surveyDescription.val(data.SurveyDescription);
        NBB.endDate.val(moment(new Date(data.SurveyEndDate), NBB.Constants.DateFormat).format(NBB.Constants.DispDateFormat));
        NBB.startDate.val(moment(new Date(data.SurveyStartDate), NBB.Constants.DateFormat).format(NBB.Constants.DispDateFormat));
        NBB.isPollYes.prop("disabled", "disabled");
        if (data.IsPoll[0] === "Yes") {
            NBB.isPollYes.prop("checked", true);
            NBB.pollYes = true;
            $("#pollQuestion").show();
			$("#pollOptions").show();
            NBB.GetPollQuestion(data.Title).then(function (data) {
                NBB.question.val(data.Title);
                NBB.previousQuestion = data.Title;
                for (var i = 0; i < data.Choices.length; i++) {
                    options = options + data.Choices[i] + "\n";
                }
                NBB.options.val(options);

            });
        }
        if (data.EmailNotification[0] === "Yes") {
            NBB.emailNotificationYes.prop("checked", true);
            NBB.emailYes = true;
        }
    });
}
NBB.GetItemDetails = function (id) {
    var deferred = $.Deferred(),
        siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Intranet Survey')/items?$select=Title,EmailNotification,SurveyStartDate,SurveyEndDate,IsPoll,SurveyDescription&$filter= Id eq '" + id + "'";
    $.ajax({
        url: siteUrl,
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=nometadata' },
        success: function (data) {
            deferred.resolve(data.value[0]);
        },
        error: function (error) {
            console.log(error);
            deferred.resolve(error);
        }
    });
    return deferred.promise();
}
NBB.GetPollQuestion = function (title, isPoll) {
    var deferred = $.Deferred();
    var itemID = "";
    var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + title + "')/fields?$filter=(CanBeDeleted eq true)";
    $.ajax({
        url: siteUrl,
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=nometadata' },
        async: false,
        success: function (data) {
            deferred.resolve(data.value[0]);
        },
        error: function (error) {
            console.log(error);
        }
    });
    return deferred.promise();
}
NBB.CreateList = function (listName) {
    var deferred = $.Deferred(),
        result = false,
        siteUrl = _spPageContextInfo.webAbsoluteUrl,
        clientContext = new SP.ClientContext(siteUrl),
        oWebsite = clientContext.get_web(),
        listCreationInfo = new SP.ListCreationInformation();
    listCreationInfo.set_title(listName);
    listCreationInfo.set_templateType(SP.ListTemplateType.survey);
    NBB.oList = oWebsite.get_lists().add(listCreationInfo);
    clientContext.load(NBB.oList);
    clientContext.executeQueryAsync(Function.createDelegate(this, NBB.onQuerySucceeded), Function.createDelegate(this, NBB.onQueryFailed));
}
NBB.onQuerySucceeded = function () {

    NBB.GUID = NBB.oList.get_id();
    var manageQuestions =_spPageContextInfo.webAbsoluteUrl+ "/_layouts/15/qstNew.aspx?List={" + NBB.GUID._m_guidString$p$0 + "}",
        surveyLink = _spPageContextInfo.webAbsoluteUrl+"/Lists/" + NBB.surveyListName.val().trim() + "/NewForm.aspx",
        responseLink = _spPageContextInfo.webAbsoluteUrl+"/Lists/" + NBB.surveyListName.val().trim() + "/summary.aspx";
    NBB.AddtoList(manageQuestions, surveyLink, responseLink);
    
    
}
NBB.GrantEditPermissionToReader = function(listname)
{
	NBB.GetSiteTitle().then(function(siteTitle){
		var ctx = SP.ClientContext.get_current();
		var web = ctx.get_web();
		var list = web.get_lists().getByTitle(listname);
		list.breakRoleInheritance(true,true);
		var webTitle = web.Title;
		var group = web.get_siteGroups().getByName(siteTitle+" Visitors");
		var role = SP.RoleDefinitionBindingCollection.newObject(ctx);
		role.add(web.get_roleDefinitions().getByType(SP.RoleType.editor));
		list.get_roleAssignments().add(group, role);
		list.update();
		group = web.get_siteGroups().getByName(siteTitle+" Readers");
		list.get_roleAssignments().add(group, role);
		list.update();
		ctx.executeQueryAsync(function()
		{
		    console.log("Permission Given");
			window.location = NBB.Constants.RedirectUrl;
		},
		function(sender,args)
		{
			alert(args.get_message());
		});
	});
}

NBB.GetSiteTitle = function()
{
	var deferred = $.Deferred();
	var clientContext = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl);
   	var oWebsite = clientContext.get_web();
   	clientContext.load(oWebsite);
   	clientContext.executeQueryAsync
   	(
		function()
		{
			deferred.resolve(oWebsite.get_title());
		},
		function(sender,args)
		{
			alert(args.get_message());
		}
	);
	
	return deferred.promise();
}

NBB.onQueryFailed = function (sender, args) {
    dialog.alert({
        title: "Failed!",
        message: args.get_message(),
        animation: NBB.Constants.AnimationType,
        callback: function (value) {
        }
    });

    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
NBB.IsSurveyExistWithSameDates = function () {
    var startDate, endDate, result = false;
    var deferred = $.Deferred();
    NBB.ServerDateTime(new Date(NBB.startDate.val())).then(function (startDate) {
        startDate = startDate;
        NBB.ServerDateTime(new Date(NBB.endDate.val())).then(function (endDate) {
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Intranet Survey')/items?$select Title&$filter=(SurveyStartDate le '" + startDate + "' and SurveyEndDate ge '" + startDate + "') or (SurveyStartDate le '" + endDate + "' and SurveyEndDate ge '" + endDate + "')";
            $.ajax({
                url: siteUrl,
                method: 'GET',
                headers: { 'Accept': 'application/json; odata=nometadata' },
                success: function (data) {
                    if (data.value.length > 0) {
                        result = true;
                    }

                    deferred.resolve(result);
                },
                error: function (error) {
                    console.log(error);
                    deferred.resolve(result);
                }
            });
        });
    });
    return deferred.promise();
}
NBB.AddtoList = function (manageQuestions, surveyLink, responseLink) {
    var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Intranet Survey')/items";
    var item = {};
    var __metadata = { "type": "SP.Data.IntranetSurveyListItem" };
    var ManageQuestions = { "__metadata": { "type": "SP.FieldUrlValue" }, "Url": manageQuestions, "Description": "Manage Questions" };
    var ViewResponse = { "__metadata": { "type": "SP.FieldUrlValue" }, "Url": responseLink, "Description": "View Response" };
    var SurveyLink = { "__metadata": { "type": "SP.FieldUrlValue" }, "Url": surveyLink, "Description": "Survey Link" };
    var Title = NBB.surveyListName.val().trim();
    var EmailNotification = {"__metadata": {"type": "Collection(Edm.String)"},"results":[(NBB.emailYes ? "Yes" : "")]};
    var IsPoll = {"__metadata": {"type": "Collection(Edm.String)"},"results":[(NBB.pollYes ? "Yes" : "")]};
    var SurveyStartDate = NBB.startDate.val().trim();
    var SurveyEndDate = NBB.endDate.val().trim();
    var SurveyDescription = NBB.surveyDescription.val().trim();

    item = { 
		 "__metadata" : { "type": "SP.Data.IntranetSurveyListItem" },
	     "ManageQuestions" : { "__metadata": { "type": "SP.FieldUrlValue" }, "Url": manageQuestions, "Description": "Manage Questions" },
	     "ViewResponse" : { "__metadata": { "type": "SP.FieldUrlValue" }, "Url": responseLink, "Description": "View Response" },
	     "SurveyLink" : { "__metadata": { "type": "SP.FieldUrlValue" }, "Url": surveyLink, "Description": "Survey Link" },
	     "Title" : NBB.surveyListName.val().trim(),
	     "EmailNotification" : {"__metadata": {"type": "Collection(Edm.String)"},"results":[(NBB.emailYes ? "Yes" : "")]},
	     "IsPoll" : {"__metadata": {"type": "Collection(Edm.String)"},"results":[(NBB.pollYes ? "Yes" : "")]},
	     "SurveyStartDate" : NBB.startDate.val().trim(),
	     "SurveyEndDate" : NBB.endDate.val().trim(),
	     "SurveyDescription" : NBB.surveyDescription.val().trim()}
         
    $.ajax({
        url: siteUrl,
        type: 'POST',
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            //alert("Your Response saved Successfully");
            if (NBB.pollYes) {
            NBB.AddPollQuestion();
                
                

            }
            else {
            	dialog.alert({
                title: NBB.Constants.NewItemTitle,
                message: NBB.Constants.NewItemMessage,
                animation: NBB.Constants.AnimationType,
                callback: function (value) {
                		NBB.GrantEditPermissionToReader(NBB.surveyListName.val().trim());
                    }
            	});
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
NBB.InsertPollQuestion = function () {
    if (!NBB.CheckPollError()) {
        
    }
}
NBB.CancelRedirect = function(){
	window.location = NBB.Constants.RedirectUrl;
}
NBB.AddPollQuestion = function () {
    var item = {};
    var options = NBB.options.val().trim().split("\n");
    var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists(guid'" + NBB.GUID + "')/fields";
    var __metadata = { 'type': 'SP.FieldChoice' };
    var FieldTypeKind = "6";
    var SchemaXml = '<Field Type=\"Choice\" Required=\"TRUE\" Format=\"RadioButtons\" />';
    var Title = NBB.question.val().trim();
    var Choices = { 'results': options };
    var Required = true;

    item = { "__metadata": { 'type': 'SP.FieldChoice' }, "FieldTypeKind":"6", "Title" : NBB.question.val().trim(), "Required":true, "Choices":{ 'results': options } };

    $.ajax(
        {
            url: siteUrl,
            method: "POST",
            data: JSON.stringify(item),
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "IF-MATCH": "*",
            },
            success: function (data) {
                dialog.alert({
                    title: NBB.Constants.PollSuccessTitle,
                    message: NBB.Constants.PollSuccessTitle,
                    animation: NBB.Constants.AnimationType,
                    callback: function (value) {
                        NBB.GrantEditPermissionToReader(NBB.surveyListName.val().trim());
                    }
                });
            },
            error: function (error) {
                dialog.alert({
                    title: NBB.Constants.ErrorTitle,
                    message: NBB.Constants.ErrorMessage,
                    animation: NBB.Constants.AnimationType,
                });
            }
        });

}
NBB.CheckError = function () {
    var error = false,
        dt1 = moment(new Date(NBB.startDate.val()), NBB.Constants.DateFormat),
        dt2 = moment(new Date(NBB.endDate.val()), NBB.Constants.DateFormat);
		today = new Date();
		today.setHours(0,0,0,0);
		today = moment(today, NBB.Constants.DateFormat);
		
    if (NBB.endDate.val() === "" || NBB.endDate.val() === null) {
        $("#endDate").show();
        NBB.endDate.focus();
        error = true;
    }
    if (NBB.startDate.val() === "" || NBB.startDate.val() === null || dt1.isAfter(dt2) || !today.isSameOrBefore(dt1)) {
        $("#startDate").show();
        if (dt1.isAfter(dt2)) {
            $("#startDate").text(NBB.Constants.StartDateErroMessage);
        }
        if(today.isAfter(dt1))
        {
        	$("#startDate").text("Start date can not be in past");
        }
        NBB.startDate.focus();
        error = true;
    }
    if (NBB.surveyDescription.val().trim() == "" || NBB.surveyDescription.val().trim() == null) {
        $("#description").show();
        NBB.surveyDescription.focus();
        error = true;
    }
    if (NBB.surveyListName.val().trim() == "" || NBB.surveyListName.val().trim() == null) {
        $("#title").show();
        NBB.surveyListName.focus();
        error = true;
    }
    return error;
}

NBB.CheckPollError = function () {
    var error = false;
    if (NBB.options.val().trim() === "" || NBB.options.val().trim === null) {
        $("#optionValidation").show();
        NBB.options.focus();
        error = true;
    }
    if (NBB.question.val().trim() === "" || NBB.question.val().trim() === null) {
        $("#questionValidation").show();
        NBB.question.focus();
        error = true;

    }

    return error;
}
NBB.GetParameterByName = function (paramname) {
    JSRequest.EnsureSetup();
    return JSRequest.QueryString["" + paramname + ""];
}
