$(document).ready(function(){
	JSRequest.EnsureSetup();
    var itemID = JSRequest.QueryString["ID"];
    
    if(itemID != null && itemID != undefined && itemID != "")
    {
    	window.location = "../../Pages/Intranet%20Survey.aspx?ItemID="+itemID;
    }
    else
    {
    	window.location = "../../Pages/Intranet%20Survey.aspx";
    }
	
	
});

