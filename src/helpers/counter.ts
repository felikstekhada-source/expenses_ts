// import type { ExpenseItem } from "../types";

// export class Counter {
//   private dbData: ExpenseItem[];
//   constructor() {}

//   public updateData(db: ExpenseItem[]) {
//     this.dbData = db;
//   }

//   public getTotalIconme() {
//     let totalIncome = 0;
//     this.dbData.forEach((e) => {
//       if (e.entryType === "INCOME") {
//         totalIncome += e.amount;
//       }
//     });
//     return totalIncome;
//   }

//   public getTotalExpenes() {
//     let totalExpenes = 0;
//     this.dbData.forEach((e) => {
//       if (e.entryType === "EXPENSE") {
//         totalExpenes += e.amount;
//       }
//     });
//     return totalExpenes;
//   }

//   public getBalance() {
//     return this.getTotalIconme() - this.getTotalExpenes();
//   }
// }
