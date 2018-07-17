var currUser = "";
var oldRevisedDt = "";
var overAllIssueStatus = 1;
function GetSubTasks(){
	try{
		$.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=DelegateIssue/Title,IssueStatus1,OriginalDueDate,IssueOwner/Title&$expand=DelegateIssue/Title,IssueOwner/Title&$filter=ParentID eq "+GetQueryStringByParameter('ID')+"",  
        method: "GET", 
        cache: false, 
        headers: { "Accept": "application/json; odata=verbose" },  
        success: function (data) {
        	HideFields(["IssueItemStatus","PrimaryIssueOwner","RevisedDueDateStatus","ParentTaskId","IssueResolutionCommentText","IssueJustificationText"])
        	$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Dropdown).on('change', SetFieldsTypes);
			oldRevisedDt=SPUtility.GetSPFieldByInternalName('RevisedDueDate').GetValue();
        	var d = data.d.results;
        	if(d.length>0){
        		console.log(data.d.results);
        		var table="<span>Sub Tasks</spn><table class='complianceportal-table' width='100%' cellspacing='0px' cellpadding='0px'><thead><th>PTA</th><th>Due Date</th><th>Issue Status</th><th>Delegate To</th><tbody>";
        		for(var i=0;i<d.length;i++){
        			table+="<tr>"
        			table+="<td>"+d[i].IssueOwner.Title+"</td>"
        			table+="<td>"+GetDateFormat(d[i].OriginalDueDate)+"</td>"
        			table+="<td>"+d[i].IssueStatus1+"</td>"
        			table+="<td>"+(d[i].DelegateIssue.Title!=null?d[i].DelegateIssue.Title:"")+"</td>"
        			table+="</tr>"
        			if(d[i].IssueStatus1!="Closed by Issue owner"){
        				overAllIssueStatus = 0;
        			}
        		}
        		table+="</tbody></table>"
        		$('.ms-formtable').parent().prepend(table);
        		if(overAllIssueStatus){
            		$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", false);
          		}else{
          			$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", true);
          		}
            }else{
            	$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", false);
            }
            
            LoadIssueStatus();
        },
        error: function(error) {
                console.log(JSON.stringify(error));
            }
        });
     }catch(err){
	
	}
}

function GetDateFormat(spDt){
	var dt = new Date(spDt)
	return dt.format('MM/dd/yyyy');
}

function GetQueryStringByParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function Init(){
	
	GetSubTasks();
}

function SetFieldsTypes(){
	var changeStatus = SPUtility.GetSPFieldByInternalName('IssueStatus1').GetValue().toUpperCase();
	var ptaField = SPUtility.GetSPFieldByInternalName('PersonToAddress_x0020__x0028_PTA').GetValue()
	if(changeStatus=="PENDING FOR REVISED DUE DATE"){
		SPUtility.GetSPFieldByInternalName('IssueJustification').Show()
		$(SPUtility.GetSPFieldByInternalName("IssueJustification").Controls.firstChild).attr("disabled", false);
		if(ptaField.length==0){
			SPUtility.GetSPFieldByInternalName('PersonToAddress_x0020__x0028_PTA').Hide();
		}
		SPUtility.GetSPFieldByInternalName('RevisedDueDate').Show()
	}else if(changeStatus=="CLOSED BY ISSUE OWNER"){
		if(ptaField.length==0){
			SPUtility.GetSPFieldByInternalName('PersonToAddress_x0020__x0028_PTA').Hide();
		}
		if($(SPUtility.GetSPFieldByInternalName('IssueJustification').Controls).parent().find('div span').length == 0){
			SPUtility.GetSPFieldByInternalName('IssueJustification').Hide()
		}
		SPUtility.GetSPFieldByInternalName('RevisedDueDate').Hide()
	}else if(changeStatus=="IN PROGRESS"){
		SPUtility.GetSPFieldByInternalName('PersonToAddress_x0020__x0028_PTA').Show();
		if($(SPUtility.GetSPFieldByInternalName('IssueJustification').Controls).parent().find('div span').length == 0){
			SPUtility.GetSPFieldByInternalName('IssueJustification').Hide()
		}
		SPUtility.GetSPFieldByInternalName('RevisedDueDate').Hide()
	}else{
		if($(SPUtility.GetSPFieldByInternalName('IssueJustification').Controls).parent().find('div span').length == 0){
			SPUtility.GetSPFieldByInternalName('IssueJustification').Hide()
		}
	}
	
	if(SPUtility.GetSPFieldByInternalName('ParentTaskId').GetValue()!=''){
		SPUtility.GetSPFieldByInternalName('PersonToAddress_x0020__x0028_PTA').Hide();
	}
	
	
}

