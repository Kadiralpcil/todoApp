import { jwtVerify } from "jose";

export const getSecretKey = () => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error("JWT Secret key is not found");
  }
  return new TextEncoder().encode(secretKey);
};

export async function verifyJwtToken(token: string | Uint8Array) {
  try {
    await jwtVerify(token, getSecretKey());
    return token;
  } catch (error) {
    return null;
  }
}
