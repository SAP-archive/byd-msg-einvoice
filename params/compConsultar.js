module.exports = {
  initValuesConsultar: function (invNum) {
    const ret = {
      Auth: {
        Token: process.env.AFIP_TOKEN,
        Sign: process.env.AFIP_SIGN,
        Cuit: process.env.AFIP_CUIT,
        targetNSAlias: "tns",
        targetNamespace: "http://ar.gov.afip.dif.FEV1/",
      },
      FeCompConsReq: {
        CbteTipo: 001,
        CbteNro: invNum,
        PtoVta: 2,
        targetNSAlias: "tns",
        targetNamespace: "http://ar.gov.afip.dif.FEV1/",
      },
    };
    return ret;
  },
};
