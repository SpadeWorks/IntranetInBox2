/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_9e0dc02574894314adf08047fad42137(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_9e0dc02574894314adf08047fad42137.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fcontrol_Happenings.js';
  ctx['DisplayTemplateData']['TemplateType']='Control';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

ms_outHtml.push('',''
); 
		if (!$isNull(ctx.ClientControl) && !$isNull(ctx.ClientControl.shouldRenderControl) && !ctx.ClientControl.shouldRenderControl()){
		    return "";
		}
		ctx.ListDataJSONGroupsKey = "ResultTables";
		var $noResults = Srch.ContentBySearch.getControlTemplateEncodedNoResultsMessage(ctx.ClientControl);
		ctx["CurrentItems"] = ctx.ListData.ResultTables[0].ResultRows;
		var itemCount = ctx["CurrentItems"].length;
		var noResultsClassName = "ms-srch-result-noResults";
		var ListRenderRenderWrapper = function(itemRenderResult, inCtx, tpl) {
		    var iStr = [];
		    iStr.push(itemRenderResult);
		    return iStr.join('');
		}
		ctx['ItemRenderWrapper'] = ListRenderRenderWrapper;
		
		//Post Render Call back	  
		AddPostRenderCallback(ctx, function() {
		    //Added below function to query data after changing dropdown value 
		    $("#selectHappenings").val($(".happenings-wrapper").data("selectedValue"));
		    var selectedText = "";
		    $("#selectHappenings").change(function(e) {
		        selectedText = e.target.value;
		        if (!selectedText || selectedText == "All") {
		            queryTemplate = '{?{searchboxquery}} path:"{\\SiteCollection.Url}/Lists/Happenings/" RefinableDate01 >= {Today} ContentType:KPCU_Happenings';
		        } else {
		            queryTemplate = '{?{searchboxquery}} path:"{\\SiteCollection.Url}/Lists/Happenings/" RefinableDate01 >= {Today} ContentType:KPCU_Happenings EventType="' + selectedText + '"';
		        }
		        ctx.DataProvider.set_queryTemplate(queryTemplate);
		        ctx.DataProvider.issueQuery();
		        //Store selected value in below class so once content search reloads after chnaging value from dropdwon then it will pick this selected value
		        $(".happenings-wrapper").data("selectedValue", selectedText);
		    });
		    //Declared (var allTermValues) in KPCU_Main.js file 
		    if (allTermValues.length == 0) {
		        var scriptbase = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/";	        
		        $.getScript(scriptbase + "SP.js", function() {
		            $.getScript(scriptbase + "SP.Taxonomy.js", function() {
		            	//Get termsets to show in dropdown values
		                KPCU.GetTermSets("431cbba8-79df-4708-bf96-6cc1787b5fdf").done(function(TermSets) {
		                    var mySelect = $('#selectHappenings');
		                    mySelect.append (
		                        $('<option></option>').val("All").html("All")
		                    );
		                    $.each(TermSets, function(val, text) {
		                        mySelect.append(
		                            $('<option></option>').val(text).html(text)
		                        );
		                    });
		                    //Get stored selected value from (happenings-wrapper) class
		                    $("#selectHappenings").val($(".happenings-wrapper").data("selectedValue"));
		                });
		            });	           
		        });
		    } else {
		        var mySelect = $('#selectHappenings');
		        mySelect.append (
		            $('<option></option>').val("All").html("All")
		        );
		        $.each(allTermValues, function(val, text) {
		            mySelect.append(
		                $('<option></option>').val(text).html(text)
		            );
		        });
		        $("#selectHappenings").val($(".happenings-wrapper").data("selectedValue"));
		    }
		    $(".happening_box").height($(".banner-image").height() +160);
		});
	ms_outHtml.push(''
,''
,'	<div class="happening_box featured_box fullwidth">'
,'	    <div class="row">'
,'	        <div class="featurebgimg"></div>'
,'	        <div class="featureheading_wrapper">'
,'	            <div class="col-md-8">'
,'	                <h3 class="featurebox_heading blue">Happenings</h3>'
,'	            </div>	           '
,'                <div class="ddlhappening">                   '
,'    				<select id="selectHappenings"></select>'
,'                </div>	               '
,'	        </div>'
,'	        <div class="col-md-12">'
,'	            <div class="event_wrapper">'
);
						//Checking count of current Items.	 
						if (ctx["CurrentItems"].length > 0)
						{
							ms_outHtml.push(''
,'			                ', ctx.RenderGroups(ctx) ,''
);
						}
						else 
						{							
						ms_outHtml.push(''
,'	                		<div class="no-data-msg">No data is currently available.</div>'
); 
	                	}
	                ms_outHtml.push(''
,'	            </div>	            '
,'	        </div>'
,'	        <div class="view_morebox">'
,'                <a href="HappeningsDetails.aspx">'
,'                    <div class="viewmore_text">View All</div>'
,'                    <div class="next_arrow">'
,'                    </div>'
,'                </a>'
,'            </div>'
,'	    </div>'
,'	</div>'
);

  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_9e0dc02574894314adf08047fad42137() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Control_List", DisplayTemplate_9e0dc02574894314adf08047fad42137);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fcontrol_Happenings.js", DisplayTemplate_9e0dc02574894314adf08047fad42137);
}

}
RegisterTemplate_9e0dc02574894314adf08047fad42137();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fDisplay Templates\u002fKPCU\u002fcontrol_Happenings.js"), RegisterTemplate_9e0dc02574894314adf08047fad42137);
}