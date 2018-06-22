/*****Base Content type Id*********************************
System
0x
Item
0x01
Document
0x0101
Event
0x0102
Issue
0x0103
Announcement
0x0104
Link
0x0105
Contact
0x0106
Message
0x0107
Task
0x0108
Workflow History
0x0109
Post
0x0110
Comment
0x0111
East Asia Contact
0x0116
Folder
0x0120
******************************/
/***********TemplateIDs***********************
100   Generic list
101   Document library
102   Survey
103   Links list
104   Announcements list
105   Contacts list
106   Events list
107   Tasks list
108   Discussion board
109   Picture library
110   Data sources
111   Site template gallery
112   User Information list
113   Web Part gallery
114   List template gallery
115   XML Form library
116   Master pages gallery
117   No-Code Workflows
118   Custom Workflow Process
119   Wiki Page library
120   Custom grid for a list
130   Data Connection library
140   Workflow History
150   Gantt Tasks list
200   Meeting Series list
201   Meeting Agenda list
202   Meeting Attendees list
204   Meeting Decisions list
207   Meeting Objectives list
210   Meeting text box
211   Meeting Things To Bring list
212   Meeting Workspace Pages list
301   Blog Posts list
302   Blog Comments list
303   Blog Categories list
1100   Issue tracking
1200   Administrator tasks list
*****************************/
'use strict';
var INTRANET = INTRANET || {};

INTRANET.Constant = {
    SiteColumnGroupName: 'NBB'
}
INTRANET.Schema = {};

INTRANET.LogType = {
    Info: 'Information',
    Error: 'Error'
};

