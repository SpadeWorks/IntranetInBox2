/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_a01d23b20de849e58d1ae2382d226231(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_a01d23b20de849e58d1ae2382d226231.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fItem_VoiceOfManagement.js';
  ctx['DisplayTemplateData']['TemplateType']='Item';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['ManagedPropertyMapping']={'ApprovalStatus':['ApprovalStatus'], 'Picture URL':['PublishingImage', 'PictureURL', 'PictureThumbnailURL'], 'Link URL':['Path'], 'Line 1':['Title'], 'Line 2':['ManagementMessage'], 'Line 3':['ContentAuthor'], 'SecondaryFileExtension':null, 'ContentTypeId':null};
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
var accountName = "ideapac\\";

var line1 = $getItemValue(ctx, "Line 1");
var line2 = $getItemValue(ctx, "Line 2");
var line3 = $getItemValue(ctx, "Line 3");
var userName,displayName;

	userName = Srch.U.getUsernameFromAuthorField(ctx.CurrentItem.ContentAuthor);
	displayName = Srch.U.getDisplayNameFromAuthorField(ctx.CurrentItem.ContentAuthor);


var status = $getItemValue(ctx,"ApprovalStatus");

var userProperties = NBB.GetUserProfileProperties(userName);
var profilePic = "",designation="";


if(userProperties.UserProfileProperties.results.length>0)
{
	for(var i=0;i<userProperties.UserProfileProperties.results.length;i++)
	{
		if (userProperties.UserProfileProperties.results[i].Key === "Title") 
		{ 
			designation = userProperties.UserProfileProperties.results[i].Value; 
		}
	}

}
		 profilePic = NBB.GetUserPictureUrl(_spPageContextInfo.webAbsoluteUrl,userName,"L");

var tag = document.createElement('div');
tag.innerHTML = line2.value;
if(tag.innerText.length> 120)
{
	var description = tag.innerText.substring(0,120) + "… ";
}
else
{
	var description = tag.innerText== "null" ? "" : tag.innerText ;
} 
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
,'        <div class="voiceofmgt-image"><img id="userProfile" src="', $htmlEncode(profilePic) ,'" /></div>'
,'			<div class="voiceofmgt-txt" title="', $htmlEncode(tag.innerText) ,'">', description ,'</div>'
,'			<div class="vocieofmgt-author">', displayName ,'</div>'
,'			<div class="voiceofmgt-designation">', designation  ,'</div>'
,'	          '
,'	'
);

  ctx['ItemValues'] = cachePreviousItemValuesFunction;
  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_a01d23b20de849e58d1ae2382d226231() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Item_Picture3Lines", DisplayTemplate_a01d23b20de849e58d1ae2382d226231);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fItem_VoiceOfManagement.js", DisplayTemplate_a01d23b20de849e58d1ae2382d226231);
}
//
        $includeLanguageScript("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fItem_VoiceOfManagement.js", "~sitecollection/_catalogs/masterpage/Display Templates/Language Files/{Locale}/CustomStrings.js");
    //
}
RegisterTemplate_a01d23b20de849e58d1ae2382d226231();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fItem_VoiceOfManagement.js"), RegisterTemplate_a01d23b20de849e58d1ae2382d226231);
}