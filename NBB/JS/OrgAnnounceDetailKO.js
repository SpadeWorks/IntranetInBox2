$(document).ready(function () {
    OrgAnnounceDetailKOModel.OrgAnnounceDetailLandingRender();
});
var OrgAnnounceDetailKOModel = (function () {
    var OrgAnnounceDetailKOModel = {};
    var OrgAnnounceDetailLandingRender = function() {
        var LandingView = new OrgAnnounceDetailKOModel.OrgAnnounceDetailViewModel();
        var viewModelDiv = document.getElementById("OrgAnnounceDetail");
        ko.applyBindings(LandingView, viewModelDiv);
    }
    
    OrgAnnounceDetailKOModel.OrgAnnounceDetailViewModel = function () {
        var self = this;
        self.bannerImage = ko.observable();
        self.title = ko.observable();
        self.lastModifiedDate = ko.observable();
        self.expiryDate = ko.observable();
        self.author = ko.observable();
        self.authorEmail = ko.observable();
        self.userProfilePic = ko.observable();
        self.description = ko.observable();
        self.department = ko.observable();
        self.department = ko.observable();
        self.hasEditPermission = ko.observable(false);
        
		var itemId = GetParameterByName("ItemID");
		
        self.GetAnnouncementDetails = function()
        {
            var deferred = $.Deferred();
            var siteUrl = _spPageContextInfo.webAbsoluteUrl+"/_api/Lists/getbytitle('Organizational Announcements')/items('"+itemId+"')?$select=Title,AnnouncementDetail,EmployeeDepartment,Modified,Expires,ContentAuthor/Title,ContentAuthor/EMail&$expand=ContentAuthor";
            $.ajax(
            {
                url:siteUrl,
                method:'GET',
                headers:{'Accept':'application/json;odata=nometadata'},
                success:function(data)
                {
                	self.title(data.Title);
                    self.bannerImage();
                    self.description(data.AnnouncementDetail);
                    self.author(data.ContentAuthor.Title);
                    var userName = "i%3A0%23.f|membership|"+data.ContentAuthor.EMail;
                    self.userProfilePic(NBB.GetUserPictureUrl(_spPageContextInfo.webAbsoluteUrl,userName ,"M"));
                    self.lastModifiedDate(moment(data.Modified).format("DD MMM, YYYY"));
                    self.expiryDate(moment(data.Expires).format("DD MMM, YYYY"));
                    self.department(data.EmployeeDepartment[0].Label);
                },
                error:function(error)
                {
                    console.log(error);
                }
            });
            return deferred.promise();
        }
        self.GetBannerImage = function () {
            var deferred = $.Deferred();
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Organizational Announcements')/items(" + itemId + ")/FieldValuesAsHtml?$select=BannerImage";
            $.ajax({
                url: siteUrl,
                method: 'GET',
                headers: { 'Accept': 'application/json;odata=verbose' },
                async: false,
                success: function (data) {
                    self.bannerImage(data.d.BannerImage);
                },
                error: function (error) {
                    console.log(error);
                }
            });
            return deferred.promise();
        }

        function GetParameterByName(paramname) {
			    JSRequest.EnsureSetup();
			    return JSRequest.QueryString["" + paramname + ""];
		}
		self.getCurrentUserPermission = function()
		{
			NBB.GetCurrentUserPermission("Organizational Announcements").then(function(data){
				if(data)
		        {
		            self.hasEditPermission(true);
		        }
		        else
		        {
		             self.hasEditPermission(false);		        
		        }   
			})	
	        
		}	
		self.getCurrentUserPermission();
    	self.GetAnnouncementDetails();
    	self.GetBannerImage();
    }
    
    return {
    	OrgAnnounceDetailLandingRender: OrgAnnounceDetailLandingRender,
    	OrgAnnounceDetailKOModel:OrgAnnounceDetailKOModel
    	};
})();