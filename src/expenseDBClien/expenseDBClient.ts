import { Database, DatabaseFactory } from "@idxdb/promised";
import type { EntryType, ExpenseItem } from "../types";
import { Observer } from "../helpers/Observer";
import { appObserver } from "../main2";

const DB_NAME = "expenseDB";
const REQUESTED_VERSION = 1;

export class ExpenseDBClient {
  private db!: Database;
  private STORE_NAME = "expenses";
  private localStore: ExpenseItem[] = [];
  private observer: Observer = appObserver;
  private migrations = [
    {
      version: 1,
      migration: async ({ db }) => {
        db.createObjectStore(this.STORE_NAME, { keyPath: "id" });
      },
    },
  ];

  constructor() {}

  public async init() {
    this.db = await DatabaseFactory.open(
      DB_NAME,
      REQUESTED_VERSION,
      this.migrations
    );
    console.log("---- DB CLIENT CREATED ----");

    this.localStore = await this.getAll();
  }

  public async addExpense(item: Omit<ExpenseItem, "id">) {
    try {
      const tx = this.db.transaction([this.STORE_NAME], "readwrite");
      const store = tx.objectStore(this.STORE_NAME);
      const all: ExpenseItem[] = this.localStore;
      const id = all.length > 0 ? all[all.length - 1].id + 1 : 1;
      await store.add({ id, ...item });
      await tx.commit();
      /////////
      this.localStore.push({ id, ...item });
      this.observer.notify("expenseAdded");
    } catch (err) {
      console.error(`error in ExpenseDBClient/addExpense: ${err}`);
    }
  }

  private removeElFromDOM(id: string) {
    const elsToRemove = document.getElementsByClassName("table-tbody-tr");
    const arr = Array.from(elsToRemove);
    arr.forEach((e) => {
      if (e.dataset.id === id) {
        e.remove();
      }
    });
  }

  public async removeExpense(id: number) {
    try {
      const tx = this.db.transaction([this.STORE_NAME], "readwrite");
      const store = tx.objectStore(this.STORE_NAME);
      await store.delete(id);
      await tx.commit();
      ////
      this.removeElFromDOM(id.toString());
      this.localStore = this.localStore.filter((e) => e.id !== id);
      this.observer.notify("expenseRemoved");
    } catch (err) {
      console.error(`error in ExpenseDBClient/removeExpense: ${err}`);
    }
  }

  public async getAll(): Promise<ExpenseItem[]> {
    try {
      const tx = this.db.transaction([this.STORE_NAME], "readonly");
      const store = tx.objectStore(this.STORE_NAME);
      const all: ExpenseItem[] = await store.getAll();
      await tx.commit();
      return all;
    } catch (err) {
      console.error(`error in ExpenseDBClient/getAll: ${err}`);
      return [];
    }
  }

  public getTotal(type: EntryType) {
    let total = 0;

    this.localStore.forEach((e) => {
      if (e.entryType === type) {
        total += e.amount;
      }
    });
    return total;
  }

  public getBalance() {
    let totalIncome = 0;
    let totalExpense = 0;

    this.localStore.forEach((e) => {
      if (e.entryType === "INCOME") totalIncome += e.amount;
      else if (e.entryType === "EXPENSE") totalExpense += e.amount;
    });

    return totalIncome - totalExpense;
  }

  public getLocalStore() {
    return this.localStore;
  }
}