var originalSaveButtonClickHandler = function(){};

$(document).ready( function () {
  var saveButton = $("[name$='diidIOSaveItem']") //gets form save button and ribbon save button
  if (saveButton.length > 0) {
    originalSaveButtonClickHandler = saveButton[0].onclick;  //save original function
  }
  $(saveButton).attr("onclick", "ValidateForm()"); //change onclick to execute our custom validation function
});

function ValidateForm()
{   
	debugger
   var currIssueStatus = SPUtility.GetSPFieldByInternalName('IssueStatus1').GetValue().toUpperCase();
   var parentTaskId  = SPUtility.GetSPFieldByInternalName('ParentTaskId').GetValue();
   if((currIssueStatus=="IN PROGRESS" || currIssueStatus=="CLOSED BY ISSUE OWNER") && currUser=="Owner" && parentTaskId!=""){
		UpdateParentTaskItem(parentTaskId).done(function(){
		   	originalSaveButtonClickHandler();
		});
  }else{
  	originalSaveButtonClickHandler();
  }
}

function PreSaveAction(){
	debugger
	SPUtility.GetSPFieldByInternalName('IssueResolutionCommentText').SetValue(SPUtility.GetSPFieldByInternalName('IssueResolutionComments').GetValue())
    SPUtility.GetSPFieldByInternalName('IssueJustificationText').SetValue(SPUtility.GetSPFieldByInternalName('IssueJustification').GetValue())
	var OriDueDt = SPUtility.GetSPFieldByInternalName('OriginalDueDate').GetValue();
	var dtObj = new Date(""+OriDueDt.Year+"-"+OriDueDt.Month+"-"+OriDueDt.Day+"")
	var currIssueStatus = SPUtility.GetSPFieldByInternalName('IssueStatus1').GetValue().toUpperCase();
	var oldRevdtObj = new Date(""+oldRevisedDt.Year+"-"+oldRevisedDt.Month+"-"+oldRevisedDt.Day+"")
	var RevDueDt = SPUtility.GetSPFieldByInternalName('RevisedDueDate').GetValue();
	var revDtObj = new Date(""+RevDueDt.Year+"-"+RevDueDt.Month+"-"+RevDueDt.Day+"")
	var currRevDueStatus = SPUtility.GetSPFieldByInternalName('RevisedDueDateStatus').GetValue();
	var d = new Date()
	
	if(revDtObj<dtObj && revDtObj!="Invalid Date"){
		alert("Please select Revised Due Date greater than Original Due Date!!!")
		return false;
	}else{
		if(currIssueStatus=="PENDING FOR REVISED DUE DATE" && currUser=="Auditor"){
		
			if(revDtObj!="Invalid Date"){
				if(dtObj.toString()==revDtObj.toString()){
					alert("Revised date should not be equal to original due date.Please select new revised due date.")
					return false;
				}else if(currRevDueStatus=="None"){
					alert("Please accecpt or reject the revised due date.")
					return false;
				}else if(oldRevdtObj.toString()!=revDtObj.toString() && currRevDueStatus=="Reject"){
					alert("You changed the revised due date.Please accept the revised due date status.")
					return false;
				}else{
					SPUtility.GetSPFieldByInternalName('IssueStatus1').SetValue("In progress")
					return true;
				}
			}else{
				alert("Please select the revised due date.")
				return false;
			}
		}else if(currIssueStatus=="CLOSED BY ISSUE OWNER" && currUser=="Owner"){
				if(SPUtility.GetSPFieldByInternalName('IssueResolutionComments').GetValue()==""){
					alert("Please enter the Issue Resolution Comments");
					return false;
				}else if(!overAllIssueStatus){
					alert("Some of sub tasks is in progress so you can't closed this task.")
					return false;
				}else{
					return true;
				}
		}else if((currIssueStatus=="CLOSED VERIFIED" || currIssueStatus=="CLOSED AND NOT VERIFIED" || currIssueStatus=="CLOSED BY RISK ACCEPTANCE")){
				if(SPUtility.GetSPFieldByInternalName('IssueResolutionComments').GetValue()==""){
					alert("Please enter the Issue Resolution Comments");
					return false;
				}else{
					SPUtility.GetSPFieldByInternalName('IssueClosureDate').SetValue(d.getFullYear(), d.getMonth(), d.getDate());
					return true;
				}
		}else if(currIssueStatus=="PENDING FOR REVISED DUE DATE" && currUser=="Owner"){
			if(oldRevdtObj.toString()!=revDtObj.toString()){
				if(SPUtility.GetSPFieldByInternalName('IssueJustification').GetValue()==""){
					alert("Please enter the Issue Justification Comments and attachments");
					return false;
				}else{
					return true;
				}
			}else{
				return true;
			}			
		}else{
			return true;
		}
	}
	
	
}

