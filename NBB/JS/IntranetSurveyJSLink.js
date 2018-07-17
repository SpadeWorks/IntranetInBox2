(function(){
	var OrgAnnouncementContext = {};
	OrgAnnouncementContext.Templates = {};
	OrgAnnouncementContext.Templates.Fields = {
		"Title":{
			"View":ChangeItemLink
		},
		"ManageQuestions":{
			"View":ManageQuestions
		}
	};
	
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(OrgAnnouncementContext );
})();

function ChangeItemLink(){
	
		var id = ctx.CurrentItem.ID,title=ctx.CurrentItem.Title;
		
		var link = _spPageContextInfo.webAbsoluteUrl + "/Pages/IntranetSurvey.aspx?ItemID="+id;
		return "<a href='"+link+"'>"+title+"</a>";
}
function ManageQuestions(){
	
		var id = ctx.CurrentItem.ID,title=ctx.CurrentItem.Title;
		var poll = ctx.CurrentItem.IsPoll[0];
		var manageQue = ctx.CurrentItem.ManageQuestions;
		var desc = ctx.CurrentItem.ManageQuestions.desc;
		var link;
		if(poll === "Yes")
		{
			link = _spPageContextInfo.webAbsoluteUrl + "/Pages/IntranetSurvey.aspx?ItemID="+id;
			title = "Manage Questions";
		}
		else
		{
			link = manageQue;
			title = "Manage Questions";
		}
		return "<a href='"+link+"'>"+title+"</a>";
}