INTRANET.Schema.SiteColumns = [
    '<Field Command= "Create" Type= "Choice" DisplayName= "Email Notification" Required= "FALSE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" MaxLength= "255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "EmailNotification" Name= "EmailNotification">'
    + '<CHOICES>'
    + '<CHOICE>Yes</CHOICE>'
    + '<CHOICE>No</CHOICE>'
    + '</CHOICES>'
    + '</Field> ',
    '<Field Command="Create" Type="DateTime" DisplayName="End Date1" Required="TRUE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group="' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="EndDate1" Name="EndDate1"></Field>',
    '<Field Command= "Create" Type= "Choice" DisplayName= "Is Poll" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" MaxLength= "255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "IsPoll" Name= "IsPoll">'
    + '<CHOICES>'
    + '<CHOICE>Yes</CHOICE>'
    + '<CHOICE>No</CHOICE>'
    + '</CHOICES>'
    + '</Field> ',
    '<Field Command= "Create" Type= "URL" DisplayName= "Manage Questions" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" Sortable= "FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "ManageQuestions" Name= "ManageQuestions" ></Field >',
    '<Field Command= "Create" Type= "URL" DisplayName= "View Response" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" Sortable= "FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "ViewResponse" Name= "ViewResponse" ></Field >',
    '<Field Command= "Create" Type= "URL" DisplayName= "Survey Link" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" Sortable= "FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "SurveyLink" Name= "SurveyLink" ></Field >',
    '<Field Command= "Create" Type= "Note" DisplayName= "Survey Description" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" NumLines= "6" RichText= "FALSE" Sortable= "FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "SurveyDescription" Name= "SurveyDescription" ></Field >',
    '<Field Command= "Create" Type= "Choice" DisplayName= "Content Priority" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" MaxLength= "255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "ContentPriority" Name= "ContentPriority">'
    + '<CHOICES>'
    + '<CHOICE>1</CHOICE>'
    + '<CHOICE>2</CHOICE>'
    + '<CHOICE>3</CHOICE>'
    + '<CHOICE>4</CHOICE>'
    + '<CHOICE>5</CHOICE>'
    + '</CHOICES>'
    + '</Field> ',
    '<Field Command= "Create" Type= "Note" DisplayName= "News Details" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "NewsDetails" Name= "NewsDetails"></Field >',
    '<Field Command= "Create" Type= "User" DisplayName= "Content Author" List= "UserInfo" Required= "FALSE" EnforceUniqueValues= "FALSE" ShowField= "ImnName" UserSelectionMode= "PeopleOnly" UserSelectionScope= "0" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "ContentAuthor" Name= "ContentAuthor"></Field >',
    '<Field Command= "Create" Type= "User" DisplayName= "EmployeeName" List= "UserInfo" Required= "FALSE" EnforceUniqueValues= "FALSE" ShowField= "ImnName" UserSelectionMode= "PeopleOnly" UserSelectionScope= "0" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "EmployeeName" Name= "EmployeeName"></Field >',
    '<Field Command= "Create" Type= "Note" DisplayName= "StoryCopy" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "StoryCopy" Name= "StoryCopy" ></Field >',
    '<Field Command= "Create" Type= "Note" DisplayName= "Announcement Details" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "AnnouncementDetails" Name= "AnnouncementDetails" ></Field >',
    '<Field Command= "Create" Type= "Note" DisplayName= "Management Message" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "ManagementMessage" Name= "ManagementMessage" ></Field >',
    '<Field Command= "Create" Type="Image" DisplayName= "Banner Image" Required= "TRUE" RichText="TRUE" RichTextMode="ThemeHtml" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="BannerImage" Name="BannerImage"></Field >',
    '<Field Command= "Create" Type="Image" DisplayName= "Home Thumbnail" Required= "TRUE" RichText="TRUE" RichTextMode="ThemeHtml" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="HomeThumbnail" Name="HomeThumbnail"></Field >',
    '<Field Command= "Create" Type="Image" DisplayName= "Thumbnail Image" Required= "TRUE" RichText="TRUE" RichTextMode="ThemeHtml" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="ThumbnailImage" Name="ThumbnailImage"></Field >',
    '<Field Command= "Create" Type= "Choice" DisplayName= "Audit Type" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" MaxLength= "255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "AuditType" Name= "AuditType">'
    + '<CHOICES>'
    + '<CHOICE>Planned</CHOICE>'
    + '<CHOICE>Special</CHOICE>'
    + '</CHOICES>'
    + '</Field> ',
    '<Field Command= "Create" Type= "Choice" DisplayName= "Audit Category" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" MaxLength= "255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "AuditCategory" Name= "AuditCategory">'
    + '<CHOICES>'
    + '<CHOICE>Credit</CHOICE>'
    + '<CHOICE>Operations</CHOICE>'
    + '<CHOICE>IT</CHOICE>'
    + '<CHOICE>Support Functions</CHOICE>'
    + '<CHOICE>Domestic Branches</CHOICE>'
    + '<CHOICE>Overseas Branches</CHOICE>'
    + '<CHOICE>Other</CHOICE>'
    + '</CHOICES>'
    + '</Field> ',
    '<Field Command= "Create" Type= "Choice" DisplayName= "Issue Significance" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" MaxLength= "255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "IssueSignificance" Name= "IssueSignificance">'
    + '<CHOICES>'
    + '<CHOICE>High</CHOICE>'
    + '<CHOICE>Medium</CHOICE>'
    + '<CHOICE>Low</CHOICE>'
    + '</CHOICES>'
    + '</Field> ',
    '<Field Command= "Create" Type= "Choice" DisplayName= "Issue Status" Required= "TRUE" EnforceUniqueValues= "FALSE" Indexed= "FALSE" MaxLength= "255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "IssueStatus" Name= "IssueStatus">'
    + '<CHOICES>'
    + '<CHOICE>High</CHOICE>'
    + '<CHOICE>Medium</CHOICE>'
    + '<CHOICE>Low</CHOICE>'
    + '</CHOICES>'
    + '</Field> ',
    '<Field Command= "Create" Type="Text" DisplayName= "Audit Title" Required= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="AuditTitle" Name="AuditTitle"></Field >',
    '<Field Command= "Create" Type="Text" DisplayName= "Audit Assignment Notice No" Required= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="AuditAssignmentNoticeNo" Name="AuditAssignmentNoticeNo"></Field >',
    '<Field Command= "Create" Type="Text" DisplayName= "ParentIssueID" Required= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="ParentIssueID" Name="ParentIssueID"></Field >',
    '<Field Command= "Create" Type="Text" DisplayName= "ParentAuditTitle" Required= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="ParentAuditTitle" Name="ParentAuditTitle"></Field >',
    '<Field Command= "Create" Type="DateTime" DisplayName= "Original Due Date" Required= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="OriginalDueDate" Name="OriginalDueDate"></Field >',
    '<Field Command= "Create" Type="DateTime" DisplayName= "Audit Report Date" Required= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="AuditReportDate" Name="AuditReportDate"></Field >',
    '<Field Command= "Create" Type="DateTime" DisplayName= "Revised Due Date" Required= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="RevisedDueDate" Name="RevisedDueDate"></Field >',
    '<Field Command= "Create" Type="DateTime" DisplayName= "Issue Closure Date" Required= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="IssueClosureDate" Name="IssueClosureDate"></Field >',
    '<Field Command= "Create" Type="Note" DisplayName= "Audit Issue Summary" Required= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="AuditIssueSummary" Name="AuditIssueSummary"></Field >',
    '<Field Command= "Create" Type="Note" DisplayName= "Issue Details" Required= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="IssueDetails" Name="IssueDetails"></Field >',
    '<Field Command= "Create" Type="Note" DisplayName= "Audit Recommendation" Required= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="AuditRecommendation" Name="AuditRecommendation"></Field >',
    '<Field Command= "Create" Type="Note" DisplayName= "Agreed Corrective Action" Required= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="AgreedCorrectiveAction" Name="AgreedCorrectiveAction"></Field >',
    '<Field Command= "Create" Type="Note" DisplayName= "Issue Resolution Comments" Required= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="IssueResolutionComments" Name="IssueResolutionComments"></Field >',
    '<Field Command= "Create" Type="Note" DisplayName= "Auditor Remarks" Required= "FALSE" NumLines= "6" RichText= "TRUE" Sortable= "FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="AuditorRemarks" Name="AuditorRemarks"></Field >',
    '<Field Command= "Create" Type= "User" DisplayName= "Person to Address(PTA)" List= "UserInfo" Required= "FALSE" EnforceUniqueValues= "FALSE" ShowField= "ImnName" UserSelectionMode= "PeopleAndGroups" UserSelectionScope= "0" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "PersonToAddress" Name= "PersonToAddress"></Field >',
    '<Field Command= "Create" Type= "User" DisplayName= "Supervisory Level" List= "UserInfo" Required= "FALSE" EnforceUniqueValues= "FALSE" ShowField= "ImnName" UserSelectionMode= "PeopleAndGroups" UserSelectionScope= "0" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "SupervisoryLevel" Name= "SupervisoryLevel"></Field >',
    '<Field Command= "Create" Type= "User" DisplayName= "Auditor(s)" List= "UserInfo" Required= "FALSE" EnforceUniqueValues= "FALSE" ShowField= "ImnName" UserSelectionMode= "PeopleAndGroups" UserSelectionScope= "0" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "Auditors" Name= "Auditors"></Field >',
    '<Field Command= "Create" Type= "User" DisplayName= "AuditorManager(s)" List= "UserInfo" Required= "FALSE" EnforceUniqueValues= "FALSE" ShowField= "ImnName" UserSelectionMode= "PeopleAndGroups" UserSelectionScope= "0" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "AuditManagers" Name= "AuditManagers"></Field >',
    '<Field Command= "Create" Type= "User" DisplayName= "Issue Owner" List= "UserInfo" Required= "FALSE" EnforceUniqueValues= "FALSE" ShowField= "ImnName" UserSelectionMode= "PeopleAndGroups" UserSelectionScope= "0" Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName= "IssueOwner" Name= "IssueOwner"></Field >',
    '<Field Command= "Create" Type="Calculated" DisplayName= "Due Status"  Group= "' + INTRANET.Constant.SiteColumnGroupName + '" StaticName="DueStatus" Name="DueStatus">'
        +'<FieldRefs>'
            + '<FieldRef Name="OriginalDueDate"/>'
        + '</FieldRefs>'
            + '<Formula>=[Original Due Date]</Formula>'
    + '</Field >'


];
INTRANET.Schema.ContentTypes = [
    {
        Name: 'Intranet_Survey',
        ParentContenttype: '0x01', //Item Content Type
        Description: 'Survey List',
        IsLookUpExist: false,
        FieldsInternalName: ['SurveyDescription', 'SurveyLink', 'EndDate', 'ManageQuestions', 'ViewResponse', 'EmailNotification', 'IsPoll']
    },
    {
        Name: 'Latest_News',
        ParentContenttype: '0x0104', //Announcement Content Type
        Description: 'Latest News',
        IsLookUpExist: false,
        FieldsInternalName: ['ContentPriority', 'EmailNotification', 'NewsDetails']
    },
    {
        Name: 'Latest_Update',
        ParentContenttype: '0x0104', //Announcement Content Type
        Description: 'Latest Updates',
        IsLookUpExist: false,
        FieldsInternalName: ['BannerImage', 'HomeThumbnail', 'ThumbnailImage', 'ContentAuthor', 'EmailNotification', 'StoryCopy']
    },
    {
        Name: 'Organizational_Announcement',
        ParentContenttype: '0x0104', //Announcement Content Type
        Description: 'Organizational_Announcement',
        IsLookUpExist: false,
        FieldsInternalName: ['BannerImage', 'ContentAuthor', 'ContentPriority', 'EmailNotification', 'AnnouncementDetails']
    },
    {
        Name: 'Mark_Your_Calendar',
        ParentContenttype: '0x0102', //Event Content Type
        Description: 'Mark_Your_Calendar',
        IsLookUpExist: false,
        FieldsInternalName: ['EmailNotification', 'EmployeeName']
    },
    {
        Name: 'News_Bulletin',
        ParentContenttype: '0x0104', //Announcement Content Type
        Description: 'News_Bulletin',
        IsLookUpExist: false,
        FieldsInternalName: ['ContentPriority', 'EmailNotification']
    },
    {
        Name: 'Voice_of_Management',
        ParentContenttype: '0x01', //Item Content Type
        Description: 'Voice_of_Management',
        IsLookUpExist: false,
        FieldsInternalName: ['ContentAuthor', 'ContentPriority', 'EmailNotification', 'ManagementMessage']
    },
    {
        Name: 'BirthDay',
        ParentContenttype: '0x0102', //Event Content Type
        Description: 'BirthDay',
        IsLookUpExist: false,
        FieldsInternalName: ['EmailNotification', 'EmployeeName']
    },
    {
        Name: 'Anniversary',
        ParentContenttype: '0x0102', //Event Content Type
        Description: 'Anniversary',
        IsLookUpExist: false,
        FieldsInternalName: ['EmailNotification', 'EmployeeName']
    },
    {
        Name: 'New_Joinee',
        ParentContenttype: '0x0102', //Event Content Type
        Description: 'New_Joinee',
        IsLookUpExist: false,
        FieldsInternalName: ['EmailNotification', 'EmployeeName']
    },
    {
        Name: 'Farewell',
        ParentContenttype: '0x0102', //Event Content Type
        Description: 'Farewell',
        IsLookUpExist: false,
        FieldsInternalName: ['EmailNotification', 'EmployeeName']
    },
    {
        Name: 'Issue Tracking',
        ParentContenttype: '0x01', //Event Content Type
        Description: 'Issue Tracking',
        IsLookUpExist: false,
        FieldsInternalName: ['AuditType', 'AuditCategory', 'AuditTitle', 'AuditAssignmentNoticeNo', 'AuditReportDate', 'AuditIssueSummary',
            'IssueSignificance', 'IssueDetails', 'AuditRecommendation', 'AgreedCorrectiveAction', 'OriginalDueDate',
            'RevisedDueDate', 'PersonToAddress', 'IssueStatus', 'DueStatus', 'IssueResolutionComments', 'IssueClosureDate',
            'SupervisoryLevel', 'Auditors', 'AuditManagers', 'AuditorRemarks', 'IssueOwner', 'ParentIssueID', 'ParentAuditTitle']
    }

];
INTRANET.Schema.Lists = [
    {
        Name: 'IntranetSurvey',
        Type: 'genericList',
        TemplateID: '100',
        ContentType: 'Intranet_Survey',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: true,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    },
    {
        Name: 'LatestNews',
        Type: 'genericList',
        TemplateID: '100',
        ContentType: 'Latest_News',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: true,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    },
    {
        Name: 'LatestUpdates',
        Type: 'genericList',
        TemplateID: '101',
        ContentType: 'Latest_Update',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: true,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    },
    {
        Name: 'OrganizationalAnnouncements',
        Type: 'genericList',
        TemplateID: '101',
        ContentType: 'Organizational_Announcement',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: true,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    },
    {
        Name: 'Mark Your Calendar',
        Type: 'events',
        TemplateID: '106',
        ContentType: 'Mark_Your_Calendar',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: true,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    },
    {
        Name: 'NBBBulletins',
        Type: 'genericList',
        TemplateID: '100',
        ContentType: 'News_Bulletin',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: false,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    },
    {
        Name: 'VoiceofManagement',
        Type: 'genericList',
        TemplateID: '100',
        ContentType: 'Voice_of_Management',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: true,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    },
    {
        Name: 'NBBFamilyUpdates',
        Type: 'genericList',
        TemplateID: '100',
        ContentType: 'BirthDay',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: false,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    }
    ,
    {
        Name: 'Quick Links',
        Type: 'links',
        TemplateID: '103',
        ContentType: 'Links',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: false,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    },
    {
        Name: 'Issue Tracking',
        Type: 'genericList',
        TemplateID: '100',
        ContentType: 'Issue Tracking',
        ContentTypeID: '', //This parameter value getting insert dynamically while app execution
        SetAsDefaultContentType: false,
        IsLookUpExist: false,
        IsUniquePermission: false,
        Fields: [],
        Items: []
    }

];

