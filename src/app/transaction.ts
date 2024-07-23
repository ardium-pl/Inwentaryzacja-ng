/**
 * Represents a transaction within the system, detailing all aspects of the transaction
 * including parties involved, financial details, and compliance requirements.
 */
export interface Transaction {
  /** ID of the transaction. */
  transactionId: string;
  /** Year to which the documentation applies. */
  year: string;
  /** Name of the seller/lender/issuer. */
  sellerName: string;
  /** Name of the buyer/borrower. */
  buyerName: string;
  /** Type of transaction. */
  transactionType: string;
  /** Name/subject of the transaction. */
  transactionSubject: string;
  /** Net value of services rendered in the given year / Highest capital available in the tax year. */
  netValue: number;
  /** Currency of the transaction. */
  currency: string;
  /** Date the loan/guarantee was granted. */
  loanDate: string;
  /** Interest rate (for financial transactions). */
  interestRate: number;
  /** Repayment date (for financial transactions). */
  repaymentDate: string;
  /** Significance limit in PLN. */
  significanceLimit: number;
  /** Value of controlled transaction of a homogeneous nature in PLN. */
  homogeneousTransactionValue: number;
  /** CIT art. 11n exemption. */
  taxExemption: string;
  /** Documentation requirement. */
  documentationRequirement: string;
  /** Benchmarking requirement. */
  benchmarkRequirement: string;
  /** Transfer Pricing Regulations (TPR) compliance. */
  tpr: string;
  /** Value used in selecting the rows for joining sum. */
  selection: string;
  /** Display color for the seller in UI representation. */
  displayColor_seller: string;
  /** Whether to display the seller name in bold in the UI. */
  displayBold_seller: boolean;
  /** Display color for the buyer in UI representation. */
  displayColor_buyer: string;
  /** Whether to display the buyer name in bold in the UI. */
  displayBold_buyer: boolean;

  /** Allows for additional properties not explicitly defined in the interface. */
  [property: string]: any;
}
