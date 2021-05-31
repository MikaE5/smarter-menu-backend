export interface StoredPassword {
  hash: string;
  salt: string;
  iterations: number;
}
