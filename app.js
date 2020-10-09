const AFIP = require("./modules/AFIP");
const BYD = require("./modules/BYD");

const express = require("express");
const cors = require("cors");
var app = express();

app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//End-point to log into AFIP services
// app.post("/loginAFIP", function (req, res) {
//   AFIP.Login(req.body, function (error, resp) {
//     if (error) {
//       console.error("Error - " + error);
//       var jsonResponse = JSON.stringify({ error: error });
//       res.setHeader("Content-Type", "application/json");
//       res.status(500).send(jsonResponse);
//     } else {
//       var jsonResponse = JSON.stringify({ surveyresp: resp });
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).send(jsonResponse);
//     }
//   });
// });

//End-point to get latest issued electronic invoice data
app.get("/getLast", function (req, res) {
  AFIP.GetLast(req.body, function (error, resp) {
    if (error) {
      console.error("Error - " + error);
      res.send(error);
    } else {
      var jsonResponse = JSON.stringify({ resp });
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(jsonResponse);
    }
  });
});

//End-point to get electronic invoice data
app.post("/checkInv", function (req, res) {
  AFIP.CheckInvoice(req.body, function (error, resp) {
    if (error) {
      console.error("Error - " + error);
      res.send(error);
    } else {
      var jsonResponse = JSON.stringify({ resp });
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(jsonResponse);
    }
  });
});

//End-point to create electronic invoice data
app.post("/createInv", function (req, res) {
  AFIP.CreateInvoice(req.body, function (error, resp) {
    if (error) {
      console.error("Error - " + error);
      res.send(error);
    } else {
      var jsonResponse = JSON.stringify({ invCreated: resp });
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(jsonResponse);
    }
  });
});

// End-point called by the Enterprise Messaging Webhook
// to create electronic invoice based on ByD Customer Invoice
// It writes back the eInvoice Signature string back into the Customer Invoice
app.post("/emArgWebhook", function (req, res) {
  BYD.BydGetInvoice(req.body, req.query.bydTenant, function (error, resp) {
    if (error) {
      console.error("Error - " + error);
      res.send(error);
    } else {
      var bydInvData = resp.d.results;
      AFIP.GetLast(req.body, function (error, resp) {
        if (error) {
          console.error("Error - " + error);
          res.send(error);
        } else {
          var nextFree = resp.FECompUltimoAutorizadoResult.CbteNro + 1;
          var afipBodyNew = {
            newInvNum: nextFree,
            newInvAmount: bydInvData.TotalGrossAmount,
          };
          AFIP.CreateInvoice(afipBodyNew, function (error, resp) {
            if (error) {
              console.error("Error - " + error);
              res.send(error);
            } else {
              var eSignature = resp.FECAESolicitarResult.FeDetResp.FECAEDetResponse;
              BYD.BydUpdateInvoice(eSignature, req.body, req.query.bydTenant, function (error, resp) {
                if (error) {
                  console.error("Error - " + error);
                  res.send(error);
                } else {
                  res.status(204).send();
                }
              });
            }
          });
        }
      });
    }
  });
});

var port = process.env.PORT || 30000;
app.listen(port, function () {
  console.log("AFIP app listening on port " + port);
});