INTRANET.Schema.AllCSS = [
"bootstrap", "chart", "fontawesome", "NBBMain", "NBBResponsive", "owlcarouselmin", "owlthemedefaultmin"
];

INTRANET.Schema.AllJS = [
"bootstrap.min", "CarouselKO", "chart", "IntranetSurveyJSLink", "IntranetSurveyNewItem",
"jquery-3.1.0.min", "jquery.dialog.min", "jquery.slimscroll.min", "knockout-3.2.0", "ko.sp-1.0",
"LatestUpdatesJSLink", "moment", "NBBCommonFunctions", "npm", "OrgAnnouncementJSLink",
"owl.carousel.min", "perfect-scrollbar", "PollKO", "WelcomeControl"
];

INTRANET.Schema.AllTextFiles = [
"carousel", "IntranetSurveyJSLink", "OrgAnnouncementJSLink", "IntranetSurveyNewItem",
"LatestUpdatesJSLink", "Poll","WelcomeControl"
];


INTRANET.Schema.AllTemplateFiles = [
    "Control_AllNBBFamilypdates", "control_DepartmentMarkCalendar", "Control_ImpAnnouncement", "control_Latest_News",
    "Control_LatestUpdateDetails", "Control_LatestUpdates", "control_MarkYourCalendar", "Control_NBBFamilyUpdatesDetailedPage",
    "Control_NBBFamilyUpdatesNew", "Control_NBBTaskWebPart", "Control_OrgAnnouncementDetails", "Control_QuickLinks",
    "Control_VoiceOfMgtPaging", "Item_AllNBFamilyUpdate", "item_ArticleDetails", "Item_DepartmentMarkYourCalendar", "Item_FamilyUpdates",
    "Item_Important_Announcements", "Item_LargePicture", "Item_Latest_News_Home", "item_LatestUpdate", "Item_LatestUpdatesDetails",
    "Item_MarkYourCalendar", "Item_NBBFamilyUpdatesHomePage", "Item_NBBItemsDetaildView", "Item_OrgAnnouncement", "Item_QuickLinks",
    "Item_VoiceOfManagement", "Item_VoiceOfMgt"
];
INTRANET.Schema.AllPageLayouts = [
"DepartmentGenricPageLayout","NBBHomePageLayout","NBBLearningPageLayout","NBBOneColPageLayout"
];
INTRANET.Schema.AllWebParts = [
    "Latest News Home Content Search"
];
INTRANET.Schema.AllPages = [
    "AllArticles", "AllLatestNews", "CompliancePortal", "Home", "IntranetSurvey", "LatestUpdateDetails", "LatestUpdates",
    "MarkYourCalendar", "NBBFamilyUpdates", "NBB-FamilyUpdates", "NBB-FamilyUpdatesDetailedPage", "NBB-FamilyUpdatesNew",
    "OrgAnnouncementDetails", "OrgAnnouncements", "QuickLinks"
];

