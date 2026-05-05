

// Tipo auxiliar para converter do banco de dados (que guarda bytea/text)
// para o tipo que a lib SimpleWebAuthn espera.
export interface WebAuthnCredential {
  credentialID: Uint8Array;
  credentialPublicKey: Uint8Array;
  counter: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transports?: any[];
}

export const rpName = "QuadraHub";
export const rpID = process.env.NODE_ENV === "production" ? "quadrahub.com" : "localhost";
export const origin = process.env.NODE_ENV === "production" ? `https://${rpID}` : `http://${rpID}:3003`;

export function uint8ArrayToBase64url(bytes: Uint8Array): string {
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function base64urlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binaryString = atob(base64 + padding);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
