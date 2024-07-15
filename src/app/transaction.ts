export interface Transaction {
  transactionId: string;          // transactionId: ID of the transaction.
  year: string;                   // year: Year to which the documentation applies.
  sellerName: string;             // sellerName: Name of the seller/lender/issuer.
  buyerName: string;              // buyerName: Name of the buyer/borrower.
  transactionType: string;        // transactionType: Type of transaction.
  transactionSubject: string;     // transactionSubject: Name/subject of the transaction
  netValue: number;               // etValue: Net value of services rendered in the given year / Highest capital available in the tax year.
  currency: string;               // currency: Currency of the transaction.
  loanDate: string;               // oanDate: Date the loan/guarantee was granted.
  interestRate: number;           // interestRate: Interest rate (for financial transactions).
  repaymentDate: string;          // repaymentDate: Repayment date (for financial transactions).
  significanceLimit: number;      // significanceLimit: Significance limit in PLN.
  homogeneousTransactionValue: number; // homogeneousTransactionValue: Value of controlled transaction of a homogeneous nature in PLN.
  taxExemption: string;           // taxExemption: CIT art. 11n exemption.
  documentationRequirement: string; // documentationRequirement: Documentation requirement.
  benchmarkRequirement: string;   // benchmarkRequirement: Benchmarking requirement.
  tpr: string;                    // tpr: Transfer Pricing Regulations (TPR) compliance.
  selection: string;              // selection: Value used in selecting the rows for joining sum.
  displayColor_seller: string;
  displayBold_seller: boolean;
  displayColor_buyer: string;
  displayBold_buyer: boolean;

  [property: string]: any;
}

