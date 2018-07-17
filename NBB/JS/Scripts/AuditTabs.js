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
	
	var dt = new Date();
	var dtNintyDays = new Date();
	dtNintyDays.setDate(dt.getDate() - 90);
    

	
	self.GetAllIssues=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$filter=(IssueStatus1 ne 'Closed Verified') and (IssueStatus1 ne 'Closed by risk acceptance') and (ParentTaskId eq null)";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var itemsCount = data.d.results.length; //get items count
		    self.auditAllIssues(itemsCount);
			//console.log(itemsCount)
			self.GetPastIssues();
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetPastIssues=function(){
		var clientctx = SP.ClientContext.get_current();
        var list = clientctx.get_web().get_lists().getByTitle('IssueTracking');
        var q = new SP.CamlQuery();
        //q.set_viewXml("<View><Query><Where><And><Gt><FieldRef Name='Modified' /><Value IncludeTimeValue='FALSE' Type='DateTime'>"+dtNintyDays.toISOString()+"</Value></Gt><And><Lt><FieldRef Name='OriginalDueDate' /><Value IncludeTimeValue='FALSE' Type='DateTime'>"+currentDate+"</Value></Lt><And><Lt><FieldRef Name='RevisedDueDate' /><Value IncludeTimeValue='FALSE' Type='DateTime'>"+currentDate+"</Value></Lt><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed and not verified</Value></Neq><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed Verified</Value></Neq><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed by risk acceptance</Value></Neq></And></And></And></And></And></Where></Query></View>");
        q.set_viewXml("<View><Query><Where><And><Lt><FieldRef Name='OriginalDueDate' /><Value IncludeTimeValue='TRUE' Type='DateTime'>"+currentDate+"</Value></Lt><And><Lt><FieldRef Name='RevisedDueDate' /><Value IncludeTimeValue='TRUE' Type='DateTime'>"+currentDate+"</Value></Lt><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed and not verified</Value></Neq><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed Verified</Value></Neq><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed by risk acceptance</Value></Neq></And></And></And></And></Where></Query></View>");
        var r = list.getItems(q,"Include(ID)");
        clientctx.load(r);
        clientctx.executeQueryAsync(function() {
            var enumerator = r.getEnumerator();
            self.auditPastIssues(r.get_count())
            self.GetNotDueIssues()
        }, function(sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        });
	}
	
	self.GetNotDueIssues=function(){
		
		var clientctx = SP.ClientContext.get_current();
        var list = clientctx.get_web().get_lists().getByTitle('IssueTracking');
        var q = new SP.CamlQuery();
        //q.set_viewXml("<View><Query><Where><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed Verified</Value></Neq><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed and not verified</Value></Neq><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed by risk acceptance</Value></Neq><And><Gt><FieldRef Name='Modified' /><Value IncludeTimeValue='FALSE' Type='DateTime'>"+dtNintyDays.toISOString()+"</Value></Gt><Or><Gt><FieldRef Name='RevisedDueDate' /><Value IncludeTimeValue='FALSE' Type='DateTime'>"+currentDate+"</Value></Gt><Gt><FieldRef Name='OriginalDueDate' /><Value IncludeTimeValue='FALSE' Type='DateTime'>"+currentDate+"</Value></Gt></Or></And></And></And></And></Where></Query></View>");
        q.set_viewXml("<View><Query><Where><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed Verified</Value></Neq><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed and not verified</Value></Neq><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed by risk acceptance</Value></Neq><Or><Geq><FieldRef Name='RevisedDueDate' /><Value IncludeTimeValue='FALSE' Type='DateTime'>"+currentDate+"</Value></Geq><Geq><FieldRef Name='OriginalDueDate' /><Value IncludeTimeValue='FALSE' Type='DateTime'>"+currentDate+"</Value></Geq></Or></And></And></And></Where></Query></View>");
        var r = list.getItems(q,"Include(ID)");
        clientctx.load(r);
        clientctx.executeQueryAsync(function() {
            var enumerator = r.getEnumerator();
            self.auditNotDueIssues(r.get_count())
            self.GetIssuesClosedByOwner()
        }, function(sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        });
		
	}
	
	self.GetIssuesClosedByOwner=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(IssueStatus1 eq 'Closed by Issue owner') and (ParentTaskId eq null)";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var closedByOwnerCount = data.d.results.length; //get items count
		    self.auditClosedByOwnerIssues(closedByOwnerCount)
			//console.log(closedByOwnerCount)
			self.GetIssuesClosedNotVerified()
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetIssuesClosedNotVerified=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(IssueStatus1 eq 'Closed and not verified')";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var closedNotVerifiedCount = data.d.results.length; //get items count
		    self.auditClosedNotVerifiedIssues(closedNotVerifiedCount)
			//console.log(closedNotVerifiedCount)
			self.GetIssuesRiskAcceptance()
		})
		.fail(
		function(error){
		    console.log(JSON.stringify(error));
		});
	}
	
	self.GetIssuesRiskAcceptance=function(){
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(IssueStatus1 eq 'Closed by risk acceptance') and (Modified ge datetime'" + dtNintyDays.toISOString() + "')";
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
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=IssueStatus1 ne 'Closed Verified' and IssueStatus1 ne 'Closed by risk acceptance' and (ParentTaskId eq null)";
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
		var endpointUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(IssueStatus1 eq 'Closed Verified') and (Modified ge datetime'" + dtNintyDays.toISOString() + "')";
		getJson(endpointUrl)
		.done(function(data)
		{
		    var closedVerifiedCount = data.d.results.length; //get items count
		    self.auditClosedVerifiedIssues(closedVerifiedCount)
			//console.log(closedVerifiedCount)
			self.webPartsObservableArray([
			   {Count:self.auditAllIssues(),Title:"All Issues",WebPartName:"All Issues",IconClass:"allissues-icon",Type:"Default"},
			   {Count:self.auditOutstandingIssues(),Title:"Outstanding Issues",WebPartName:"Outstanding Issues",IconClass:"outstandingissues-icon",Type:"NotDefault"},
			   {Count:self.auditPastIssues(),Title:"Issues Past Due",WebPartName:"Issues Past Due",IconClass:"pastdueissues-icon",Type:"NotDefault"},
			   {Count:self.auditNotDueIssues(),Title:"Issues Not Due",WebPartName:"Issues Not Due",IconClass:"notdueyetissues-icon",Type:"NotDefault"},
			   {Count:self.auditClosedByOwnerIssues(),Title:"Issues Closed By Owner",WebPartName:"Issues Closed By Owner",IconClass:"closedbyownerissues-icon",Type:"NotDefault"},
			   {Count:self.auditClosedNotVerifiedIssues(),Title:"Issues Closed Not Verified",WebPartName:"Issues Closed Not Verified",IconClass:"closedbutnotverifiedissues-icon",Type:"NotDefault"},
			   {Count:self.auditClosedVerifiedIssues(),Title:"Issues Closed Verified",WebPartName:"Issues Closed Verified",IconClass:"closedandverified-icon",Type:"NotDefault"},
			   {Count:self.auditRiskAcceptacnceIssues(),Title:"Issues Closed By Risk Acceptance",WebPartName:"Issues Closed By Risk Acceptance",IconClass:"closedbyriskacceptance-icon",Type:"NotDefault"},
			])
			
			debugger			
					
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
