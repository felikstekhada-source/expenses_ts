export type ExpenseItem = {
  id: number;
  entryType:EntryType ;
  name: string;
  amount: number;
};


export type EntryType = "EXPENSE" | "INCOME"

