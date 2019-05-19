/*
1. Launch Postman chrome extension.
2. Select Get Method
3. Enter the below URL in the “Request URL” textbox
4. https://<sitename>/sharepoint.com/_vti_bin/client.svc/
5. Configure the below information in the header section 
    to send along with the url requestMethod = Get
    Headers

    Key	            Syntax	    Value
    Authorization	Bearer	    Bearer

6. After applied the configuration, click Send button. 
    The response returns lot of headers but ends with unauthorized access

7. From Headers get Tenant id -> Bearer Realm and resource -> client_id
*/

var requestParams = {
    grant_type : 'client_credentials',
    client_id : '8ee2251c-ca43-4258-a1f2-749b5a7ac423',
    Tenant_id: '057febc5-d1f0-464b-a50d-688064c7d966',//Bearer Realm
    client_secret:'TTwX9wHKGtpsE69NDxx9moFclCWZOUM7LKUD/UFyNUM=',
    resource:'00000003-0000-0ff1-ce00-000000000000',//client_id
    SiteDomain:'vrish.sharepoint.com'
}

$(function(jq){
    
    $("#details").append('<h1>hi</h1>')

});

/*
After getting the Tenant ID, we have to form a URL with the below format
https://accounts.accesscontrol.windows.net/<TenantID>/tokens/OAuth/2 for requesting the access token.
Apply the below configurations in header
Method = POST
Headers    
    Key	            Syntax	                            Value
    Content-Type	application/x-www-form-urlencoded	application/x-www-form-urlencoded
body
    Key	            Syntax	                        Value
    grant_type	    client_credentials	            client_credentials
    client_id	    ClientID@TenantID	            4b4276d0-74cd-4476-b66f-e7e326e2cb93@10267809-adcb-42b6-b103-c7c8190b3fed
    client_secret	ClientSecret	                nuC+ygmhpadH93TqJdte++C37SUchZVK4a5xT9XtVBU=
    resource	    resource/SiteDomain@TenantID	00000003-0000-0ff1-ce00-000000000000/spsnips.sharepoint.com@10267809-adcb-42b6-b103-c7c8190b3fed
*/


function getAccess(){

    alert('ok');
    $.ajax({
        type: "post",
        url: "https://cors-anywhere.herokuapp.com/https://accounts.accesscontrol.windows.net/057febc5-d1f0-464b-a50d-688064c7d966/tokens/OAuth/2",
        crossDomain: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Access-Control-Allow-Origin": "*",
            'Accept':'application/json'
        },
        data:{ 
            grant_type: requestParams.grant_type,
            client_id: requestParams.client_id + '@' + requestParams.Tenant_id,
            client_secret: requestParams.client_secret,
            resource: requestParams.resource + '/' + requestParams.SiteDomain + '@' + requestParams.Tenant_id
         },
        success: function (data) {
            var at = data.token_type + " " + data.access_token;
            console.log(at);
            getDetails(at);
        },
        error: function (response){
            console.log(response);
            
            
        }
        

    });

    
}

function getDetails(access_token){
$.ajax({
    type: "get",
    headers: {
        'Accept':'application/json',
        'Authorization':access_token
    },
    url: "https://vrish.sharepoint.com/sites/SP/UAT/_api/web?$select=Title",
    success: function (response) {
        console.log(response);
    }
});
}