function UpdateParentTaskItem(parentTaskId){
	var def = $.Deferred();
	$.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?&$filter=ID eq "+parentTaskId+"",  
        method: "GET", 
        cache: false, 
        headers: { "Accept": "application/json; odata=verbose" },  
        success: function (data) {
        	
        	var d = data.d.results;
        	if(d[0].IssueStatus1=="Open"){
        		$.ajax({  
			        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('IssueTracking')/items("+parentTaskId+")",
			        type: "POST",  
			        data: JSON.stringify  
			        ({  
			            __metadata:  
			            {  
			                type: "SP.Data.IssueTrackingListItem"  
			            },  
			            IssueStatus1: "In progress"
			        }),  
			        cache: false, 
			        headers: {
			        	"Accept": "application/json;odata=verbose",  
			            "Content-Type": "application/json;odata=verbose",  
			            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
			            "IF-MATCH": "*",  
			            "X-HTTP-Method": "MERGE"
					},  
			        success: function (data) {
			        	return def.resolve()
			        },
			        error: function(error) {
			                console.log(JSON.stringify(error));
			            }
			    });

			}else{
				return def.resolve()
			}			            
        },
        error: function(error) {
                console.log(JSON.stringify(error));
            }
     });
     return def.promise();
}

function CheckAuditorGroup(){
	try{
		var def = $.Deferred();
		$.ajax({
	       url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getByName('Issue Auditors')/Users?$filter=Id eq " + _spPageContextInfo.userId,
	       method: "GET",
	       headers: { "Accept": "application/json; odata=verbose" },
	       success: function(data){
	        if(data.d.results[0] != undefined){
		        currUser = "Auditor"
			}
			return def.resolve()
	       }
	   });
	}catch(err){
		console.log(err)
	}finally {
		return def.promise();
	}

}

