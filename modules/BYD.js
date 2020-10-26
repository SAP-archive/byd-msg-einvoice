/* Module to call the cloud ERP */

/** Environment Variables Required:
 *
 * BYD_B64AUTH
 * ERP_URL
 * 
 * */

// const { cookie } = require("request");
const req = require("request"); // HTTP Client

module.exports = {
  BydGetInvoice: function (emData, tenant, response) {
    return callBydGetInv(emData, tenant, response);
  },

  BydUpdateInvoice: function (signature, emData, tenant, response) {
    return callBydUpdateInv (signature, emData, tenant, response);
  },
};

function callBydGetInv(custInvID, tenant, callback) {
  console.log(
    "Enterprise Messaging webhook input data: " + JSON.stringify(custInvID)
  );

  var custInvObjID = custInvID.ObjectUUID || custInvID.ObjectID;
  var custTenant = tenant || custInvID.SourceTenantHost || process.env.ERP_URL;

  var uri =
    custTenant +
    "/sap/byd/odata/cust/v1/khcustomerinvoice/CustomerInvoiceCollection('" +
    custInvObjID +
    "')?$format=json";

  console.log("ByD OData URI: " + uri);
  //Set HTTP Request Options
  var options = {
    uri: uri,
    headers: {
      Authorization: "Basic " + process.env.BYD_B64AUTH,
    },
  };

  //Make Request
  console.log("Getting Customer Invoice data from ByD " + uri);
  req.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bydInvFull = JSON.parse(body);
      callback(null, bydInvFull);
    } else {
      callback(response.statusMessage, response);
    }
  });
}

function callBydUpdateInv(signature, data, tenant, callback) {
  
  var custInvObjID = data.ObjectUUID || data.ObjectID;
  var custTenant = tenant || data.SourceTenantHost || process.env.ERP_URL;

  var uri =
    custTenant +
    "/sap/byd/odata/cust/v1/khcustomerinvoice/CustomerInvoiceCollection('" +
    custInvObjID +
    "')";

  //Set HTTP Request Options
  var options = {
    uri: uri,
    headers: {
      Authorization: "Basic " + process.env.BYD_B64AUTH,
      "x-csrf-token": "fetch",
    },
  };

  //Make Request
  console.log("Getting ByD token for " + uri);
  req.get(options, function (error, response) {
    if (!error && response.statusCode == 200) {
      var xcsrftoken = response.headers["x-csrf-token"];
      var xcsrfcookie = response.headers["set-cookie"];
      console.log("Token and cookie retrieved successfully");

      body = {
        eInvSignature_SDK: signature[0].CAE + signature[0].CAEFchVto,
      };

      //Set HTTP Request Options
      var options = {
        uri: uri,
        body: JSON.stringify(body),
        headers: {
          "Authorization": "Basic " + process.env.BYD_B64AUTH,
          "x-csrf-token": xcsrftoken,
          "Cookie": xcsrfcookie,
          "x-http-method": "MERGE",
          "Content-Type": "application/json",
        },
      };

      //Make Request
      console.log("Updating ByD Customer Invoice with AFIPs signature data " + uri);
      req.post(options, function (error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 204)) {
          callback(null, response.statusCode);
        } else {
          callback(response.statusMessage, response);
        }
      });
    }
  });
}
