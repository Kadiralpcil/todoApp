import { isDevelopment, isProduction } from "./env";

const apiUrl =
  process.env.NODE_ENV === "development" ? "devServerURL" : "prodServerURL";

export { isDevelopment, isProduction, apiUrl };
