/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_8abbba37da6e44a0bcbccae1fa7c84f3(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_8abbba37da6e44a0bcbccae1fa7c84f3.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fItem_LatestUpdateHomePage.js';
  ctx['DisplayTemplateData']['TemplateType']='Item';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['ManagedPropertyMapping']={'ListItemID':['ListItemID'], 'StoryCopy':['StoryCopy'], 'BannerImage':['BannerImageOWSIMGE'], 'Picture URL':['PublishingImage', 'PictureURL', 'PictureThumbnailURL'], 'Link URL':['Path'], 'Line 1':['Title'], 'Line 2':['EmployeeDepartment'], 'Line 3':['BannerImage'], 'SecondaryFileExtension':null, 'ContentTypeId':null};
  var cachePreviousItemValuesFunction = ctx['ItemValues'];
  ctx['ItemValues'] = function(slotOrPropName) {
    return Srch.ValueInfo.getCachedCtxItemValue(ctx, slotOrPropName)
};

ms_outHtml.push('',''
,''
);

var encodedId = $htmlEncode(ctx.ClientControl.get_nextUniqueId() + "_picture3Lines_");

var linkURL = $getItemValue(ctx, "Link URL");
linkURL.overrideValueRenderer($urlHtmlEncodeValueObject);

var line1 = $getItemValue(ctx, "Line 1");
var line2 = $getItemValue(ctx, "Line 2");
var line3 = $getItemValue(ctx, "Line 3");
var storyCopy = $getItemValue(ctx, "StoryCopy");
var dep = $getItemValue(ctx,"Line 2");
var itemId = $getItemValue(ctx, "ListItemID");
departmentData = dep.value.split("\n");
var department = departmentData[0];

var tag = document.createElement('div');
tag.innerHTML = storyCopy.value;
if(tag.innerText.length> 780)
{
	var description = tag.innerText.substring(0,780) + "… ";
}
else
{
	var description = tag.innerText== "null" ? "" : tag.innerText ;
} 
var bannerImage = ctx.CurrentItem.BannerImage;
var pictureURL = $getItemValue(ctx, "Picture URL");
var pictureId = encodedId + "picture";
var pictureMarkup = Srch.ContentBySearch.getPictureMarkup(pictureURL, 100, 100, ctx.CurrentItem, "cbs-picture3LinesImg", line1, pictureId);

line1.overrideValueRenderer($contentLineText);
line2.overrideValueRenderer($contentLineText);
line3.overrideValueRenderer($contentLineText);

var containerId = encodedId + "container";
var pictureLinkId = encodedId + "pictureLink";
var pictureContainerId = encodedId + "pictureContainer";
var dataContainerId = encodedId + "dataContainer";
var line1LinkId = encodedId + "line1Link";
var line1Id = encodedId + "line1";
var line2Id = encodedId + "line2";
var line3Id = encodedId + "line3";

var dataDisplayTemplateTitle = "ItemPicture3Lines";

 ms_outHtml.push(''
,'			<div class="row">'
,'				<div class="col-md-4">'
,'					<div class="latestupdates-img">'
,'		        		',  STSHtmlDecode(bannerImage) ,' '
,'		        	</div>'
,'		        	'
,'				</div>'
,'				<div class="col-md-8">'
,'					<div class="nbb-titleleftbar"></div>'
,'					<div class="nbb-componenttitle">'
,'						<h2 class="pull-left">Latest Updates</h2>'
,'						<a class="morelink pull-right" href="../Pages/LatestUpdates.aspx">More</a>'
,'					</div>'
,'					<div class="dept-nameWrap">		'
,'						<div class="dept-name pull-left" title="" data-bind="html:department">'
,'							', departmentData[0],''
,'						</div>'
,'						<div class="dept-arrow pull-left"></div>	'
,'					</div>	'
,'					<div class="latestupdates-title">'
,'						<h2><a href="../Pages/LatestUpdateDetails.aspx?ItemID=', $htmlEncode(itemId) ,'">', line1 ,'</a></h2>'
,'					</div>'
,'		        	 '
,'		        	<div class="latestupdates-descrpt">'
,'		        		', description  ,''
,'		        	</div>  '
,'		        	'
,'				</div>'
,'			</div>        '
,'	'
);

  ctx['ItemValues'] = cachePreviousItemValuesFunction;
  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_8abbba37da6e44a0bcbccae1fa7c84f3() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Item_Picture3Lines", DisplayTemplate_8abbba37da6e44a0bcbccae1fa7c84f3);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fItem_LatestUpdateHomePage.js", DisplayTemplate_8abbba37da6e44a0bcbccae1fa7c84f3);
}
//
        $includeLanguageScript("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fItem_LatestUpdateHomePage.js", "~sitecollection/_catalogs/masterpage/Display Templates/Language Files/{Locale}/CustomStrings.js");
    //
}
RegisterTemplate_8abbba37da6e44a0bcbccae1fa7c84f3();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fItem_LatestUpdateHomePage.js"), RegisterTemplate_8abbba37da6e44a0bcbccae1fa7c84f3);
}