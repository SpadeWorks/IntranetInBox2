function GetAuditReport() {
    var self = this
    self.pastDueHighCount = ko.observable(0);
    self.pastDueMediumCount = ko.observable(0);
    self.pastDueLowCount = ko.observable(0);
    self.pastNotDueHighCount = ko.observable(0);
    self.pastNotDueMediumCount = ko.observable(0);
    self.pastNotDueLowCount = ko.observable(0);
    self.pastDueTotal = ko.observable(0);
    self.highTotal = ko.observable(0);
    self.mediumTotal = ko.observable(0);
    self.lowTotal = ko.observable(0);
    self.totalOpenIssues = ko.observable(0);
	self.webPartsObservableArray = ko.observableArray([]);
    self.pastNotDueTotal = ko.observable(0);


    var today = new Date();
    var dt = new Date();
    dt.setDate(dt.getDate() - 90);
    var todayFormat = today.format('yyyy-MM-dd')

    self.GetOpenIssuesSummary = function() {

        getJson(_spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(OriginalDueDate le datetime'" + today.toISOString() + "') and (Modified ge datetime'" + dt.toISOString() + "') and (RevisedDueDate le datetime'" + today.toISOString() + "') and (IssueStatus1 eq 'Open') and IssueSignificance eq 'High'")
            .done(function(data) {
                self.pastDueHighCount(data.d.results.length)
            })
            .fail(
                function(error) {
                    console.log(JSON.stringify(error));
                });
        getJson(_spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(OriginalDueDate le datetime'" + today.toISOString() + "') and (RevisedDueDate le datetime'" + today.toISOString() + "') and (Modified ge datetime'" + dt.toISOString() + "') and (IssueStatus1 eq 'Open') and (IssueSignificance eq 'Medium')")
            .done(function(data) {
                self.pastDueMediumCount(data.d.results.length)
            })
            .fail(function(error) {
                console.log(JSON.stringify(error));
            });
        getJson(_spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=(OriginalDueDate le datetime'" + today.toISOString() + "') and (RevisedDueDate le datetime'" + today.toISOString() + "') and (Modified ge datetime'" + dt.toISOString() + "') and (IssueStatus1 eq 'Open') and IssueSignificance eq 'Low'")
            .done(function(data) {
                self.pastDueLowCount(data.d.results.length)
            })
            .fail(function(error) {
                console.log(JSON.stringify(error));
            });
        self.pastDueTotal = ko.computed(function() {
            return self.pastDueHighCount() + self.pastDueMediumCount() + self.pastDueLowCount()
        }, self);


        getJson(_spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=((OriginalDueDate ge datetime'" + today.toISOString() + "') or (RevisedDueDate ge datetime'" + today.toISOString() + "')) and (Modified ge datetime'" + dt.toISOString() + "') and (IssueStatus1 eq 'Open') and IssueSignificance eq 'High'")
            .done(function(data) {
                self.pastNotDueHighCount(data.d.results.length)
            })
            .fail(
                function(error) {
                    console.log(JSON.stringify(error));
                });
        getJson(_spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=((OriginalDueDate ge datetime'" + today.toISOString() + "') or (RevisedDueDate ge datetime'" + today.toISOString() + "')) and (Modified ge datetime'" + dt.toISOString() + "') and (IssueStatus1 eq 'Open') and IssueSignificance eq 'Medium'")
            .done(function(data) {
                self.pastNotDueMediumCount(data.d.results.length)
            })
            .fail(function(error) {
                console.log(JSON.stringify(error));
            });
        getJson(_spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=ID&$filter=((OriginalDueDate ge datetime'" + today.toISOString() + "') or (RevisedDueDate ge datetime'" + today.toISOString() + "')) and (Modified ge datetime'" + dt.toISOString() + "') and  (IssueStatus1 eq 'Open') and IssueSignificance eq 'Low'")
            .done(function(data) {
                self.pastNotDueLowCount(data.d.results.length)
            })
            .fail(function(error) {
                console.log(JSON.stringify(error));
            });
        self.pastNotDueTotal = ko.computed(function() {
            return self.pastNotDueHighCount() + self.pastNotDueMediumCount() + self.pastNotDueLowCount()
        }, self);
        self.highTotal = ko.computed(function() {
            return self.pastNotDueHighCount() + self.pastDueHighCount()
        }, self);
        self.mediumTotal = ko.computed(function() {
            return self.pastDueMediumCount() + self.pastNotDueMediumCount()
        }, self);
        self.lowTotal = ko.computed(function() {
            return self.pastDueLowCount() + self.pastNotDueLowCount()
        }, self);
        self.totalOpenIssues = ko.computed(function() {
            return self.pastDueTotal() + self.pastNotDueTotal()
        }, self);
    }

    self.ownerOpenIssuesObservableArray = ko.observableArray([])
    self.totalOpenIssuesObservableObj = ko.observable();
    self.GetOpenIssueOwnerSummary = function() {
    	
    	var ownerOpenIssuesURL = "";
        if (SPClientPeoplePicker.SPClientPeoplePickerDict.idSuperVisory_TopSpan.GetAllUserInfo().length > 0) {
            var supervisorname = SPClientPeoplePicker.SPClientPeoplePickerDict.idSuperVisory_TopSpan.GetAllUserInfo()[0].DisplayText;
			ownerOpenIssuesURL = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=*,SupervisoryLevel/Title&$expand=SupervisoryLevel/Title&$filter=(Modified ge datetime'" + dt.toISOString() + "') and (IssueStatus1 ne 'Closed Verified') and (IssueStatus1 ne 'Closed by risk acceptance') and (SupervisoryLevel/Title ne null) and (SupervisoryLevel/Title eq '"+supervisorname+"')"        	
        } else {
			ownerOpenIssuesURL = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('IssueTracking')/items?$select=*,SupervisoryLevel/Title&$expand=SupervisoryLevel/Title&$filter=(Modified ge datetime'" + dt.toISOString() + "') and (IssueStatus1 ne 'Closed Verified') and (IssueStatus1 ne 'Closed by risk acceptance') and (SupervisoryLevel/Title ne null)"        	
        }
        getJson(ownerOpenIssuesURL)
            .done(function(data) {
            	self.ownerOpenIssuesObservableArray([])
                var openIssueOwnerData = data.d.results;
				if(openIssueOwnerData.length>0){
	                var groupBySuperVisor = alasql('select * from ? GROUP BY SupervisoryLevelId', [openIssueOwnerData])
	                for (var i = 0; i < groupBySuperVisor.length; i++) {
	                    var highDueIssues = alasql('select * from ? where dateformat(OriginalDueDate) > "' + todayFormat + '" AND dateformat(RevisedDueDate) > "' + todayFormat + '" AND IssueSignificance=="High" AND SupervisoryLevelId == ' + groupBySuperVisor[i].SupervisoryLevelId + '', [openIssueOwnerData]);
	                    var mediumDueIssues = alasql('select * from ? where dateformat(OriginalDueDate) > "' + todayFormat + '" AND dateformat(RevisedDueDate) > "' + todayFormat + '" AND IssueSignificance=="Medium" AND SupervisoryLevelId == ' + groupBySuperVisor[i].SupervisoryLevelId + '', [openIssueOwnerData]);
	                    var lowDueIssues = alasql('select * from ? where dateformat(OriginalDueDate) > "' + todayFormat + '" AND dateformat(RevisedDueDate) > "' + todayFormat + '" AND IssueSignificance=="Low" AND SupervisoryLevelId == ' + groupBySuperVisor[i].SupervisoryLevelId + '', [openIssueOwnerData]);
	
	                    var highNotDueIssues = alasql('select * from ? where dateformat(OriginalDueDate) < "' + todayFormat + '" AND dateformat(RevisedDueDate) < "' + todayFormat + '" AND IssueSignificance=="High" AND SupervisoryLevelId == ' + groupBySuperVisor[i].SupervisoryLevelId + '', [openIssueOwnerData]);
	                    var mediumNotDueIssues = alasql('select * from ? where dateformat(OriginalDueDate) < "' + todayFormat + '" AND dateformat(RevisedDueDate) < "' + todayFormat + '" AND IssueSignificance=="Medium" AND SupervisoryLevelId == ' + groupBySuperVisor[i].SupervisoryLevelId + '', [openIssueOwnerData]);
	                    var lowNotDueIssues = alasql('select * from ? where dateformat(OriginalDueDate) < "' + todayFormat + '" AND dateformat(RevisedDueDate) < "' + todayFormat + '" AND IssueSignificance=="Low" AND SupervisoryLevelId == ' + groupBySuperVisor[i].SupervisoryLevelId + '', [openIssueOwnerData]);
	
	                    var dueIssuesTot = highDueIssues.length + mediumDueIssues.length + lowDueIssues.length;
	                    var notDueIssuesTot = highNotDueIssues.length + mediumNotDueIssues.length + lowNotDueIssues.length;
	
	                    self.ownerOpenIssuesObservableArray.push({
	                        ownerDueIssuesTotal: dueIssuesTot,
	                        ownerNotDueIssuesTot: notDueIssuesTot,
	                        ownerHighDueIssuesCount: highDueIssues.length,
	                        ownerMediumDueIssuesCount: mediumDueIssues.length,
	                        ownerLowDueIssuesCount: lowDueIssues.length,
	                        ownerHighNotDueIssuesCount: highNotDueIssues.length,
	                        ownerMediumNotDueIssuesCount: mediumNotDueIssues.length,
	                        ownerLowNotDueIssuesCount: lowNotDueIssues.length,
	                        superVisoryName: groupBySuperVisor[i].SupervisoryLevel.Title
	                    })
	                }
	              }
	                self.totalOpenIssuesObservableObj({
	                    ownerHighTotal: alasql("select sum(ownerHighDueIssuesCount+ownerHighNotDueIssuesCount) as HighTotal from ?", [self.ownerOpenIssuesObservableArray()])[0].HighTotal,
	                    ownerMediumTotal: alasql("select sum(ownerMediumDueIssuesCount+ownerMediumNotDueIssuesCount) as MediumTotal from ?", [self.ownerOpenIssuesObservableArray()])[0].MediumTotal,
	                    ownerLowTotal: alasql("select sum(ownerLowDueIssuesCount+ownerLowNotDueIssuesCount) as LowTotal from ?", [self.ownerOpenIssuesObservableArray()])[0].LowTotal,
	                    ownerTotal: alasql("select sum(ownerDueIssuesTotal+ownerNotDueIssuesTot) as OwnerTotal from ?", [self.ownerOpenIssuesObservableArray()])[0].OwnerTotal
	                })
            })
            .fail(
                function(error) {
                    console.log(JSON.stringify(error));
                });

        }

        self.deptOpenIssuesObservableArray = ko.observableArray([]);
        self.deptTotalOpenIssuesObservableObj = ko.observable();
        self.GetDepartementIssuesSummary = function() {
            var clientctx = SP.ClientContext.get_current();
            var list = clientctx.get_web().get_lists().getByTitle('IssueTracking');
            var q = new SP.CamlQuery();
            q.set_viewXml("<View><Query><Where><And><Geq><FieldRef Name='Modified' /><Value IncludeTimeValue='TRUE' Type='DateTime'>" + dt.toISOString() + "</Value></Geq><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed Verified</Value></Neq><And><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed and not verified</Value></Neq><Neq><FieldRef Name='IssueStatus1' /><Value Type='Choice'>Closed by risk acceptance</Value></Neq></And></And></And></Where></Query></View>");
            this.r = list.getItems(q);
            clientctx.load(r);
            clientctx.executeQueryAsync(function() {
            	debugger
                var deptDataSetArr = [];
                var enumerator = r.getEnumerator();
                while (enumerator.moveNext()) {
                    var item = enumerator.get_current();
                    deptDataSetArr.push({
                        DeptName: item.get_item('IssueOwnerDepartment').$0_1,
                        IssueLevel: item.get_item('IssueSignificance')
                    })
                }
                var groupByDept = alasql('select * from ? GROUP BY DeptName', [deptDataSetArr])
                for (var i = 0; i < groupByDept.length; i++) {

                    var highDeptIssues = alasql('select * from ? where IssueLevel=="High" AND DeptName=="' + groupByDept[i].DeptName + '"', [deptDataSetArr]);
                    var mediumDeptIssues = alasql('select * from ? where IssueLevel=="Medium" AND DeptName=="' + groupByDept[i].DeptName + '"', [deptDataSetArr]);
                    var lowDeptIssues = alasql('select * from ? where IssueLevel=="Low" AND DeptName=="' + groupByDept[i].DeptName + '"', [deptDataSetArr]);

                    var deptIssuesTot = highDeptIssues.length + mediumDeptIssues.length + lowDeptIssues.length;
                    self.deptOpenIssuesObservableArray.push({
                        deptName: groupByDept[i].DeptName,
                        deptHighIssuesCount: highDeptIssues.length,
                        deptMediumIssuesCount: mediumDeptIssues.length,
                        deptLowIssuesCount: lowDeptIssues.length,
                        deptIssuesTotal: deptIssuesTot
                    })
                }
                self.deptTotalOpenIssuesObservableObj({
                    deptHighTotal: alasql("select sum(deptHighIssuesCount) as HighTotal from ?", [self.deptOpenIssuesObservableArray()])[0].HighTotal,
                    deptMediumTotal: alasql("select sum(deptMediumIssuesCount) as MediumTotal from ?", [self.deptOpenIssuesObservableArray()])[0].MediumTotal,
                    deptLowTotal: alasql("select sum(deptLowIssuesCount) as LowTotal from ?", [self.deptOpenIssuesObservableArray()])[0].LowTotal,
                    DeptTotal: alasql("select sum(deptIssuesTotal) as DeptTotal from ?", [self.deptOpenIssuesObservableArray()])[0].DeptTotal
                })
            }, function(sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            });
            /*getJson(_spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('Issue Tracking')/items?$select=*&$filter=(Modified ge datetime'" + dt.toISOString() + "') and (IssueStatus1 ne 'Closed by Issue owner') and (IssueStatus1 ne 'Closed and Verified')")
		.done(function(data)
		{
			var groupByDept = alasql('select * from ? GROUP BY getdept(Issue_x0020_Owner_x0020_Departme)',[data.d.results])
			for(var i=0;i<groupByDept.length;i++){
				
				var highDeptIssues = alasql('select * from ? where IssueSignificance=="High AND  "');
				var mediumDeptIssues = alasql('select * from ? where IssueSignificance=="Medium"');
				var lowDeptIssues = alasql('select * from ? where IssueSignificance=="Low"');
				
				var deptIssuesTot = highDeptIssues+mediumDeptIssues+lowDeptIssues;
				self.deptOpenIssuesObservableArray.push({deptHighIssuesCount:highDeptIssues,deptMediumIssuesCount:mediumDeptIssues,deptLowIssuesCount:lowDeptIssues,deptIssuesTotal:deptIssuesTot})
			}
			self.deptTotalOpenIssuesObservableObj({deptHighTotal:alasql("select sum(highDeptIssues) as HighTotal from ?",[self.deptOpenIssuesObservableArray()])[0].HighTotal,deptMediumTotal:alasql("select sum(mediumDeptIssues) as MediumTotal from ?",[self.deptOpenIssuesObservableArray()])[0].MediumTotal,deptLowTotal:alasql("select sum(mediumDeptIssues) as LowTotal from ?",[self.deptOpenIssuesObservableArray()])[0].LowTotal})
		})
	  	.fail(
			function(error){console.log(JSON.stringify(error));
		});*/
        }

        self.ChangeReports = function() {
            $('.clsAuditReports').hide();
			var wpname = $("#selReport option:selected").attr('wptitle');
			debugger
			$(".clsMyVisiualWP span:contains('"+wpname+"')").filter(function(i){
				if($(this).text()===wpname){
					$('.clsMyVisiualWP').hide();
					$(this).parents('.ms-webpartzone-cell').show();
				}
			});
		
            if ($('#selReport').val() == 1) {
                self.GetOpenIssuesSummary();
                $('#idOpenIssues').show();
            } else if ($('#selReport').val() == 2) {
                self.GetOpenIssueOwnerSummary()
                $('#idOpenIssuesOwner').show();
            } else if ($('#selReport').val() == 3) {
                self.GetDepartementIssuesSummary()
                $('#OpenIssuesDepartment').show();
            }
        }
        
        self.webPartsObservableArray([
        	{Title:"Summary of Open Issues",WebPartName:"Summary of Open Issues",Type:"Default"},
			{Title:"Open Issues By Owner",WebPartName:"Open Issues By Owner",Type:"NotDefault"},
			{Title:"Open Issues By Department",WebPartName:"Open Issues By Department",Type:"NotDefault"}])
        
		HideAuditListWebParts(self.webPartsObservableArray())
        self.ChangeReports();

    }
	
	 function HideAuditListWebParts(WebPartTitles){
		
		for(var i=0;i<WebPartTitles.length;i++){
			var wpnametext = WebPartTitles[i].WebPartName
			$("span:contains('"+wpnametext+"')").each(function(){
				if($(this).text().toLocaleLowerCase()===wpnametext.toLocaleLowerCase()){
					$(this).parents('.ms-webpartzone-cell').addClass('clsMyVisiualWP')
					$(this).css('display','none')
					if(WebPartTitles[i].Type!='Default'){
						$(this).parents('.ms-webpartzone-cell').hide();
					}
				}
		   		 //return $(this).text() === text ? true : false;
			});
			$("span:contains('"+wpnametext+"')").filter(function(){
				if($(this).text().toLocaleLowerCase()===wpnametext.toLocaleLowerCase()){
					$(this).parents('.ms-webpartzone-cell').addClass('clsMyVisiualWP')
					$(this).css('display','none')
					if(WebPartTitles[i].Type!='Default'){
						$(this).parents('.ms-webpartzone-cell').hide();
					}
				}
		   		 //return $(this).text() === text ? true : false;
			});
	
		}
	}


    function getJson(url) {
        return $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    function SetPeoplePicker_Multiselect(peoplePickerElementId, allowMultiple, groupId, strPeoplePlaceholder) {
        // arg1:div id,arg2:bool value to allow selection of more than 1 user agr3:optional groupId you want to bind people picker with
        if (allowMultiple == null) {
            allowMultiple = true;
        }
        var schema = {};
        schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
        schema['SearchPrincipalSource'] = 15;
        schema['ResolvePrincipalSource'] = 15;
        schema['AllowMultipleValues'] = allowMultiple;
        schema['MaximumEntitySuggestions'] = 50;
        schema['Width'] = '';
        //schema['SharePointGroupID'] = '30,29';
        schema["OnUserResolvedClientScript"] = function(elemId, userKeys) {
            var pickerElement = SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
        }
        SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
        $("#" + peoplePickerElementId + "_TopSpan_InitialHelpText").text(strPeoplePlaceholder);
    }

    function fnNBBExcelReport() {

        var tab_text = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
        tab_text = tab_text + '<head> <meta http-equiv=Content-Type content="text/html; charset=windows-1252"/><meta name=ProgId content=Excel.Sheet/><meta name=Generator content="Microsoft Excel 11"/><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

        tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

        tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
        tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

        tab_text = tab_text + "<table border='1px'>";
        tab_text = tab_text + $('#' + $('.clsAuditReports:visible').attr('id')).children('table').html();
        tab_text = tab_text + '</table></body></html>';

        var data_type = 'data:application/vnd.ms-excel';

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            if (window.navigator.msSaveBlob) {
                var blob = new Blob([tab_text], {
                    type: "application/csv;charset=utf-8;"
                });
                navigator.msSaveBlob(blob, $('#' + $('.clsAuditReports:visible').attr('id')).children('span').text() + '.xls');
            }
        } else {
            $('#report').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
            $('#report').attr('download', $('#' + $('.clsAuditReports:visible').attr('id')).children('span').text() + '.xls');
        }
    }

    $(document).ready(function() {

        SetPeoplePicker_Multiselect("idSuperVisory", false, "");

        $('#getReport').on('click', function() {
            GetAuditReport();
        })


        $('#selReport').on('change', function() {
            if ($(this).val() == 2) {
                $('#idSuperVisory').show();
            } else {
                $('#idSuperVisory').hide();
            }
            $('.clsMyVisiualWP').hide();
        })
        ko.applyBindings(new GetAuditReport(),document.getElementById("koContainer"));
    })

    alasql.fn.dateformat = function(d) {
        return new Date(d).format("yyyy-MM-dd")
    }
    //alasql.fn.getdept = function(dept) {return dept.WssId}