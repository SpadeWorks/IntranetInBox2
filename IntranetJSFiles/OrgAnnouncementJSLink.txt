(function(){
	var OrgAnnouncementContext = {};
	OrgAnnouncementContext.Templates = {};
	OrgAnnouncementContext.Templates.Fields = {
		"Title":{
			"View":ChangeItemLink
		}
	};
	
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(OrgAnnouncementContext );
})();

function ChangeItemLink(){
	
		var id = ctx.CurrentItem.ID,title=ctx.CurrentItem.Title;
		
		var link = _spPageContextInfo.webAbsoluteUrl + "/Pages/OrgAnnouncementDetails.aspx?ItemID="+id;
		return "<a href='"+link+"'>"+title+"</a>";
}