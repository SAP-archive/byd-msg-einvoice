/* AFIP module to read and create electronic invoices */

/** Environment Variables Required:
 *
 * AFIP_CUIT
 * AFIP_SIGN
 * AFIP_TOKEN
 * 
 * */

const soap = require("soap");
const req = require("request"); // HTTP Client

// const xml2js = require("xml2js");
// const parser = new xml2js.Parser();

// const params_loginCms = require("../params/loginCms.js");
const initCrear = require("../params/compSolicitar.js");
const initConsultar = require("../params/compConsultar.js");

// const urlLogin = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl";
const urlTransac = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL";

module.exports = {
  // Login: function (loginData, response) {
  //   return callAFIPlogin(loginData, response);
  // },
  GetLast: function (readData, response) {
    return callAFIPGetLast(readData, response);
  },
  CheckInvoice: function (readData, response) {
    return callAFIPCheckInv(readData, response);
  },
  CreateInvoice: function (invData, response) {
    return callAFIPCreateInv(invData, response);
  }
};

// function callAFIPlogin(data, callback) {
//   if (data.token){
//     process.env.AFIP_TICKET = data.token
//     params_loginCms = {
//       in0:process.env.AFIP_TICKET,
//     };
//   };

//   soap.createClient(urlLogin, function (err, client) {
//     // Execute methods on the soap service here
//     // callback(null, client.describe());
//     client.loginCms(params_loginCms, function (err, result) {
//       var res_xml = result.body;
//       parser.parseString(res_xml, function (errxml, xmlnode) {
//         err = xmlnode["soapenv:Envelope"]["soapenv:Body"][0]["soapenv:Fault"][0]["faultstring"][0];
//         if (err === "") {
//           var token =
//             xmlnode["soapenv:Envelope"]["soapenv:Body"][0]["loginCmsReturn"][0]["loginTicketResponse"][0]["credentials"][0]["token"][0];
//           var sign =
//             xmlnode["soapenv:Envelope"]["soapenv:Body"][0]["loginCmsReturn"][0]["loginTicketResponse"][0]["credentials"][0]["sign"][0];
//         }
//         callback(err, result.statusCode);
//       });
//       // // process.env.AFIP_TOKEN = result.
//       // callback(null, result.statusCode);
//     });
//   });
// }

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