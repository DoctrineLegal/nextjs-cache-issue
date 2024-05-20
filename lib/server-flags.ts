import optimizely from "@optimizely/optimizely-sdk";
import { unstable_declareServerFlag as declareServerFlag } from "@vercel/flags/next/server";
import { getCookieFromHeaders } from "./utils";
import { reportValue } from "@vercel/flags";

export const showBuyNowFlag = declareServerFlag<{
  enabled: boolean;
  buttonText?: string;
}>({
  key: "buynow",
  description: "Flag for showing Buy Now button on PDP",
  options: [
    { label: "off", value: { enabled: false } },
    { label: "on", value: { enabled: true } },
  ],
  async decide({ headers }) {
    const client = optimizely.createInstance({
      sdkKey: process.env.OPTIMIZELY_SDK_KEY!,
    });

    if (!client) {
      throw new Error("Failed to create client");
    }

    await client.onReady();

    const shopperId = getCookieFromHeaders("shopper", headers);
    const context = client.createUserContext(shopperId);

    if (!context) {
      throw new Error("Failed to create user context");
    }

    const decision = context.decide("buynow");
    const flag = {
      enabled: decision.enabled,
      buttonText: decision.variables.buynow_text as string,
    };

    reportValue("buynow", flag);

    return flag;
  },
});
