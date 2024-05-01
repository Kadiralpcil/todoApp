import { jwtVerify } from "jose";

export const getSecretKey = () => {
  const secretKey =
    "Gc6$^9#7Yz@L!2rXBd&5@Nj^%3tH$!c*W@1#J!5vTf^uBd@Ks!7q^U@9g%m2#";

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
