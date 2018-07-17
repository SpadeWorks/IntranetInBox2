/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_92fd24a804c94be198a54e7ad2b13cc4(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_92fd24a804c94be198a54e7ad2b13cc4.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fItem_KPCU_Happenings.js';
  ctx['DisplayTemplateData']['TemplateType']='Item';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['ManagedPropertyMapping']={'EventType':['EventType'], 'owstaxIdEventType1':['owstaxIdEventType1'], 'Link URL':['Path'], 'Line 1':['Title'], 'Line 2':['EventDateOWSDATE'], 'Line 3':['EndDateOWSDATE'], 'Line 5':['MPLocation'], 'SecondaryFileExtension':null, 'ContentTypeId':null};
  var cachePreviousItemValuesFunction = ctx['ItemValues'];
  ctx['ItemValues'] = function(slotOrPropName) {
    return Srch.ValueInfo.getCachedCtxItemValue(ctx, slotOrPropName)
};

ms_outHtml.push('',''
);
			var linkURL = $getItemValue(ctx, "Link URL");
			linkURL.overrideValueRenderer($urlHtmlEncode);			
			var line1 = $getItemValue(ctx, "Line 1");//Title
			var line2 = $getItemValue(ctx, "Line 2");//Start date
			var startDate = "";
			var startDate1 = "";
			var actualhrs = "";
			var min = "";
			var ampm = "";			
			if(line2.value)
			{
				startDate = line2.value.format("MMM");
				startDate1 = line2.value.format("dd");
				actualhrs = line2.value.format("hh");
				min = line2.value.format("mm");
				ampm = line2.value.format("tt");
			}
			var line3 = $getItemValue(ctx, "Line 3");//End date
			var EndDate = "";
			var EndDate1 = "";
			if(line3.value)
			{
				EndDate =line3.value.format("MMM");
				EndDate1 =line3.value.format("dd");
			}
			var Category = $getItemValue(ctx, "EventType");
			//var Category1 = $getItemValue(ctx, "owstaxIdEventType1");			
			var tag = document.createElement('div');
			tag.innerHTML = line1.value;
			var Location =  $getItemValue(ctx, "Line 5");			
		ms_outHtml.push(''
,'        <div class="event_box">           '
,'            <div class="happeningcategory">'
,'                <span class="news_btn"> ', Category ,'</span>'
,'            </div>           '
,'            <div class="eventdetails_wrapper">'
,'                <div class="col-md-3 col-sm-3 eventDate">                    '
,'                    <div class="eventdate_container">'
,'                        <div class="from_date">'
,'                            <span class="big_date">', startDate1 ,' </span>'
,'                            <span class="month">', startDate ,'</span>'
,'                        </div>'
);
						if (startDate1 != EndDate1)
						{
						ms_outHtml.push(''
,'	                        <div class="dash"> - </div>'
,'	                        <div class="to_date">'
,'	                            <span class="small_date">', EndDate1 ,'</span>                                    '
,'	                            <span class="small_month">', EndDate ,'</span>'
,'	                        </div>'
);
						}
						ms_outHtml.push(''
,'                    </div>                       '
,'                </div>'
,'                <div class="eventtitle_container">'
,'                    <a href="', linkURL ,'" title="', $htmlEncode(tag.innerHTML) ,'"><span class="eventtitle">', line1 ,'</span></a>'
,'                    <span class="time"><i class="fa fa-clock-o"></i> ', actualhrs ,' ', min ,' ', ampm ,'</span>'
,'                    <span class="global"><i class="fa fa-map-marker"></i> ', Location  ,' </span>	               '
,'                </div>                  '
,'            </div>'
,'        </div>'
,'    '
);

  ctx['ItemValues'] = cachePreviousItemValuesFunction;
  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_92fd24a804c94be198a54e7ad2b13cc4() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("TwoLines", DisplayTemplate_92fd24a804c94be198a54e7ad2b13cc4);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fItem_KPCU_Happenings.js", DisplayTemplate_92fd24a804c94be198a54e7ad2b13cc4);
}

}
RegisterTemplate_92fd24a804c94be198a54e7ad2b13cc4();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fItem_KPCU_Happenings.js"), RegisterTemplate_92fd24a804c94be198a54e7ad2b13cc4);
}