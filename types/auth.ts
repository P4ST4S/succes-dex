export interface Session {
  email: string;
  isAdmin: boolean;
}

export interface MagicLinkRequestResult {
  success: boolean;
  error?: string;
}

export interface MagicLinkVerifyResult {
  success: boolean;
  error?: string;
}
