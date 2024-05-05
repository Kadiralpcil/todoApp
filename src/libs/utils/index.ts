import { isDevelopment, isProduction } from "./env";

const apiUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : "https://todo-app-nine-dusky-49.vercel.app/";

export { isDevelopment, isProduction, apiUrl };
