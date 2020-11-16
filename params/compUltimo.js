module.exports = {
  Auth: {
    Token: process.env.AFIP_TOKEN,
    Sign: process.env.AFIP_SIGN,
    Cuit: process.env.AFIP_CUIT,
    targetNSAlias: "tns",
    targetNamespace: "http://ar.gov.afip.dif.FEV1/",
  },
  PtoVta: 2,
  CbteTipo: 001,
  targetNSAlias: "tns",
  targetNamespace: "http://ar.gov.afip.dif.FEV1/",
};
