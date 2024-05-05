const isProduction = () => {
  return process.env.NODE_ENV ? process.env.NODE_ENV === "production" : false;
};

const isDevelopment = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
};

export { isProduction, isDevelopment };
