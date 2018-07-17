/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_510d8ce37fd14531a59ce19be0a64b3d(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_510d8ce37fd14531a59ce19be0a64b3d.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fControl_VoiceOfMgtPaging.js';
  ctx['DisplayTemplateData']['TemplateType']='Control';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

ms_outHtml.push('',''
,''
); 
if (!$isNull(ctx.ClientControl) &&
    !$isNull(ctx.ClientControl.shouldRenderControl) &&
    !ctx.ClientControl.shouldRenderControl())
{
    return "";
}
ctx.ListDataJSONGroupsKey = "ResultTables";
var $noResults = Srch.ContentBySearch.getControlTemplateEncodedNoResultsMessage(ctx.ClientControl);

var isRollupPageInDisplayMode = Srch.ContentBySearch.isRollupPage(ctx.ClientControl) && !Srch.U.isPageInEditMode();
var noResultsClassName = isRollupPageInDisplayMode ? "ms-attractMode ms-uppercase ms-alignCenter" : "ms-srch-result-noResults";

var ListRenderRenderWrapper = function(itemRenderResult, inCtx, tpl)
{
    var iStr = [];
    iStr.push('<li>');
    iStr.push(itemRenderResult);
    iStr.push('</li>');
    return iStr.join('');
}
ctx['ItemRenderWrapper'] = ListRenderRenderWrapper;
ms_outHtml.push(''
,'    <ul class="cbs-List">'
,''
);
var showPaging = ctx.ClientControl.get_showPaging();
if(showPaging)
{
    var pagingInfo = ctx.ClientControl.get_pagingInfo();
    showPaging = !$isEmptyArray(pagingInfo);
    if(showPaging)
    {
        var currentPage = null;
        var firstPage = pagingInfo[0];
        var lastPage = pagingInfo[pagingInfo.length - 1];

        for (var i = 0; i< pagingInfo.length; i++)
        {
            var pl = pagingInfo[i];
            if (!$isNull(pl))
            {
                if (pl.startItem == -1)
                {
                    currentPage = pl;
                }
            }
        }

        var getPagingImageClassName = function(buttonClassNamePrefix, isNext, isEnabled)
        {
            var className = buttonClassNamePrefix;
            className += (isNext && !Srch.U.isRTL()) || (!isNext && Srch.U.isRTL()) ? "right" : "left";
            if(!$isNull(isEnabled) && isEnabled == false)
            {
                className += "-disabled";
            }
            return className;
        }

        var getPagingContainerClassName = function(buttonClassNamePrefix, isEnabled)
        {
            var className = buttonClassNamePrefix;
            className += isEnabled ? "enabled" : "disabled";
            return className;
        }

        var hasNextPage = lastPage.pageNumber == -2;
        var hasPreviousPage = firstPage.pageNumber == -1;
        var buttonClassNamePrefix = "ms-promlink-button-";
        var nextPageContainerClassName = getPagingContainerClassName(buttonClassNamePrefix, hasNextPage);
        var previousPageContainerClassName = getPagingContainerClassName(buttonClassNamePrefix, hasPreviousPage);
        var nextPageImageClassName = getPagingImageClassName(buttonClassNamePrefix, true, hasNextPage);
        var previousPageImageClassName = getPagingImageClassName(buttonClassNamePrefix, false, hasPreviousPage);
ms_outHtml.push(''
,'<div class="nbb-voiceofmgt shadowbgBox">'
,'			<div class="nbb-titleleftbar"></div>'
,'			<div class="nbb-componenttitle">'
,'				<h2 class="pull-left">The Voice of Management</h2>'
,'				<a class="morelink pull-right" href="../Pages/AllArticles.aspx">More</a>'
,'			</div>'
,''
,'	         <div class="voiceofmgt-wrapper">'
,'	         '
,'	                <ul class="list-group">'
,''
);
                            }
                        }
                            if(firstPage != null && firstPage != "" && firstPage!= undefined)
                            {
                        ms_outHtml.push(''
,'                        ', ctx.RenderGroups(ctx) ,''
,'                        <li>'
,'                            <span class="ms-promlink-headerNav">'
,'                                <a class="ms-commandLink ms-promlink-button ', $htmlEncode(previousPageContainerClassName) ,'" title="', $htmlEncode(firstPage.title) ,'" href="#" onclick="$getClientControl(this).page(', $htmlEncode(firstPage.startItem) ,');return Srch.U.cancelEvent(event);">'
,'                                    <span class="ms-promlink-button-image">'
,'                                        <img class="', $htmlEncode(previousPageImageClassName) ,'" alt="', $htmlEncode(firstPage.title) ,'" src="', $urlHtmlEncode(GetThemedImageUrl('spcommon.png')) ,'" />'
,'                                    </span>'
,'                                </a>'
,'                                <span class="ms-promlink-button-inner"></span>'
,'                                <a class="ms-commandLink ms-promlink-button ', $htmlEncode(nextPageContainerClassName) ,'" title="', $htmlEncode(lastPage.title) ,'" href="#" onclick="$getClientControl(this).page(', $htmlEncode(lastPage.startItem) ,');return Srch.U.cancelEvent(event);">'
,'                                    <span class="ms-promlink-button-image">'
,'                                        <img class="', $htmlEncode(nextPageImageClassName) ,'" alt="', $htmlEncode(lastPage.title) ,'" src="', $urlHtmlEncode(GetThemedImageUrl('spcommon.png')) ,'" />'
,'                                    </span>'
,'                                </a>'
,'                            </span>'
,'                        </li>'
,'                    </ul>'
);
                    }
                    if (ctx.ClientControl.get_shouldShowNoResultMessage())
                    {
                    ms_outHtml.push(''
,'                    <div class="nbb-voiceofmgt shadowbgBox">'
,'                        <div class="nbb-titleleftbar"></div>'
,'                        <div class="nbb-componenttitle">'
,'                            <h2 class="pull-left">The Voice of Management</h2>'
,'                            <a class="morelink pull-right" href="../Pages/AllArticles.aspx">More</a>'
,'                        </div>'
,''
,'                        <div class="voiceofmgt-wrapper">'
,''
,'                            <ul class="list-group">'
,'                                <div class="', noResultsClassName ,'">', $noResults ,'</div>'
,'                            </ul>'
,'                        </div>'
,'                    </div>'
);
                    }
                    ms_outHtml.push(''
,''
,'                </div>'
,'            </div>'
,'        </ul>	'
);

  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_510d8ce37fd14531a59ce19be0a64b3d() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Control_ListWithPaging", DisplayTemplate_510d8ce37fd14531a59ce19be0a64b3d);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fControl_VoiceOfMgtPaging.js", DisplayTemplate_510d8ce37fd14531a59ce19be0a64b3d);
}
//
        $includeLanguageScript("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fControl_VoiceOfMgtPaging.js", "~sitecollection/_catalogs/masterpage/Display Templates/Language Files/{Locale}/CustomStrings.js");
    //
}
RegisterTemplate_510d8ce37fd14531a59ce19be0a64b3d();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fContent Web Parts\u002fControl_VoiceOfMgtPaging.js"), RegisterTemplate_510d8ce37fd14531a59ce19be0a64b3d);
}