function GetAllUsers(id){
	debugger
	var def = $.Deferred();
	try{
		$.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=AuditManagers/Id,Auditors/Id,IssueOwner/Id,DelegateIssue/Id&$expand=AuditManagers/Id,Auditors/Id,IssueOwner/Id,DelegateIssue/Id&$filter=ID eq "+GetQueryStringByParameter('ID')+"",  
        method: "GET", 
        cache: false, 
        headers: { "Accept": "application/json; odata=verbose" },  
        success: function (data) {
        	
        	var d = data.d.results;
        	var issueAuditMan = d[0].AuditManagers.results
        	var currUserId = _spPageContextInfo.userId
        	
        	if(d.length>0){

	        	if(currUserId==d[0].IssueOwner.Id || currUserId==d[0].DelegateIssue.Id){
	        		currUser = "Owner"
	        	}
	        	
	        	for(var i=0;i<issueAuditMan.length;i++){
	        		if(currUserId==issueAuditMan[i].Id){
	        			currUser = "Auditor"
	        			break;
	        		}
	        	}
	        	var issueAuditors = d[0].Auditors.results
	        	for(var i=0;i<issueAuditors.length;i++){
	        		if(currUserId==issueAuditors[i].Id){
	        			currUser = "Auditor"
	        			break;
	        		}
	        	}
	        	
	        	if(currUser==""){
	        		CheckAuditorGroup().done(function(){
	        			if(currUser==""){
	        				alert('You are not authorized to edit this task !!!');
	        				window.location = GetQueryStringByParameter('Source')
	        			}else{
	        				return def.resolve(d[0].DelegateIssue.Id)
	        			}
	        		});
	        	}else{
	        		return def.resolve(d[0].DelegateIssue.Id)
				}       		
        	}else{
        		alert('You are not authorized to edit this task !!!');
        		window.loaction = GetQueryStringByParameter('source')
           	}
        	            
        },
        error: function(error) {
                console.log(JSON.stringify(error));
            }
        });
     }catch(err){
		console.log(err)
	}finally {
		return def.promise();
	}
}

