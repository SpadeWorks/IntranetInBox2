/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_0e66537cca1d41ef80c82149b8ab011b(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_0e66537cca1d41ef80c82149b8ab011b.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fControl_KPCUNews.js';
  ctx['DisplayTemplateData']['TemplateType']='Control';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

ms_outHtml.push('',''
); 	
		AddPostRenderCallback(ctx, function() {
				KPCU.Carousel("Home"); 
			 	$('.owl-nav').click(function(event) {
			  	$(".owl-nav").removeClass('disabled');
			});
		});
	
	if (!$isNull(ctx.ClientControl) && !$isNull(ctx.ClientControl.shouldRenderControl) && !ctx.ClientControl.shouldRenderControl()) {
	    return "";
	}
	ctx.ListDataJSONGroupsKey = "ResultTables";
	var $noResults = Srch.ContentBySearch.getControlTemplateEncodedNoResultsMessage(ctx.ClientControl);	
	var isRollupPageInDisplayMode = Srch.ContentBySearch.isRollupPage(ctx.ClientControl) && !Srch.U.isPageInEditMode();
	var noResultsClassName = isRollupPageInDisplayMode ? "ms-attractMode ms-uppercase ms-alignCenter" : "ms-srch-result-noResults";	
	//Get total rows
	ctx["CurrentItems"] = ctx.ListData.ResultTables[0].ResultRows;
	var ListRenderRenderWrapper = function(itemRenderResult, inCtx, tpl) {
	    var iStr = [];
	    iStr.push(itemRenderResult);
	    return iStr.join('');
	}
	ctx['ItemRenderWrapper'] = ListRenderRenderWrapper;
	
	//Checking If current Items Length 
	if (ctx["CurrentItems"].length > 0)
	{
		//Get the News URL Path	
		var newsURL = ctx.ListData.ResultTables[0].ResultRows[0].OriginalPath;
		
		//Get News Title	
		var newsTitle = ctx.ListData.ResultTables[0].ResultRows[0].NewsTitleOWSTEXT;
			//tag = newsTitle;
			if(newsTitle.length > 80)
			{
				var Title = newsTitle .substring(0,50) + "… ";
			}
			else
			{
				var Title = newsTitle == "null" ? "" : newsTitle;
			} 		

		
		//Get News Published Date
		if(!$isNull(ctx.ListData.ResultTables[0].ResultRows[0].NewsPublishedDateOWSDATE)) {		
			var newsPublishDate = KPCU.DateFormat(ctx.ListData.ResultTables[0].ResultRows[0].NewsPublishedDateOWSDATE);
		}
		//Get News Location
		var newsLocation = ctx.ListData.ResultTables[0].ResultRows[0].MPLocation;
		
		//Get News Department
		var newsDepartment = ctx.ListData.ResultTables[0].ResultRows[0].MPDepartment;
		
		//Get News Banner Image	Object
		var newsBanner = ctx.ListData.ResultTables[0].ResultRows[0].NewsBannerOWSIMGE;
		//Get Banner Image URL
		newsBanner = newsBanner ? $(newsBanner).find("img").prevObject[0].src : "";
		
		//Get News Thumbnail Image Object
		var newsThumbnail = ctx.ListData.ResultTables[0].ResultRows[0].NewsThumbnailOWSIMGE;
		//Get News Thumbnail Image URL		
		newsThumbnail = newsThumbnail ? $(newsThumbnail).find("img").prevObject[0].src : "";
		ms_outHtml.push(''
,'		<div class="NewsContainer">'
,'			<div class="NewsBannerImage">'
,'				<img src="', newsBanner ,'" class="img-responsive  banner-image" />'
,'			</div>'
,'			<div class="NewsDetails">'
,'				<div class="col-md-12 col-sm-12 col-xs-12">'
,'					<div class="NewsCategory">'
,'						<a href="NewsArchive.aspx?k=', newsDepartment ,'" class="news_btn">', newsDepartment ,'</a>'
,'					</div>'
,'				</div>'
,'				<div class="col-md-12 col-sm-12 col-xs-12">'
,'					<div class="duration_container">'
,'						<div class="NewsPublishedDate"> ', newsPublishDate ,' </div>'
,'						<div class="NewsLocation"> ', newsLocation ,' </div>'
,'					</div>'
,'				</div>'
,'				<div class="col-md-10 col-sm-12 col-xs-12">'
,'					<div class="NewsTitle">'
,'						<a href="', newsURL ,'"><h2> ', Title ,'  </h2></a>'
,'					</div>						'
,'				</div>'
,'				<div class="col-md-2 col-sm-12 col-xs-12">'
,'					<div class="allnews">'
,'						<a href="NewsArchive.aspx">All News</a>'
,'					</div>'
,'				</div>'
,'			</div>'
,'		</div>			'
,'		<div class="row">'
,'		    <div class="col-md-12">'
,'		        <div class="news_slider">		            '
,'					<div class="owl-carousel owl-theme owl-loaded owl-drag">'
,'					    <div class="owl-stage-outer">'
,'					        <div class="owl-stage">'
,'								', ctx.RenderGroups(ctx) ,'										'
,'							</div>'
,'					    </div>'
,'					    <div class="owl-nav">'
,'					        <button type="button" role="presentation" class="owl-prev">'
,'					            <span aria-label="Previous">&#8249;</span>'
,'					        </button>'
,'					        <button type="button" role="presentation" class="owl-next">'
,'					            <span aria-label="Next">&#8250;</span>'
,'					        </button>'
,'					    </div>'
,'					    <div class="owl-dots">'
,'					        <button role="button" class="owl-dot">'
,'					            <span></span>'
,'					        </button>'
,'					        <button role="button" class="owl-dot active">'
,'					            <span></span>'
,'					        </button>'
,'					    </div>'
,'					</div>'
,'				</div>		            '
,'		    </div>'
,'		</div>'
);
	}
	else
	{
	//Display the no data message
	ms_outHtml.push(''
,'	    <div class="no-data-msg">No data is currently available.</div>'
);			
	}
	ms_outHtml.push(''
,'	'
);

  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_0e66537cca1d41ef80c82149b8ab011b() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Control_List", DisplayTemplate_0e66537cca1d41ef80c82149b8ab011b);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fControl_KPCUNews.js", DisplayTemplate_0e66537cca1d41ef80c82149b8ab011b);
}

}
RegisterTemplate_0e66537cca1d41ef80c82149b8ab011b();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fControl_KPCUNews.js"), RegisterTemplate_0e66537cca1d41ef80c82149b8ab011b);
}