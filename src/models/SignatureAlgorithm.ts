// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

export type SignatureHashFunction
  = "SHA-224"
  | "SHA-256"
  | "SHA-384"
  | "SHA-512"
  | "SHA3-224"
  | "SHA3-256"
  | "SHA3-384"
  | "SHA3-512";

export type SignatureCryptoAlgorithm
  = "ECC"
  | "RSA";

export type SignaturePaddingScheme
  = "NONE"
  | "PKCS1.5"
  | "PSS";

export interface SignatureAlgorithm {
  hashFunction: SignatureHashFunction;
  paddingScheme: SignaturePaddingScheme;
  cryptoAlgorithm: SignatureCryptoAlgorithm;
}
