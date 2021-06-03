export interface StoredPassword {
  hash: string;
  salt: string;
  iterations: number;
}

export interface User {
  username: string;
  customer_id: string;
  password: StoredPassword;
}
