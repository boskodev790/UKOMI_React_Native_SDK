/**
 * Account information model returned by account API endpoints.
 */
export interface Account {
  /** Response status */
  status: string;
  /** Response code */
  code: number;
  /** Account name */
  name?: string;
  /** Account URL */
  url?: string;
  /** Framework identifier */
  framework?: string;
}

