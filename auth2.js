var requestParams = {
    grant_type : 'client_credentials',
    client_id_Web : '6a21c509-a48b-4e04-9b81-9d6371277dd0',
    client_id_Native : '0337ab50-c4f0-4837-a4b1-57c2bb73f0d4',
    Tenant_id: '057febc5-d1f0-464b-a50d-688064c7d966',//Bearer Realm
    client_secret:'e1y@4UtLBEa]9qf@6bX.56yT.dR_esy?',
    resource:'00000003-0000-0ff1-ce00-000000000000',//client_id
    SiteDomain:'https://vrish.sharepoint.com'
}
var site = 'https://spo-teamsite.ge.com'
var userName = '503103838';
var Password = 'Apr@2019Apr';

var tokenReq = `<?xml version="1.0" encoding="utf-8"?>
     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"; xmlns:xsd="http://www.w3.org/2001/XMLSchema"; xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetUpdatedFormDigestInformation xmlns="http://schemas.microsoft.com/sharepoint/soap"; />
      </soap:Body>
     </soap:Envelope>`;

var  req = {
   XML: `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <s:Header>
        <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>
        <a:ReplyTo>
            <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>
        </a:ReplyTo>
        <a:To s:mustUnderstand="1">https://login.microsoftonline.com/extSTS.srf</a:To>
        <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <o:UsernameToken>
                <o:Username>`+ userName +`</o:Username>
                <o:Password>`+ Password +`</o:Password>
            </o:UsernameToken>
        </o:Security>
    </s:Header>
    <s:Body>
        <t:RequestSecurityToken xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust">
            <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
                <a:EndpointReference>
                    <a:Address>`+ site +`</a:Address>
                </a:EndpointReference>
            </wsp:AppliesTo>
            <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType>
            <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>
            <t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType>
        </t:RequestSecurityToken>
    </s:Body>
</s:Envelope>`
}


function getAccess() {
const url = 'https://login.microsoftonline.com/'+ requestParams.Tenant_id +'/oauth2/authorize?'
            + 'client_id='+ requestParams.client_id //requestParams.resource + //here need to paste your client id
            + '&response_type=code'
            + '&redirect_uri=' + encodeURI("http://localhost:5500") //here encoding redirect url using default function
            + '&response_mode=query'
            + '&resource=' + encodeURI(requestParams.SiteDomain) //here encoding resource url using default function
            + '&state=12345'

            window.location.href = url;            
}


function getAccess2(){
    const url = 'https://cors-anywhere.herokuapp.com/https://login.windows.net/'+ requestParams.Tenant_id +'/oauth2/token'
    $.ajax({
        type: "post",
        url: url,
        crossDomain: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Access-Control-Allow-Origin": "*",
            'Accept':'application/json'
        },
        data:{ 
            grant_type: 'password',
            client_id: requestParams.client_id_Native,
            //client_secret: requestParams.client_secret,
            resource: requestParams.SiteDomain,
            username:'suraj@vrish.onmicrosoft.com',
            password:'keplin@1294',
            scope:'openid'
         },
        success: function (data) {
           console.log(data);
           var at = data.token_type + " " + data.access_token;
           getDetails(at);
           refreshToken(data.refresh_token);
        },
        error: function (resource){
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

function refreshToken(refresh_Token){
    const url = 'https://cors-anywhere.herokuapp.com/https://login.windows.net/'+ requestParams.Tenant_id +'/oauth2/token'
    $.ajax({
        type: "post",
        crossDomain:true,
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Access-Control-Allow-Origin": "*",
            'Accept':'application/json'
        },
        data: {
            grant_type: 'refresh_token',
            client_id: requestParams.client_id_Native,
            refresh_token: refresh_Token,
            resource: requestParams.SiteDomain,
            scope:'openid'
        },
        
        success: function (response) {
        console.log(response);    
        }
    });
}

function getAccess3() {
    var url = 'https://cors-anywhere.herokuapp.com/https://login.microsoftonline.com/extSTS.srf';
    $.ajax({
        type: "post",
        url: url,
        crossDomain: true,
        contentType: 'application/soap+xml; charset=utf-8',
       /* headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Access-Control-Allow-Origin": "*",
            'Accept':'application/json'
        },*/
        data: req.XML,
        dataType:'XML',
        success: function (data, textStatus, result) {
            
         //   token(response.all[18].innerHTML);
         var token = $(result.responseText).find("wsse\\:BinarySecurityToken").text();
         console.log(token);
            getFedAuthCookies(token);
        },
        error: function(response) {
            console.log(response);
        }
    });
  }

  function token(tk){
    var url = 'https://cors-anywhere.herokuapp.com/'+ site +'/_forms/default.aspx?wa=wsignin1.0';
    $.ajax({
        type: "post",
        url: url,
        crossDomain: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: tk,
        success: function (response) {
            console.log(response);           
        },
        error: function(response) {
            console.log(response);
        }
    });
  }

  
    // Step 2: "login" using the token provided by STS in step 1
    function getFedAuthCookies(token)
    {
        var loginUrl = 'https://cors-anywhere.herokuapp.com/'+ site +'/_forms/default.aspx?wa=wsignin1.0';
        $.support.cors = true; // enable cross-domain query
        $.ajax({
            type: 'POST',
            data: token,
            crossDomain: true, // had no effect, see support.cors above
            contentType: 'application/x-www-form-urlencoded',
            url: loginUrl,
            ProcessData:false,         
            // dataType: 'html', // default is OK: Intelligent Guess (xml, json, script, or html)
            success: function (data, textStatus, result) {
                // we should update the digest
                //refreshDigestViaWS(); // or alternatively:
                //refreshDigestViaREST();
                console.log(data);
                refreshDigestViaREST();
            },
            error: function (result, textStatus, errorThrown) {
                reportError(result, textStatus, errorThrown);
            }
        });
    }

    function refreshDigestViaREST()
    {
        var url =  site
        $.support.cors = true; // enable cross-domain query
        $.ajax({
            type: 'POST',
            
            crossDomain: true, // had no effect, see support.cors above
            
            url: url + '/_api/contextinfo',
            
            //xhrFields: { withCredentials: true },
            success: function (data, textStatus, result) {  
                digest = $(result.responseText).find("FormDigestValue").text();
               // sendRESTReq();
            },
            error: function (result, textStatus, errorThrown) {
                        var response = JSON.parse(result.responseText);
                        if ((response.error != undefined) && (response.error.message != undefined)) {
                            alert(response.error.message.value);
                        }
            }
        });
    }