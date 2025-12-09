declare module "jsonwebtoken" {
  export type Secret = string | Buffer;

  export interface SignOptions {
    expiresIn?: string | number;
  }

  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: Secret,
    options?: SignOptions
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: Secret
  ): object | string;
}
