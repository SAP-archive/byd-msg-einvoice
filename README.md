# A Decoupled Approach for the Electronic Invoicing
[![](https://i.imgur.com/fn8PnPn.jpg)]()

## Overview
This application creates electronic invoices based on SAP Business ByDesign Custormer Invoice. When invoked, it pulls Customer Invoice data from ByD OData services and calls the Tax Authority web service (in this case [AFIP](https://www.afip.gob.ar/ws/)). Once the electronic invoice is authorized and created, it writes back the signature data into a ByD Customer Invoice extension field.

## Pre requisites
* SAP Cloud Platform Enterprise Messaging
* SAP Business ByDesign Tenant
* A [ByD Custom Odata Service](https://github.com/SAP-samples/sapbydesign-api-samples/) for [Customer Invoice](https://github.com/SAP-samples/sapbydesign-api-samples/blob/master/Custom%20OData%20Services/khcustomerinvoice.xml)
**NOTE:** you must create a new extension field on customer invoice document, and add it to the OData service exposed above

## Deployment
Clone or download this repository:
```bash
git clone https://github.com/B1SA/eInvoiceAfip.git
```
From its root folder, open the terminal, login to your SCP account and push it.
```bash
cf push --random-route
```

After it finishes the deployment, set up the environment variable for your ERP URL as a fallback in case there's no indication in the consumed message:
```bash
cf set-env <app_name> ERP_URL <your_ERP_URL>
```
For details on how to deploy apps on SCP CF check this tutorial: [Get Started with SAP Cloud Platform Trial](https://developers.sap.com/tutorials/cp-trial-quick-onboarding.html)

### Configuring SAP Cloud Platform Enterprise Messaging
You must create at least one queue and subscribe a webhook to the queue, pointing to the application you have just deployed above. For details on how to create queues and subscribe webhooks, check this blog post: [SCP Enterprise Messaging for the SMBs](https://blogs.sap.com/2020/10/21/scp-enterprise-messaging-for-the-smbs)

### Configuring SAP Cloud Platform Enterprise Messaging
You must create at least one queue and subscribe a webhook to the queue, pointing to the application you have just deployed above. For details on how to create queues and subscribe webhooks, check this blog post: [SCP Enterprise Messaging for the SMBs](https://blogs.sap.com/2020/10/21/scp-enterprise-messaging-for-the-smbs)

## License
This proof of concept is is released under the terms of the MIT license. See [LICENSE](LICENSE) for more information or see https://opensource.org/licenses/MIT.
 
## Support and Contributions
This repository is provided "as-is". No support is available. Feel free to open issues or provide pull requests.

