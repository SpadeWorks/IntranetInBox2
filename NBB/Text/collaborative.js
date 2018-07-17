(function () {
 
    var overrideContext = {};
	 overrideContext.BaseViewID = 3;
    overrideContext.ListTemplateType = 108;
    overrideContext.Templates = {};
	//overrideContext.Templates.Header = "<button type='button' onclick='abcd()'>Click Me!</button>"//"<a  href='#' onclick='SP.UI.Discussions.SortFilterItem.onPivotControlMenuOptionClick('SortItem3');' aria-label='Unanswered questions, View' role='view'>Unanswered questions</a>"
    overrideContext.Templates.Fields =
 
    {
 		'Author': { 'View': overrideTemplate },
        'LastReplyBy': { 'View': overrideLastReplyByTemplate},
		'Titlelink': { 'View': overrideTitleTemplate}
        

 };
 
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
     
 
})();
var title = "";
function overrideTemplate(ctx) {
      
    var status = ctx.CurrentItem.Author[0].title;
	var id = ctx.CurrentItem.Author[0].id;
	 title = ctx.CurrentItem.Title;
 

     var html = "<span>" + "<a href='/sites/NBB/CollaborativeInitiatives/Pages/InitiativeDetails.aspx?RootFolder=%2Fsites%2FNBB%2FCollaborativeInitiatives%2FLists%2FCollaborativeInitiatives%2F"+ title +"&amp;FolderCTID=0x01200200E461FB17EE75784082E45AFA244CD0A8&amp;View=%7B35184ACD%2D1302%2D47C2%2D8CFE%2DE1FF60712607%7D'>" + title + "</a>"+"</span>" ;
return html; 
}


function overrideLastReplyByTemplate(ctx) {
 
 
     var html = "<span>" + "<a href='/sites/NBB/CollaborativeInitiatives/_layouts/15/userdisp.aspx?ID=" + ctx.CurrentItem.LastReplyBy[0].id + "'' style='color:red'>"+ ctx.CurrentItem.LastReplyBy[0].title +"</a>"+"</span>" ;
    return html;
 
}
function overrideTitleTemplate(ctx) {
      

	var title = ctx.CurrentItem.Title;
  var html = "<span>" + "<a href='/sites/NBB/CollaborativeInitiatives/Lists/CollaborativeInitiatives/IntiativeDetails.aspx' style='color:red'>"+ title +"</a>"+"</span>" ;
return html; 

}


$(document).ready(function(){

$(".ms-comm-postMainContainer a").removeAttr("href");
   $(".ms-comm-postMainContainer a").attr("href","https://gohelmahendrak.sharepoint.com/sites/NBB/CollaborativeInitiatives/Pages/InitiativeDetails.aspx?IntiativeId="+ title +"");

});





