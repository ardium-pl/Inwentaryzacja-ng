export interface Transaction {
  transactionId: string; // ID Transakcji
  year: string; // Rok którego ma dotyczyć dokumentacja
  sellerName: string; // Nazwa sprzedawcy/pożyczkodawcy/emitenta
  buyerName: string; // Nazwa odbiorcy/pożyczkobiorcy
  transactionType: string; // Rodzaj transakcji
  transactionSubject: string; // Nazwa/przedmiot transakcji
  netValue: number; // Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału
  currency: string; // Waluta
  loanDate: string; // Data udzielenia pożyczki/gwarancji
  interestRate: string; // Oprocentowanie (w przypadku transakcji finansowych)
  repaymentDate: string; // Data spłaty (w przypadku transakcji finansowych)
  significanceLimit: number; // Limit istotności [PLN]
  homogeneousTransactionValue: number; // Wartość transakcji kontrolowanej o charakterze jednorodnym [PLN]
  taxExemption: string; // Zwolnienie art. 11n CIT
  documentationRequirement: string; // Obowiązek dokumentacji
  benchmarkRequirement: string; // Obowiązek benchmarku
  tpr: string; // TPR
  selection: string;
  displayColor_seller: string;
  displayBold_seller: boolean;
  displayColor_buyer: string;
  displayBold_buyer: boolean;
}

/**
 * Documentation:
 * - transactionId: ID of the transaction.
 * - year: Year to which the documentation applies.
 * - sellerName: Name of the seller/lender/issuer.
 * - buyerName: Name of the buyer/borrower.
 * - transactionType: Type of transaction.
 * - transactionSubject: Name/subject of the transaction.
 * - netValue: Net value of services rendered in the given year / Highest capital available in the tax year.
 * - currency: Currency of the transaction.
 * - loanDate: Date the loan/guarantee was granted.
 * - interestRate: Interest rate (for financial transactions).
 * - repaymentDate: Repayment date (for financial transactions).
 * - significanceLimit: Significance limit in PLN.
 * - homogeneousTransactionValue: Value of controlled transaction of a homogeneous nature in PLN.
 * - taxExemption: CIT art. 11n exemption.
 * - documentationRequirement: Documentation requirement.
 * - benchmarkRequirement: Benchmarking requirement.
 * - tpr: Transfer Pricing Regulations (TPR) compliance.
 * - selection: Value used in selecting the rows for joining sum.
 */
