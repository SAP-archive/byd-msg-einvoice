/* Qualtrics module to create responses into a Qualtrics Survey */
/* Qualtrics Tenant Configuration, User Credentials and Survey parameters set in environment variables */

/** Environment Variables Required:
 *
 *
 * */

var soap = require("soap");
var req = require("request"); // HTTP Client

var xml2js = require("xml2js");
var parser = new xml2js.Parser();

var params_loginCms = require("../params/loginCms.js");
const initCrear = require("../params/compSolicitar.js");
const initConsultar = require("../params/compConsultar.js");

const urlLogin = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl";
const urlTransac = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL";

module.exports = {
  Login: function (loginData, response) {
    return callAFIPlogin(loginData, response);
  },
  GetLast: function (readData, response) {
    return callAFIPGetLast(readData, response);
  },
  CheckInvoice: function (readData, response) {
    return callAFIPCheckInv(readData, response);
  },
  CreateInvoice: function (invData, response) {
    return callAFIPCreateInv(invData, response);
  },
  BydGetInvoice: function(emData, tenant, response) {
    return callBydGetInv(emData, tenant, response);
  }
};

function callAFIPlogin(data, callback) {
  if (data.token){
    process.env.AFIP_TICKET = data.token
    params_loginCms = {
      in0:process.env.AFIP_TICKET,
    };
  };

  soap.createClient(urlLogin, function (err, client) {
    // Execute methods on the soap service here
    // callback(null, client.describe());
    client.loginCms(params_loginCms, function (err, result) {
      var res_xml = result.body;
      parser.parseString(res_xml, function (errxml, xmlnode) {
        err = xmlnode["soapenv:Envelope"]["soapenv:Body"][0]["soapenv:Fault"][0]["faultstring"][0];
        if (err === "") {
          var token =
            xmlnode["soapenv:Envelope"]["soapenv:Body"][0]["loginCmsReturn"][0]["loginTicketResponse"][0]["credentials"][0]["token"][0];
          var sign =
            xmlnode["soapenv:Envelope"]["soapenv:Body"][0]["loginCmsReturn"][0]["loginTicketResponse"][0]["credentials"][0]["sign"][0];
        }
        callback(err, result.statusCode);
      });
      // // process.env.AFIP_TOKEN = result.
      // callback(null, result.statusCode);
    });
  });
}

function callAFIPCheckInv(data, callback) {
  var params_checkInv = initConsultar.initValuesConsultar(data.invNum);
  soap.createClient(urlTransac, function (err, client) {
    // Execute methods on the soap service here
    client.FECompConsultar(params_checkInv, function (err, result, rawResp, soapHeader, rawRequest) {
      callback(null, result);
    });
  });
}

function callAFIPGetLast(data, callback) { 
  var params_createInv = require("../params/compUltimo.js");
  soap.createClient(urlTransac, function (err, client) {
    client.FECompUltimoAutorizado(params_createInv, function (err, result) {
      callback(null, result);
    });
  });
}

function callAFIPCreateInv(data, callback) {
  var params_createInv = initCrear.initValuesSolicitar(data.newInvNum, data.newInvAmount);
  soap.createClient(urlTransac, function (err, client) {
    client.FECAESolicitar(params_createInv, function (err, result) {
      callback(null, result);
    });
  });
}

function callBydGetInv(custInvID, tenant, callback) {
  console.log("Enterprise Messaging webhook input data: " + JSON.stringify(custInvID));
  var uri =
    (tenant || custInvID.SourceTenantHost || process.env.ERP_URL) +
    "/sap/byd/odata/cust/v1/khcustomerinvoice/CustomerInvoiceCollection('" +
    (custInvID.ObjectUUID || custInvID.ObjectID) +
    "')?$format=json"
  
    console.log("ByD OData URI: " + uri);
  //Set HTTP Request Options
  var options = {
    uri: uri,
    headers: {
      "Authorization": "Basic " + process.env.BYD_B64AUTH
    }
  };

  //Make Request
  console.log("Getting Customer Invoice data from ByD " + uri);
  req.get(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      bydInvFull = JSON.parse(body);
      callback(null, bydInvFull);
    } else {
      callback(response.statusMessage, response);
    }
  });
}
