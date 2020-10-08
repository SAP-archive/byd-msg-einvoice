module.exports = {
  initValuesSolicitar: function (invNum, invAmount) {
    const ret = {
      Auth: {
        Token: process.env.AFIP_TOKEN,
        Sign: process.env.AFIP_SIGN,
        Cuit: process.env.AFIP_CUIT,
        targetNSAlias: "tns",
        targetNamespace: "http://ar.gov.afip.dif.FEV1/",
      },
      FeCAEReq: {
        FeCabReq: {
          CantReg: 1,
          PtoVta: 2,
          CbteTipo: 001,
          targetNSAlias: "tns",
          targetNamespace: "http://ar.gov.afip.dif.FEV1/",
        },
        FeDetReq: {
          FECAEDetRequest: {
            Concepto: 1,
            DocTipo: 80,
            DocNro: 30444444441,
            CbteDesde: invNum,
            CbteHasta: invNum,
            CbteFch: (new Date()).toISOString().slice(0,10).replace(/-/g,""),
            ImpTotal: invAmount,
            ImpTotConc: invAmount,
            ImpNeto: 0,
            ImpOpEx: 0,
            ImpTrib: 0,
            ImpIVA: 0,
            MonId: "PES",
            MonCotiz: 1,
            targetNSAlias: "tns",
            targetNamespace: "http://ar.gov.afip.dif.FEV1/",
          },
          targetNSAlias: "tns",
          targetNamespace: "http://ar.gov.afip.dif.FEV1/",
        },
        targetNSAlias: "tns",
        targetNamespace: "http://ar.gov.afip.dif.FEV1/",
      },
    };
    return ret;
  },
};
