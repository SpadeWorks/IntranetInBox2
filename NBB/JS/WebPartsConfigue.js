// ExecuteOrDelayUntilScriptLoaded(getSiteConfigurationData, "core.js");
 $(document).ready(function() {
 SP.SOD.executeFunc("SP.js","SP.ClientContext",getSiteConfigurationData);});
 
 var clientContext;
 var webPartProperties;
 var getdatafromsubsite="No";
 var pagetitle="";
 function getSiteConfigurationData()
 {
	pagetitle=document.title;
    clientContext = SP.ClientContext.get_current();
    var list = clientContext.get_web().get_lists().getByTitle('Site Configuration');
    var q = new SP.CamlQuery();
    var subsite = new SP.CamlQuery();
    subsite.set_viewXml("<View><Query><Where><Eq><FieldRef Name='Title' /><Value Type='Text'>Get data from subsite</Value></Eq></Where></Query></View>")
    q.set_viewXml("<View><Query><Where><Or><Contains><FieldRef Name='Category' /><Value Type='Text'>"+pagetitle+"</Value></Contains><Contains><FieldRef Name='Category' /><Value Type='Text'>Common</Value></Contains></Or></Where></Query></View>");
    this.listitem=list.getItems(subsite);
    this.arlistitems = list.getItems(q);
   
    
    clientContext.load(listitem);    
    clientContext.load(arlistitems);
    clientContext.executeQueryAsync(Function.createDelegate(this, this.ExecuteOnSuccess), Function.createDelegate(this, this.ExecuteOnFailure));
 }
 
 function ExecuteOnSuccess() {
 
    var subsiteitems=listitem.getEnumerator();
    if(listitem.get_count()>0)
	    {
	    while (subsiteitems.moveNext()) {
	        var item = subsiteitems.get_current();
	       getdatafromsubsite =item.get_item('Value');

	        }

	    }



    var configueItems = arlistitems.getEnumerator();   
	    if(arlistitems.get_count()>0)
	    {
	        while (configueItems.moveNext()) {
	        var item = configueItems.get_current();
	        var congfigueKey = item.get_item('Title'); 
	         var congfigueValue =Number(item.get_item('Value'));
	         var configCategory = item.get_item('Category');
	         if(configCategory == "Common")
	         {
	         configCategory =pagetitle;
	         }
	          getSearchWebPart(congfigueKey ,congfigueValue,configCategory,getdatafromsubsite); 
         
		}


				/*
				
				if(congfigueKey.indexOf("Content Search") != -1)  
				  {      
				        if (collWebPart.get_count()) {
				          var webPartEnumerator = collWebPart.getEnumerator();
				          while (webPartEnumerator.moveNext()) {
				          debugger;
				             var webPartDef = webPartEnumerator.get_current();
				             var webPart = webPartDef.get_webPart();                 
							
							 
				             if(webPart.get_title().indexOf(congfigueKey) != -1) {
				                webPartProperties = webPart.get_properties();             
				                               
				                webPartProperties.set_item("NumberOfItems",congfigueValue);
				                getSearchWebPart(getdatafromsubsite);
				
							    webPartDef.saveWebPartChanges();
							    				
				    
				                // Take a look the props here, QueryTemplate maybe
				                
				                //webPartProperties.set_item("DataProviderJSON", newDataProviderJSONval);                
				            clientContext.load(webPart);
				            clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
				           }
						 } 
				        }
				        }  */        
    
    }
    
}

function ExecuteOnFailure(sender, args){

console.log('request failed ' + args.get_message() + '\n' + args.get_stackTrace());
}
 
 
 
 
function onQuerySucceeded() {

   console.log('Configuration changed for Web Part');
}

function onQueryFailed(sender, args) {

    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
 
           
 function getSearchWebPart(congfigueKey ,congfigueValue,configCategory,getdatafromsubsite) { 
        var dpDataProvider=false;       
        if (typeof Srch !== "undefined" && typeof Srch.ScriptApplicationManager !== "undefined" && typeof Srch.ContentBySearch !== "undefined") {
            var groups = Srch.ScriptApplicationManager.get_current().queryGroups;             
            $.each(groups, function () {
                if (this.dataProvider !== null && this.displays.length > 0) {
                   // $.each(this.displays, function () {
                        if (this.dataProvider.get_queryTemplate() != null) {
                            var querygroup=this.dataProvider.get_queryPropertiesTemplateUrl();
                            if(querygroup.indexOf(configCategory)>=0)
                            {
                             if (this.dataProvider.get_queryTemplate().indexOf(congfigueKey) !== -1) {
                             
	                             if(this.dataProvider.get_queryTemplate().indexOf("getSearchItemsPath") !== -1)
	                             {
		                             if(getdatafromsubsite.match(/yes/i))
			                             {
			                             var query = this.dataProvider.get_queryTemplate().replace("getSearchItemsPath",_spPageContextInfo.webAbsoluteUrl);
			                              this.dataProvider.set_queryTemplate(query);
			                             }
			                             else
			                             {
			                             var path=_spPageContextInfo.webAbsoluteUrl+"/Lists";
			                             var query = this.dataProvider.get_queryTemplate().replace("getSearchItemsPath",path);
			                             this.dataProvider.set_queryTemplate(query);
			                             }
	                             
	                             }
                              this.dataProvider.set_resultsPerPage(congfigueValue);
                              this.dataProvider.issueQuery();
                               // dpDataProvider = this.get_dataProvider();
                               // dpDataProvider = true;
                                //wpType.saveWebPartChanges();                                   
                                return false;
                              }	                           
                            }
                            else
                            {
                            if (this.dataProvider.get_queryTemplate().indexOf(congfigueKey) !== -1) {
	                            if(this.dataProvider.get_queryTemplate().indexOf("getSearchItemsPath") !== -1)
		                             {
			                             if(getdatafromsubsite.match(/yes/i))
			                             {
			                             var query = this.dataProvider.get_queryTemplate().replace("getSearchItemsPath",_spPageContextInfo.webAbsoluteUrl);
			                              this.dataProvider.set_queryTemplate(query);
			                             }
			                             else
			                             {
			                             var path=_spPageContextInfo.webAbsoluteUrl+"/Lists";
			                             var query = this.dataProvider.get_queryTemplate().replace("getSearchItemsPath",path);
			                             this.dataProvider.set_queryTemplate(query);
			                             }
		                             
		                             }

	                              this.dataProvider.set_resultsPerPage(congfigueValue);
	                              this.dataProvider.issueQuery();
	                               // dpDataProvider = this.get_dataProvider();
	                               // dpDataProvider = true;
	                                //wpType.saveWebPartChanges();                                   
	                                return false;
	                              }

                            }
                            
                        }
                   // });
                }
            });
        }

       
    }

