import { Platform } from "react-native";

export const itemSkus = Platform.select({
  ios: ["com.kizbin.monthly.subscription", "com.kizbin.yearly.subscription"],
  android: [
    "com.kizbin.monthly.subscription",
    "com.kizbin.yearly.subscription",
  ],
});
