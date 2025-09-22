// import { ExpenseDBClient } from "./expenseDBClien/expenseDBClient";
// import { BaseComponent } from "./helpers/baseComponent";
// import { Counter } from "./helpers/counter";
// import "./index.css";
// const app = document.getElementById("root");
// let counter: Counter | null = null;

// const startDB = async () => {
//   const db = new ExpenseDBClient();
//   await db.init();
//   const allDB = await db.getAll();
//   counter = new Counter(allDB);
// };

// const appRender = () => {
//   app?.appendChild(App.render());
// };

// (async () => {
//   await startDB();
//   appRender();

//   if (counter) {
//     const c = counter as Counter;
//     //  c.getTotalExpenes();
//   }
// })();

// // const Button = new BaseComponent("button", "push", undefined, undefined, {
// //   onClick: () => console.log("hello"),
// // });

// const BalanceTotalIncome = new BaseComponent(
//   "div",
//   "BalanceTotalIncome ",
//   undefined,
//   "balance-total-income"
// );

// const BalanceTotalExpences = new BaseComponent(
//   "div",
//   "all.toString()",
//   undefined,
//   "balance-total-expenses"
// );

// const BalanceView = new BaseComponent(
//   "div",
//   undefined,
//   [BalanceTotalIncome, BalanceTotalExpences],
//   "balance-view"
// );

// const App = new BaseComponent("div", undefined, [BalanceView]);
