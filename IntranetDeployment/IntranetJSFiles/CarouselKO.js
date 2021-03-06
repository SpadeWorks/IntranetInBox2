function CarouselKOLandingRender() {
    var LandingView = new CarouselLandingKOModel.CarouselLandingViewModel();
    ko.applyBindings(LandingView, document.getElementById("carouselDiv"));
}

$(document).ready(function () {
    SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () {
        CarouselKOLandingRender();
    });


});

var CarouselLandingKOModel = (function () {
    var CarouselLandingKOModel = {};
    var surveyListName;
    var isPoll;
    var object = {};
    CarouselLandingKOModel.CarouselLandingViewModel = function () {

        var self = this;
        self.CarouselArray = ko.observableArray();
        self.IndicatorArray = ko.observableArray();
        self.id = ko.observable();
        self.title = ko.observable();
        self.carouselLimit = ko.observable();
        self.DefaultImage = ko.observable();

        self.GetCarouselData = function (limit) {
            var deferred = $.Deferred();
            NBB.ServerDateTime().then(function (date) {
                var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OrganizationalAnnouncements')" +
                    "/items?$select=Id,Title,AnnouncementDetails,Expires,ContentPriority&$filter=OData__ModerationStatus eq 0 and Expires ge '" + date + "'&$top=" + limit + "&$orderby=ContentPriority asc";

                $.ajax({
                    url: siteUrl,
                    method: 'GET',
                    headers: { 'Accept': 'application/json; odata=nometadata' },
                    success: function (data) {
                        var itemcount = 0;
                        if (data.value.length > 0) {
                            $.each(data.value, function (position, item) {

                                self.GetBannerImage(item.Id).then(function (bannerImage) {
                                    var date = self.GetDate(new Date(item.Expires));
                                    var readMore = _spPageContextInfo.webAbsoluteUrl + "/Pages/OrgAnnouncementDetails.aspx?ItemID=" + item.Id;
                                    if (!isExpired(date)) {
                                        if (itemcount === 0) {
                                            self.CarouselArray.push(new CarouselArrayItemPush(item.Id, item.Title, bannerImage, (item.EmployeeDepartment && item.EmployeeDepartment[0] != undefined ? item.EmployeeDepartment[0].Label : ""), itemcount, "active", date, readMore));
                                            self.IndicatorArray.push(new IndicatorArrayItemPush(itemcount, "active"));
                                            itemcount++;
                                        }
                                        else {
                                            self.CarouselArray.push(new CarouselArrayItemPush(item.Id, item.Title, bannerImage, (item.EmployeeDepartment && item.EmployeeDepartment[0] != undefined ? item.EmployeeDepartment[0].Label : ""), itemcount, "", date, readMore));
                                            self.IndicatorArray.push(new IndicatorArrayItemPush(itemcount, ""));
                                            itemcount++;
                                        }
                                    }
                                });


                            });
                        }
                        else {
                            self.CarouselArray.push(new CarouselArrayItemPush("ID", "Default", "<img src='.." + self.DefaultImage + "'/>", "Default", 0, "active", "Date", "#"));
                            self.IndicatorArray.push(new IndicatorArrayItemPush(0, "active"));
                        }
                        deferred.resolve(data.value);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            });

            return deferred.promise();
        }

        self.GetBannerImage = function (id) {
            var deferred = $.Deferred();
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OrganizationalAnnouncements')/items(" + id + ")/FieldValuesAsHtml?$select=BannerImage";
            $.ajax({
                url: siteUrl,
                method: 'GET',
                headers: { 'Accept': 'application/json;odata=verbose' },
                async: false,
                success: function (data) {
                    deferred.resolve(data.d.BannerImage);
                },
                error: function (error) {
                    console.log(error);
                }
            });
            return deferred.promise();
        }

        self.GetCarouselLimit = function () {
            var deferred = $.Deferred();
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Application_Configuration')/items?$select=Key,Value&$filter=Key eq 'OrganizationAnnouncementCarouselLimit' or Key eq 'CarouselDefaultImage'";
            $.ajax({
                url: siteUrl,
                method: 'GET',
                headers: { 'Accept': 'application/json; odata=nometadata' },
                success: function (data) {
                    deferred.resolve(data.value || 1);
                },
                error: function (error) {
                    console.log(error);
                }
            });

            return deferred.promise();
        }

        function CarouselArrayItemPush(id, Title, bannerImage, department, position, isActive, expireDate, readMore) {
            var self = this;
            self.id = id;
            self.title = Title;
            self.bannerImage = bannerImage;
            self.department = department;
            self.position = position;
            self.active = isActive;
            self.expireDate = expireDate;
            self.readMore = readMore;
        }

        function IndicatorArrayItemPush(position, isActive) {
            var self = this;
            self.position = position;
            self.active = isActive;
        }
        function isExpired(date) {

            var today = new Date();
            var expireDate = moment(date).format("MM/DD/YYYY");
            expireDate = new Date(expireDate);
            today.setHours(0, 0, 0, 0);
            expireDate.setHours(0, 0, 0, 0);

            if (expireDate >= today) {
                return false;
            }
            else {
                return true;
            }

        }

        self.GetItemTypeForListName = function (name) {
            return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("_x0020_").slice(1) + "ListItem";
        }
        self.GetDate = function (date) {
            var dt = moment(date);
            return dt.format("DD MMM, YYYY");
        }
        self.GetCarouselLimit().then(function (data) {
            self.carouselLimit = data[0].Value;
            self.DefaultImage = data[1].Value;
            self.GetCarouselData(self.carouselLimit).then(function () {
                $("#carouselDiv").css({ opacity: 1 });
            });
        });
    };
    return CarouselLandingKOModel;
})();