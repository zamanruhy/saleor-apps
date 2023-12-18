import { APL, FileAPL, SaleorCloudAPL, UpstashAPL, EnvAPL } from "@saleor/app-sdk/APL";
import { SaleorApp } from "@saleor/app-sdk/saleor-app";

const aplType = process.env.APL ?? "file";

export let apl: APL;

switch (aplType) {
  case "upstash":
    apl = new UpstashAPL();

    break;
  case "file":
    apl = new FileAPL();

    break;
  // case "env":
  //   apl = new EnvAPL({
  //     env: {
  //       /**
  //        * Map your env variables here. You don't have these values yet
  //        */
  //       token: process.env.SALEOR_APP_TOKEN!,
  //       appId: process.env.SALEOR_APP_ID!,
  //       saleorApiUrl: process.env.SALEOR_API_URL!,
  //     },
  //     /**
  //      * Set it to "true" - check your app logs during app registration. APL will print the values you need
  //      */
  //     printAuthDataOnRegister: true,
  //   });

  //   break;
  case "saleor-cloud": {
    if (!process.env.REST_APL_ENDPOINT || !process.env.REST_APL_TOKEN) {
      throw new Error("Rest APL is not configured - missing env variables. Check saleor-app.ts");
    }

    apl = new SaleorCloudAPL({
      resourceUrl: process.env.REST_APL_ENDPOINT,
      token: process.env.REST_APL_TOKEN,
    });

    break;
  }
  default: {
    throw new Error("Invalid APL config, ");
  }
}
export const saleorApp = new SaleorApp({
  apl,
});

export const REQUIRED_SALEOR_VERSION = ">=3.11.7 <4";