function LoadIssueStatus(){
		debugger
	var issueOwnersInfo = GetAllUsers().done(function(delegateIssueOwnerId){
		
		/*if((issueOwnersInfo ==_spPageContextInfo.userId) || (delegateIssueOwnerId ==_spPageContextInfo.userId)){
			currUser="Owner"
		}else{
			currUser="Auditor"
		}*/
		
				
		console.log(currUser)
		var IssueClosureDt = SPUtility.GetSPFieldByInternalName('IssueClosureDate').GetValue().Year;
		if(IssueClosureDt==null){
			SPUtility.GetSPFieldByInternalName('IssueClosureDate').Hide();
		}else{
			SPUtility.GetSPFieldByInternalName('IssueClosureDate').MakeReadOnly()
		}
		var subTskId = SPUtility.GetSPFieldByInternalName('ParentTaskId').GetValue();
		
		
		
		SPUtility.GetSPFieldByInternalName('RevisedDueDateStatus').SetValue("None")
		
		var currIssueStatus = SPUtility.GetSPFieldByInternalName('IssueStatus1').GetValue().toUpperCase();
		var issueStatusDp = SPUtility.GetSPFieldByInternalName('IssueStatus1').Dropdown;
		
		if(subTskId!="" && subTskId!=null){
			SPUtility.GetSPFieldByInternalName('DelegateIssue').Show()
			$(issueStatusDp).find('option').each(function(a,e){
		        if(e.label.toUpperCase()=="PENDING FOR REVISED DUE DATE"){$(e).remove();}
		    });
		}else{
			SPUtility.GetSPFieldByInternalName('DelegateIssue').Hide()
		}
		var ptaField = SPUtility.GetSPFieldByInternalName('PersonToAddress_x0020__x0028_PTA').GetValue()
		if(currUser=="Owner"){
			
			ReadOnlyFields([{Field:"Title",Type:"Text"},{Field:"AuditAssignmentNoticeNo",Type:"Text"},{Field:"AuditCategory",Type:"Text"},
						   {Field:"AuditIssueSummary",Type:"Text"},{Field:"AuditManagers",Type:"People"},{Field:"AuditRecommendation",Type:"Text"},
						   {Field:"AuditType",Type:"Text"},{Field:"AuditorRemarks",Type:"Text"},{Field:"Auditors",Type:"People"},{Field:"AuditDate",Type:"Date"},
						   {Field:"AuditCorrectiveAction",Type:"Text"},{Field:"IssueDetails",Type:"Text"},{Field:"IssueOwner",Type:"People"},
						   {Field:"SupervisoryLevel",Type:"People"},{Field:"IssueSignificance",Type:"Text"},{Field:"OriginalDueDate",Type:"Date"}
							])
			console.log(currIssueStatus)
			if(currIssueStatus=="OPEN"){
				$(issueStatusDp).find('option').each(function(a,e){
			        if(e.label.toUpperCase()!=currIssueStatus && e.label.toUpperCase()!="IN PROGRESS"&& e.label.toUpperCase()!="CLOSED BY ISSUE OWNER"){$(e).remove();}
			    })
			    $(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","auto");
			    SPUtility.GetSPFieldByInternalName('RevisedDueDate').Hide()
			    SPUtility.GetSPFieldByInternalName('IssueJustification').Hide()		   
			    $(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", false);

				SPUtility.GetSPFieldByInternalName("RevisedDueDate").Hide()

			}else if(currIssueStatus=="IN PROGRESS"){
				console.log('owner in progress')
				$(issueStatusDp).find('option').each(function(a,e){
			        if(e.label.toUpperCase()!=currIssueStatus && e.label.toUpperCase()!="PENDING FOR REVISED DUE DATE" &&  e.label.toUpperCase()!="CLOSED BY ISSUE OWNER"){$(e).remove();}
			    });
			    $(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","auto");
			    if($(SPUtility.GetSPFieldByInternalName('IssueJustification').Controls).parent().find('div span').length > 0){
			    	SPUtility.GetSPFieldByInternalName('IssueJustification').Show()
			    }else{
			    	SPUtility.GetSPFieldByInternalName('IssueJustification').Hide()
			    }
			    SPUtility.GetSPFieldByInternalName('RevisedDueDate').Show()
			    $(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", false);

				SPUtility.GetSPFieldByInternalName("RevisedDueDate").Hide()
			}else if(currIssueStatus=="REOPEN"){
				$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", false);
				$(issueStatusDp).find('option').each(function(a,e){
			        if(e.label.toUpperCase()!=currIssueStatus && e.label.toUpperCase()!="IN PROGRESS" && e.label.toUpperCase()!="CLOSED BY ISSUE OWNER"){$(e).remove();}
			    })
			     $(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","auto");

				SPUtility.GetSPFieldByInternalName("RevisedDueDate").MakeReadOnly()
			}else if(currIssueStatus=="CLOSED BY ISSUE OWNER"){
				if(ptaField.length==0){
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Hide()
				}else{
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Show()
					$(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","none");
					
				}
				SPUtility.GetSPFieldByInternalName("OriginalDueDate").MakeReadOnly()
				SPUtility.GetSPFieldByInternalName("RevisedDueDate").MakeReadOnly()
				$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", true);
			}else if(currIssueStatus=="CLOSED AND NOT VERIFIED" || currIssueStatus=="CLOSED VERIFIED" || currIssueStatus=="CLOSED BY RISK ACCEPTANCE"){
				$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", true);
				if(ptaField.length==0){
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Hide()
				}else{
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Show()
					$(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","none");
				}

				SPUtility.GetSPFieldByInternalName("RevisedDueDate").MakeReadOnly()
			}else if(currIssueStatus=="PENDING FOR REVISED DUE DATE"){
				SPUtility.GetSPFieldByInternalName("RevisedDueDate").MakeReadOnly()
				$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", true);
				if(ptaField.length==0){
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Hide()
				}else{
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Show()
					$(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","none");
				}
			}else{
				
				$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", true);
			}
		}else if(currUser=="Auditor"){
			if(currIssueStatus!="OPEN"){
				ReadOnlyFields([{Field:"Title",Type:"Text"},{Field:"AuditAssignmentNoticeNo",Type:"Text"},{Field:"AuditCategory",Type:"Text"},
						   {Field:"AuditIssueSummary",Type:"Text"},{Field:"AuditManagers",Type:"People"},{Field:"AuditRecommendation",Type:"Text"},
						   {Field:"AuditType",Type:"Text"},{Field:"AuditorRemarks",Type:"Text"},{Field:"Auditors",Type:"People"},{Field:"AuditDate",Type:"Date"},
						   {Field:"AuditCorrectiveAction",Type:"Text"},{Field:"IssueDetails",Type:"Text"},{Field:"IssueOwner",Type:"People"},
						   {Field:"SupervisoryLevel",Type:"People"},{Field:"IssueSignificance",Type:"Text"}
							])
		  	}
			
			if(currIssueStatus=="IN PROGRESS"){
				SPUtility.GetSPFieldByInternalName('RevisedDueDate').Hide()
				SPUtility.GetSPFieldByInternalName('DelegateIssue').Hide()
				 if($(SPUtility.GetSPFieldByInternalName('IssueJustification').Controls).parent().find('div span').length > 0){
			    	SPUtility.GetSPFieldByInternalName('IssueJustification').Show()
			    }else{
			    	SPUtility.GetSPFieldByInternalName('IssueJustification').Hide()
			    }

				$(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","auto");
				DisableFields([{Field:"IssueStatus1",Type:"Text"}]);

			}else if(currIssueStatus=="PENDING FOR REVISED DUE DATE"){
				SPUtility.GetSPFieldByInternalName('RevisedDueDate').MakeEditable()
				SPUtility.GetSPFieldByInternalName('RevisedDueDateStatus').Show()
				SPUtility.GetSPFieldByInternalName('DelegateIssue').Hide()
				if(ptaField.length==0){
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Hide()
				}else{
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Show()
					$(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","none");
				}
				$(SPUtility.GetSPFieldByInternalName('IssueJustification').Controls.firstChild).attr("disabled", true);
				$(issueStatusDp).find('option').each(function(a,e){
			        if(e.label.toUpperCase()!=currIssueStatus && e.label.toUpperCase()!="IN PROGRESS"){$(e).remove();}
			    }) 	
			}else if(currIssueStatus=="CLOSED BY ISSUE OWNER"){
				$(issueStatusDp).find('option').each(function(a,e){
			        if(e.label.toUpperCase()!=currIssueStatus && e.label.toUpperCase()!="REOPEN" && e.label.toUpperCase()!="CLOSED AND NOT VERIFIED" && e.label.toUpperCase()!="CLOSED VERIFIED" && e.label.toUpperCase()!="CLOSED BY RISK ACCEPTANCE"){$(e).remove();}
			    })
			    SPUtility.GetSPFieldByInternalName('DelegateIssue').Hide()
			    if(ptaField.length==0){
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Hide()
				}else{
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Show()
					$(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","none");
				}
				$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", false);
				SPUtility.GetSPFieldByInternalName("OriginalDueDate").MakeReadOnly()
				SPUtility.GetSPFieldByInternalName("RevisedDueDate").MakeReadOnly()
			}else if(currIssueStatus=="CLOSED AND NOT VERIFIED"){
				$(issueStatusDp).find('option').each(function(a,e){
			        if(e.label.toUpperCase()!=currIssueStatus && e.label.toUpperCase()!="REOPEN" && e.label.toUpperCase()!="CLOSED VERIFIED" && e.label.toUpperCase()!="CLOSED BY RISK ACCEPTANCE"){$(e).remove();}
			    })
			    if(ptaField.length==0){
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Hide()
					//SPUtility.GetSPFieldByInternalName('DelegateIssue').Hide()
				}else{
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Show()
					$(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","none");
				}
				SPUtility.GetSPFieldByInternalName("OriginalDueDate").MakeReadOnly()
				SPUtility.GetSPFieldByInternalName("RevisedDueDate").MakeReadOnly()
			}else if(currIssueStatus=="CLOSED VERIFIED" || currIssueStatus=="CLOSED BY RISK ACCEPTANCE"){
				$(SPUtility.GetSPFieldByInternalName('IssueStatus1').Controls.firstChild).attr("disabled", true);
				if(ptaField.length==0){
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Hide()
				}else{
					SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Show()
					$(SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Controls.firstChild).css("pointer-events","none");
				}
				SPUtility.GetSPFieldByInternalName("OriginalDueDate").MakeReadOnly()
				SPUtility.GetSPFieldByInternalName("RevisedDueDate").MakeReadOnly()
			}else if(currIssueStatus=="OPEN"){
				DisableFields([{Field:"DelegateIssue",Type:"People"},{Field:"IssueStatus1",Type:"Text"}]);
				SPUtility.GetSPFieldByInternalName('RevisedDueDate').Hide()
				SPUtility.GetSPFieldByInternalName('DelegateIssue').Hide()
				SPUtility.GetSPFieldByInternalName('IssueJustification').Hide()
			}else {
				DisableFields([{Field:"IssueStatus1",Type:"Text"}]);
			}
			
		}
		
		if(subTskId!=""){
			SPUtility.GetSPFieldByInternalName("PersonToAddress_x0020__x0028_PTA").Hide()
		}else{
			SPUtility.GetSPFieldByInternalName('DelegateIssue').Hide()
		}
		
		if(delegateIssueOwnerId!="" && delegateIssueOwnerId!=null){
	    	SPUtility.GetSPFieldByInternalName('DelegateIssue').Show()
	    	$(SPUtility.GetSPFieldByInternalName("DelegateIssue").Controls.firstChild).css("pointer-events","auto");
	    }
	})
}
function DisableFields(fields){
	for(var i=0;i<fields.length;i++){
		if(fields[i].Type=="Text"){
			$(SPUtility.GetSPFieldByInternalName(fields[i].Field).Controls.firstChild).attr("disabled", true);
		}else if(fields[i].Type=="People"){
			$(SPUtility.GetSPFieldByInternalName(fields[i].Field).Controls.firstChild).css("pointer-events","none");
		}else if(fields[i].Type=="Data"){
		
		}else if(fields[i].Type=="Date"){
			SPUtility.GetSPFieldByInternalName(fields[i].Field).MakeReadOnly()
		}
		
	}
	
}

function ReadOnlyFields(fields){
	for(var i=0;i<fields.length;i++){
		SPUtility.GetSPFieldByInternalName(fields[i].Field).MakeReadOnly()
	}
}

function HideFields(fields){
	for(var i=0;i<fields.length;i++){
		SPUtility.GetSPFieldByInternalName(fields[i]).Hide()
	}
}

/*function CheckUserOwnersGroup(){
	try{
		$.ajax({  
        url: window.location.href.split(_spPageContextInfo.siteServerRelativeUrl)[0]+_spPageContextInfo.siteServerRelativeUrl + "/_api/web/sitegroups/getbyname('Issue Owners')/users?$filter=Id eq "+_spPageContextInfo.userId+"",  
        method: "GET", 
        cache: false, 
        headers: { "Accept": "application/json; odata=verbose" },  
        success: function (data) {
        	if(data.d.results.length>0){
        		currUser = "Owner"
        	}else{
        		CheckUserAuditorGroup()
        	}
        },
        error: function(error) {
                console.log(JSON.stringify(error));
            }
        });
     }catch(err){
	
	}
}

function CheckUserAuditorGroup(){
	try{
		$.ajax({  
        url: window.location.href.split(_spPageContextInfo.siteServerRelativeUrl)[0]+_spPageContextInfo.siteServerRelativeUrl + "/_api/web/sitegroups/getbyname('Issue Auditors')/users?$filter=Id eq "+_spPageContextInfo.userId+"",  
        method: "GET", 
        cache: false, 
        headers: { "Accept": "application/json; odata=verbose" },  
        success: function (data) {
        	if(data.d.results.length>0){
        		currUser = "Auditor"
        	}
        	
        },
        error: function(error) {
                console.log(JSON.stringify(error));
            }
        });
     }catch(err){
	
	}
}*/

