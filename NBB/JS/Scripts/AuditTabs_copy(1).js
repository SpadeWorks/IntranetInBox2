function AuditPageModel(){
	var self = this
	self.auditAllIssues = ko.observable(0);
	self.auditPastIssues = ko.observable(0);
	self.auditNotDueIssues = ko.observable(0);
	self.auditClosedByOwnerIssues = ko.observable(0);
	self.auditClosedNotVerifiedIssues = ko.observable(0);
	self.auditClosedVerifiedIssues = ko.observable(0);
	self.auditOutstandingIssues = ko.observable(0);
	self.auditRiskAcceptacnceIssues = ko.observable(0);
	self.webPartsObservableArray = ko.observableArray([]);

	var currUserId = _spPageContextInfo.userId;
	
	
	//var currentDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate()) + "T00:00:00.0000000Z";
	
	var today = new Date();
today = moment(today).format("YYYY-MM-DD");
var currentDate = today + 'T00:00:00.0000000Z';
	
	
	self.GetAllIssues=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(AuthorId eq "+currUserId+") or (IssueOwnerId eq "+currUserId+")";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var itemsCount = data.d.results.length; //get items count
		    self.auditAllIssues(itemsCount);
			console.log(itemsCount)
			self.GetPastIssues();
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetPastIssues=function(){
	
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=*,ID&$filter=((AuthorId eq "+currUserId+") or (IssueOwnerId eq "+currUserId+")) and ((OriginalDueDate lt datetime'" + currentDate + "') and (RevisedDueDate lt datetime'" + currentDate + "') and (PercentComplete ne 100))";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var pastIssuesCount = data.d.results.length; //get items count
		    self.auditPastIssues(pastIssuesCount)
			console.log(pastIssuesCount)
			self.GetNotDueIssues()
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetNotDueIssues=function(){
		
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=((AuthorId eq "+currUserId+") or (IssueOwnerId eq "+currUserId+")) and ((OriginalDueDate ge datetime'" + currentDate + "') or (RevisedDueDate ge datetime'" + currentDate + "')) and (PercentComplete ne 100)";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var notDueIssuesCount = data.d.results.length; //get items count
		    self.auditNotDueIssues(notDueIssuesCount)
			console.log(notDueIssuesCount)
			self.GetIssuesClosedByOwner()
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetIssuesClosedByOwner=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(IssueStatus1 eq 'Closed by Issue owner')";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var closedByOwnerCount = data.d.results.length; //get items count
		    self.auditClosedByOwnerIssues(closedByOwnerCount)
			console.log(closedByOwnerCount)
			self.GetIssuesClosedNotVerified()
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetIssuesClosedNotVerified=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=((AuthorId eq "+currUserId+") or (IssueOwnerId eq "+currUserId+")) and (IssueStatus1 eq 'Closed not verified')";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var closedNotVerifiedCount = data.d.results.length; //get items count
		    self.auditClosedNotVerifiedIssues(closedNotVerifiedCount)
			console.log(closedNotVerifiedCount)
			self.GetOutstandingIssues()
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetIssuesRiskAcceptance=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=((AuthorId eq "+currUserId+") or (IssueOwnerId eq "+currUserId+")) and (IssueStatus1 eq 'Closed by risk acceptance')";
		getJson(endpointUrl)
		.done(function(data)
		{
		    self.auditRiskAcceptacnceIssues(data.d.results.length);
			self.GetOutstandingIssues()
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}

	self.GetOutstandingIssues=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=((AuthorId eq "+currUserId+") or (IssueOwnerId eq "+currUserId+")) and (PercentComplete ne 100)";
		getJson(endpointUrl)
		.done(function(data)
		{
		    self.auditOutstandingIssues(data.d.results.length)
			self.GetClosedAndVerified()
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetClosedAndVerified=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=((AuthorId eq "+currUserId+") or (IssueOwnerId eq "+currUserId+")) and (IssueStatus1 eq 'Closed Verified')";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var closedVerifiedCount = data.d.results.length; //get items count
		    self.auditClosedVerifiedIssues(closedVerifiedCount)
			console.log(closedVerifiedCount)
			self.webPartsObservableArray([
			   {Count:self.auditAllIssues(),Title:"All Issues",WebPartName:"All Issues",IconClass:"allissues-icon",Type:"Default"},
			   {Count:self.auditOutstandingIssues(),Title:"Outstanding Issues",WebPartName:"Outstanding Issues",IconClass:"outstandingissues-icon",Type:"NotDefault"},
			   {Count:self.auditPastIssues(),Title:"Issues Past Due",WebPartName:"Issues Past Due",IconClass:"pastdueissues-icon",Type:"NotDefault"},
			   {Count:self.auditNotDueIssues(),Title:"Issues Not Due",WebPartName:"Issues Not Due",IconClass:"notdueyetissues-icon",Type:"NotDefault"},
			   {Count:self.auditClosedByOwnerIssues(),Title:"Issues Closed By Owner",WebPartName:"Issues Closed By Owner",IconClass:"closedbyownerissues-icon",Type:"NotDefault"},
			   {Count:self.auditClosedNotVerifiedIssues(),Title:"Issues Closed Not Verified",WebPartName:"Issues Closed Not Verified",IconClass:"closedbutnotverifiedissues-icon",Type:"NotDefault"},
			   {Count:self.auditClosedVerifiedIssues(),Title:"Issues Closed Verified",WebPartName:"Issues Closed Verified",IconClass:"closedandverified-icon",Type:"NotDefault"},
			   {Count:self.auditClosedVerifiedIssues(),Title:"Issues Closed By Risk Acceptance",WebPartName:"Issues Closed By Risk Acceptance",IconClass:"closedbyriskacceptance-icon",Type:"NotDefault"},
			])
								
			HideAuditListWebParts(self.webPartsObservableArray())
			$('.clsAuditIssuesCount').on('click',function(){
				var wpname = $(this).attr('webpartname');
				$("span:contains('"+wpname+"')").filter(function(i){
					if($(this).text()===wpname){
						$('.clsMyVisiualWP').hide();
						$(this).parents('.ms-webpartzone-cell').show();
					}
				});
		
			})
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetAllIssues();
}




$(document).ready(function($) {
	ko.applyBindings(new AuditPageModel(),document.getElementById("koContainer1"));
});



function getJson(url) 
{
    return $.ajax({       
       url: url,   
       type: "GET",  
       contentType: "application/json;odata=verbose",
       headers: { 
          "Accept": "application/json;odata=verbose"
       }
    });
}

function HideAuditListWebParts(WebPartTitles){
	for(var i=0;i<WebPartTitles.length;i++){
		var wpnametext = WebPartTitles[i].WebPartName
		$("span:contains('"+wpnametext+"')").each(function(){
			if($(this).text().toLocaleLowerCase()===wpnametext.toLocaleLowerCase()){
				$(this).parents('.ms-webpartzone-cell').addClass('clsMyVisiualWP')
				if(WebPartTitles[i].Type!='Default'){
					$(this).parents('.ms-webpartzone-cell').hide();
				}
			}
	   		 //return $(this).text() === text ? true : false;
		});
		$("span:contains('"+wpnametext+"')").filter(function(){
			if($(this).text().toLocaleLowerCase()===wpnametext.toLocaleLowerCase()){
				$(this).parents('.ms-webpartzone-cell').addClass('clsMyVisiualWP')
				if(WebPartTitles[i].Type!='Default'){
					$(this).parents('.ms-webpartzone-cell').hide();
				}
			}
	   		 //return $(this).text() === text ? true : false;
		});

	}
}
