'use strict';
var NBB = NBB || {};

var NBB = (function(window, undefined) 
{
	var userProfileProperties,currentUserProperties,curUserdepartment;        
	function perfectScrollWrapper() {
		var ps = new PerfectScrollbar('#quicklinks_Wrapper');
	}
	function getUserProperties(userName) 
	{	
		var user = userName;
		if(userName.indexOf("|")>=0)
		{
			userName = userName.split("|");
			user = userName[2];
		}
		user = "i%3A0%23.f"+"|"+userName[1]+"|"+userName[2];
		
		var siteURL = _spPageContextInfo.webAbsoluteUrl+"/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='"+user+"'";
		$.ajax({
			url:siteURL,
			method:'GET',
			headers:{'Accept':'application/json;odata=verbose'},
			async:false,
			success:function(data)
			{
				userProfileProperties=data.d;
			},
			error:function(error){
			}
		});	
		
		return userProfileProperties;
    }
    function getCurrentUserProperties()
    {
    	$.ajax({  
  
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",  
            headers: { Accept: "application/json;odata=verbose" },
            async:false,
            success: function (data) { 
				  currentUserProperties = data.d;
            },  
            error: function(error) {  
                console.log(error); 
            }  
        });
        
        return currentUserProperties;
    }
    
    function getCurrentUserDepartment()
    {
    	$.ajax({  
  
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",  
            headers: { Accept: "application/json;odata=verbose" },
            async:false,
            success: function (data) { 
            	if (data.d.UserProfileProperties.results.length > 0) {
            		for(var i=0;i<data.d.UserProfileProperties.results.length;i++)
            		{
            			if (data.d.UserProfileProperties.results[i].Key === "Department") 
            			{ 
            				curUserdepartment = data.d.UserProfileProperties.results[i].Value; 
            			}
            		}
            	} 
            },  
            error: function(error) {  
                console.log(error); 
            }  
        });
        
        return curUserdepartment;
    }
	function getUserPictureUrl(webUrl,accountName,size){
		var user = accountName;
		if(accountName.indexOf("|")>=0)
		{
			accountName= accountName.split("|");
			user = accountName[2];
		}
		user = "i%3A0%23.f"+"|"+accountName[1]+"|"+accountName[2];
	    return webUrl + "/_layouts/15/userphoto.aspx?size=" + size + "&accountname=" + user;
	}
	function getCurrentUserPermission(listname)
	{
		
		var web,clientContext,currentUser,oList,perMask;
		var hasEditPermission = true;
		var deferred = $.Deferred();
		
	    clientContext = new SP.ClientContext.get_current();
	    web = clientContext.get_web();
	    currentUser = web.get_currentUser();   
	    oList = web.get_lists().getByTitle('Organizational Announcements');
	    clientContext.load(oList,'EffectiveBasePermissions');
	    clientContext.load(currentUser); 
	    clientContext.load(web);           
	
	    clientContext.executeQueryAsync(
	    function()
	    {
	        if (oList.get_effectiveBasePermissions().has(SP.PermissionKind.editListItems))
	        {
	            hasEditPermission = true;
	        }
	        else
	        {
	             hasEditPermission = false;		        
	        }   
	        deferred.resolve(hasEditPermission);
	    },
	    function(sender, args)
	    {
	        console.log('request failed ' + args.get_message() + '\n'+ args.get_stackTrace());
	    });
	    
	    return deferred.promise();
	}
	function serverDateTime(date) 
	{
        var dt = date || new Date();
        var context = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
        var web = context.get_web();
        var timeZone = web.get_regionalSettings().get_timeZone();
        var deferred = $.Deferred();

        context.load(timeZone);
        context.executeQueryAsync(function (data) {
            var info = timeZone.get_information();
            var offset = (info.get_bias() + info.get_daylightBias()) / 60.0;
            var serverDateTimeNow = new Date(dt.getTime() - offset * 3600 * 1000);
            serverDateTimeNow.setHours(0, 0, 0, 0);
            deferred.resolve(serverDateTimeNow.toISOString());
        },
            function (sender, args) {
                console.log(args.get_message());
                deferred.reject();
            });
        return deferred.promise();

    }
    function drawPieChart()
    {
    	var ctx = document.getElementById("myChart").getContext('2d');
		var myChart = new Chart(ctx, {
		    type: 'pie',
	        data: {
	          datasets: [{
	            data: NBB.chartData,
	            backgroundColor: [
	              "#F7464A",
	              "#46BFBD",
	              "#FDB45C",
	              "#949FB1",
	              "#4D5360",
	            ],
	            label: 'Expenditures'
	          }]
	        },
	        options: {
	          responsive: true,
	          layout: {
	            padding: {
	                left: 20,
	                right: 0,
	                top: 0,
	                bottom: 0
	            }
	          },
	          legend: {
	            display: true,
			            position: 'bottom',
			            labels: {
			                fontSize: 10,
			                fontStyle: 'bold',
			                boxWidth: 10
			            },
	          },
	          animation: {
	            animateScale: true,
	            animateRotate: true
	          },
	          tooltips: {
	            callbacks: {
	              label: function(tooltipItem, data) {
	                  var dataset = data.datasets[tooltipItem.datasetIndex];
	                var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
	                  return previousValue + currentValue;
	                });
	                var currentValue = dataset.data[tooltipItem.index];
	                var precentage = Math.floor(((currentValue/total) * 100)+0.5);         
	                return precentage + "%";
	              }
	            }
	          }
	        }
		});
    }
	return {
	    PerfectScrollWrapper: perfectScrollWrapper,
	    GetUserProfileProperties: getUserProperties,
	    UserProfileProperties:userProfileProperties,
	    GetCurrentUserProperties:getCurrentUserProperties,
	    GetCurrentUserDepartment:getCurrentUserDepartment,
	    GetUserPictureUrl:getUserPictureUrl,
	    ServerDateTime:serverDateTime,
	    GetCurrentUserPermission:getCurrentUserPermission,
	    DrawPieChart:drawPieChart
	};
	
})(window);
function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}
