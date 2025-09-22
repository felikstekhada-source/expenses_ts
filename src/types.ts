export type ExpenseItem = {
  id: number;
  entryType: "EXPENSE" | "INCOME";
  name: string;
  amount: number;
};
