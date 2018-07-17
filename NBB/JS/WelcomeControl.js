function EmployeeKOLandingRender() {
    var LandingView = new EmployeeKOModel.EmployeeViewModel();
    var viewModelDiv = document.getElementById("LogoAndWelcomControl");
    ko.applyBindings(LandingView, viewModelDiv);    
}

$(document).ready(function () {
    EmployeeKOLandingRender();

});

var EmployeeKOModel = (function () {
    var EmployeeKOModel = {};
    var surveyListName;
    var isPoll;
    var object = {};
    EmployeeKOModel.EmployeeViewModel = function () {

        var self = this;
        self.Employees = ko.observableArray();
        self.myNBBLogo = ko.observable();
        self.myNBBURL = ko.observable();
        self.NBBLogo = ko.observable();
        self.NBBURL = ko.observable();
        
        self.checkUserCountry = function () {
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
                headers: { Accept: "application/json;odata=verbose" },
                success: function (data) {
                    try {
                        var ProfilepicUrl = data.d.PictureUrl;

                        if (data.d.PictureUrl == null) {
                            ProfilepicUrl = "http://icsp2016dev102:20165/sites/NBB/Style%20Library/NBB/Images/Default-profile-pic.jpg";
                        }
                        var personalurl=data.d.UserUrl;
                        personalurl= personalurl.split("Person.aspx?")[0]+"Person.aspx";
                        self.Employees.push(new EmployeeList(data.d.DisplayName, ProfilepicUrl, personalurl, ""));
                    } catch (err2) {
                    }
                },
                error: function (jQxhr, errorCode, errorThrown) {
                    alert(errorThrown);
                }
            });
        }
		self.GetLogoAndUrl = function()
		{
			var siteUrl = "https://gohelmahendrak.sharepoint.com/sites/NBB/_api/web/lists/getbytitle('Site Configuration')/items?$select=Title,Value";
			$.ajax({
				url:siteUrl,
				method:'GET',
				headers:{'Accept':'application/json;odata=nometadata'},
				success:function(data)
				{
                    if(data.value.length>0)
                    {
                        for(var i=0;i<data.value.length;i++)
                        {
                            if(data.value[i].Title==="My NBB Logo")
                            {
                                self.myNBBLogo("https://gohelmahendrak.sharepoint.com/sites/NBB"+data.value[i].Value);
                            }
                            if(data.value[i].Title==="NBB Logo")
                            {
                                self.NBBLogo("https://gohelmahendrak.sharepoint.com/sites/NBB"+data.value[i].Value);
                            }
                            if(data.value[i].Title==="My NBB URL")
                            {
                                self.myNBBURL(data.value[i].Value);
                            }
                            if(data.value[i].Title==="NBB URL")
                            {
                                self.NBBURL(data.value[i].Value);
                            }
                        }
                    }
				},
				error:function(error)
				{
					
				}
			});
		}
        function EmployeeList(name, Profilepicurl, mysiteurl, location) {
            var self = this;
            self.Name = name;
            self.ProfilepicUrl = Profilepicurl;
            self.MySiteUrl = mysiteurl;
            self.Location = location;
        }

        
        self.checkUserCountry();
        self.GetLogoAndUrl();
    };
    return EmployeeKOModel;
})();
