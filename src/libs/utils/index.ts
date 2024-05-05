import { isDevelopment, isProduction } from "./env";

const apiUrl = isDevelopment()
  ? "http://localhost:3000/"
  : `${window.location.origin}/`;

export { isDevelopment, isProduction, apiUrl };
