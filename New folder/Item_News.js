/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_817584a5bd7b40c6832d912a9b9a3d74(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_817584a5bd7b40c6832d912a9b9a3d74.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fItem_News.js';
  ctx['DisplayTemplateData']['TemplateType']='Item';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['ManagedPropertyMapping']={'Link URL':['Path'], 'Line 1':['Title'], 'Line 3':['LastModifiedTime'], 'NewsTitleOWSTEXT':['NewsTitleOWSTEXT'], 'NewsPublishedDateOWSDATE':['NewsPublishedDateOWSDATE'], 'MPLocation':['MPLocation'], 'NewsBannerOWSIMGE':['NewsBannerOWSIMGE'], 'NewsThumbnailOWSIMGE':['NewsThumbnailOWSIMGE'], 'MPDepartment':['MPDepartment']};
  var cachePreviousItemValuesFunction = ctx['ItemValues'];
  ctx['ItemValues'] = function(slotOrPropName) {
    return Srch.ValueInfo.getCachedCtxItemValue(ctx, slotOrPropName)
};

ms_outHtml.push('',''
);
		//Get current Item ID 
		var index = ctx.CurrentItemIdx;
		
		//Get the News Title	
		var newsTitle = $getItemValue(ctx, "NewsTitleOWSTEXT");
		var tag = newsTitle .value;
			if(tag.length > 80)
			{
				var Title = tag.substring(0,50) + "… ";
			}
			else
			{
				var Title = tag == "null" ? "" : tag;
			} 		
		//Get News Thumbnail Image Object
		var newsThumbnail = $getItemValue(ctx, "NewsBannerOWSIMGE");	
		//Get News Thumbnail Image URL
		newsThumbnail = newsThumbnail.value ? $(newsThumbnail.value).find("img").prevObject[0].src : "";
		
		//Get the New URL
		var linkURL = ctx.CurrentItem.Path;
		
		//Checking If index != 0
		if(index != 0)
		{
		 ms_outHtml.push(' '
,'	        <div class="owl-item">'
,'				<a href="', linkURL ,'">           '
,'	 				<div class="item">'
,'	                	<img src="', newsThumbnail ,'" class="img-responsive" />'
,'	                	<p class="text-center"> ', Title ,' </p>'
,'	            	</div>'
,'	            </a>'
,'	        </div>'
);
	    }
	    ms_outHtml.push('        '
,'	'
);

  ctx['ItemValues'] = cachePreviousItemValuesFunction;
  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_817584a5bd7b40c6832d912a9b9a3d74() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Item_List", DisplayTemplate_817584a5bd7b40c6832d912a9b9a3d74);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fItem_News.js", DisplayTemplate_817584a5bd7b40c6832d912a9b9a3d74);
}

}
RegisterTemplate_817584a5bd7b40c6832d912a9b9a3d74();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fItem_News.js"), RegisterTemplate_817584a5bd7b40c6832d912a9b9a3d74);
}