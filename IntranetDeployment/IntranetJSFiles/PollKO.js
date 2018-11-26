var NBB = NBB || {};
NBB.chartData = [];
NBB.chartLabels = [];

$(document).ready(function () {
    PollKOModel.PollLandingRender();

});
var PollKOModel = (function () {
    var PollKOModel = {};
    var surveyListName;
    var isPoll;
    var object = {};
    var PollLandingRender = function () {
        var LandingView = new PollKOModel.PollViewModel();
        var viewModelDiv = document.getElementById("poll");
        ko.applyBindings(LandingView, viewModelDiv);
    }

    PollKOModel.PollViewModel = function () {

        var self = this;
        self.question = ko.observable();
        self.questionInternalName = ko.observable();
        self.UserResponse = ko.observable();
        self.answers = ko.observableArray();
        self.userResponse = ko.observable();
        self.pollVisible = ko.observable(true);
        self.chartVisible = ko.observable(false);
        self.AllResponse = ko.observableArray();
        self.surveyLink = ko.observable();
        self.ViewResponseLink = ko.observable();

        /**************************************Functionalityy for Poll Question Starts********************************/
        self.GetSurveyListName = function () {
            var deferred = $.Deferred(), today = new Date(), pastDate = new Date("01/01/2001"), count = 0;
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('IntranetSurvey')/items?select=Title,IsPoll,SurveyStartDate,SurveyEndDate,SurveyLink,ViewResponse&$filter=OData__ModerationStatus eq 0 &$orderby=SurveyEndDate,SurveyStartDate desc";
            $.ajax({
                url: siteUrl,
                method: 'GET',
                headers: { 'Accept': 'application/json; odata=nometadata' },
                success: function (data) {

                    if (data.value.length > 0) {
                        for (var i = 0; i < data.value.length; i++) {
                            startDate = new Date(data.value[i].SurveyStartDate);
                            startDate.setHours(0, 0, 0, 0);
                            today.setHours(0, 0, 0, 0);
                            endDate = new Date(data.value[i].SurveyEndDate);
                            endDate.setHours(0, 0, 0, 0);
                            pastDate.setHours(0, 0, 0, 0);

                            if (startDate >= today && startDate <= today) {
                                deferred.resolve(data.value[i]);
                                break;
                            }
                            else if (endDate > pastDate && endDate < today) {
                                pastDate = new Date(data.value[i].SurveyEndDate);
                                count = i;
                            }
                        }
                        deferred.resolve(data.value[count]);
                    }
                },
                error: function (error) {
                    deferred.resolve(error);
                }
            });

            return deferred.promise();
        }
        self.GetSurveyQuestion = function (title, isPoll) {
            var deferred = $.Deferred();
            var itemID = "";
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + title + "')/fields?$filter=(CanBeDeleted eq true)";
            $.ajax({
                url: siteUrl,
                method: 'GET',
                headers: { 'Accept': 'application/json; odata=nometadata' },
                async: false,
                success: function (data) {

                    self.questionInternalName(data.value[0].InternalName);
                    self.question(data.value[0].Title);
                    for (var i = 0; i < data.value[0].Choices.length; i++) {
                        self.answers.push(new AnswerList(data.value[0].Choices[i], itemID = "option" + (i + 1)));
                        object[data.value[0].Choices[i]] = 0;
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
        self.checkUserResponse = function (listname) {
            var deferred = $.Deferred();
            var isSubmitted = false;
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + surveyListName + "')/items";
            $.ajax({
                url: siteUrl,
                method: 'GET',
                headers: { 'Accept': 'application/json; odata=nometadata' },
                success: function (data) {
                    for (var i = 0; i < data.value.length; i++) {
                        var columnName = self.questionInternalName();
                        if (data.value[i].AuthorId === _spPageContextInfo.userId) {
                            isSubmitted = true;
                            self.userResponse(data.value[i]["" + columnName + ""]);
                            break;
                        }
                    }
                    deferred.resolve(isSubmitted);
                },
                error: function (error) {
                    console.log(error);
                }

            });
            return deferred.promise();
        }
        self.saveUserResponse = function () {
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + surveyListName + "')/items";
            var listType = self.GetItemTypeForListName(surveyListName);
            var columnName = self.question();
            columnName = self.questionInternalName();
            list = surveyListName.split(' ').join('_x0020_');

            var item = {};
            item["__metadata"] = { "type": "SP.Data." + list + "ListItem" };

            item["" + columnName + ""] = "" + self.userResponse() + "";

            if (self.userResponse() === "" || self.userResponse() === undefined) {
                alert("please select answer");
            }
            else {
                $.ajax({
                    url: siteUrl,
                    type: 'POST',
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify(item),
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    },
                    success: function (data) {
                        //alert("Your Response saved Successfully");
						/*dialog.alert({
							title:"Succesful",
							message:"message",
							animation:"fade",
							callback: function(value){
								
							}
						});*/
                        self.GetAllResponse(surveyListName).then(function (data) {
                            if (data) {
                                NBB.DrawPieChart();
                                //createPieChart();
                            }
                        });
                        self.pollVisible(false);
                        self.chartVisible(true);
                    },
                    error: function (data) {
                        alert("Some error in saving your response");
                    }
                });
            }

        }
        /**************************************Functionalityy for Poll Question Ends********************************/
        /**************************************Functionalityy for Poll Pie Chart Starts*****************************/
        self.GetAllResponse = function () {
            var deferred = $.Deferred();
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + surveyListName + "')/items";
            var dataLoaded = false;
            $.ajax({
                url: siteUrl,
                method: 'GET',
                headers: { 'Accept': 'application/json; odata=nometadata' },
                success: function (data) {
                    var columnName = self.question();
                    columnName = self.questionInternalName();
                    for (property in object) {
                        var temp = [];
                        var answerCount = data.value.reduce(function (n, data) {
                            return n + (property == data["" + columnName + ""]);
                        }, 0);
                        self.AllResponse.push(new AllAnswerListPush(property, answerCount));
                        if (property.length > 10) {
                            property = property.substr(0, 7) + "...";
                        }
                        NBB.chartLabels.push(property);
                        NBB.chartData.push(answerCount);
                    }
                    for (var i = 0; i < data.value.length; i++) {
                        if (data.value[i].AuthorId === _spPageContextInfo.userId) {
                            self.userResponse(data.value[i]["" + columnName + ""]);
                            break;
                        }
                        else {
                            self.userResponse("N/A");
                        }

                    }
                    dataLoaded = true;
                    deferred.resolve(dataLoaded);
                },
                error: function (error) {
                    console.log(error);
                    deferred.resolve(error);
                }

            });
            return deferred.promise();
        }
        /**************************************Functionalityy for Poll Pie Chart Ends*****************************/
        /**************************************Functionalityy for Other Questions Starts**************************/

        /**************************************Functionalityy for Other Questions Ends****************************/

        /**************************************Common Functions Starts*************************************/

        function AnswerList(answer, id) {
            var self = this;
            self.answer = answer;
            self.optionID = id;
        }
        function AllAnswerListPush(answer, count) {
            var self = this;
            self.answer = answer;
            self.count = count;
        }
        /**************************************Common Functions Ends*************************************/
        /**************************************Calling Functions Starts*************************************/
        self.GetItemTypeForListName = function (name) {
            return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("_x0020_").slice(1) + "ListItem";
        }
        self.GetDate = function (date) {
            var dt = moment(date, "YYYY-MM-DD HH:mm:ss");
            return dt.format("DD MMM, YYYY");
        }
        self.GetSurveyListName().then(function (data) {
            surveyListName = data.Title;
            if (isExpired(data.SurveyEndDate)) {
                self.GetSurveyQuestion(surveyListName, isPoll);
                self.GetAllResponse(surveyListName).then(function (data) {
                    if (data) {
                        NBB.DrawPieChart();
                    }
                });
                self.pollVisible(false);
                self.chartVisible(true);
            }
            else {
                self.pollVisible((data.IsPoll[0] === "Yes") ? true : false);

                if (self.pollVisible()) {
                    self.GetSurveyQuestion(surveyListName, isPoll);
                    self.checkUserResponse(surveyListName).then(function (data) {
                        if (data) {
                            self.GetSurveyQuestion(surveyListName, isPoll);
                            self.GetAllResponse(surveyListName).then(function (data) {
                                if (data) {
                                    NBB.DrawPieChart();
                                }
                            });
                            self.pollVisible(false);
                            self.chartVisible(true);
                        }
                    });
                }
                else {

                    self.chartVisible(false);
                    self.surveyLink(data[0].SurveyLink.Url);
                    self.ViewResponseLink(data[0].ViewResponse.Url);
                }
            }


        });
        /**************************************Calling Functions Ends*************************************/
        function shuffle(a) {
            var j, x, i;
            for (i = a.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }

            return a;
        }
        function isExpired(date) {
            var today = new Date(),
                expireDate = new Date(date);
            today.setHours(0, 0, 0, 0);
            expireDate.setHours(0, 0, 0, 0);

            if (expireDate >= today) {
                return false;
            }
            else {
                return true;
            }
        }

        /**************************************Pie charts functions starts*************************************/

        /**************************************Pie charts functions starts*************************************/

    };
    return {
        PollLandingRender: PollLandingRender,
        PollKOModel: PollKOModel
    };
})();