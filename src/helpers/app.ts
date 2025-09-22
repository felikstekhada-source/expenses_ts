import {
  BalanceCardItem,
  BalanceView,
  DivContainer,
  FormInput,
  Table,
  Title,
} from "../components/components";
import { componentIDs, tableHeadData } from "../constants";
import { ExpenseDBClient } from "../expenseDBClien/expenseDBClient";
import type { EntryType } from "../types";
import { BaseComponent } from "./baseComponent";
import { TableConstructor } from "./tableConstructor";
const { ID_BALANCE_COMPONENT, ID_TABLE_COMPONENT, ID_FORM_COMPONENT } =
  componentIDs;

export class App {
  private appContainer: HTMLElement;
  private dbClient: ExpenseDBClient;
  private dbClientInitialized: boolean = false;

  constructor(containerID: string) {
    const el = document.getElementById(containerID);
    if (!el) {
      throw new Error("There is no root");
    } else {
      this.appContainer = el;
    }
    this.dbClient = new ExpenseDBClient();
  }

  private createTableRemoveButtonListener() {
    const tableContainer = document.getElementById(ID_TABLE_COMPONENT);
    if (!tableContainer) return;

    tableContainer.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const btn = target.closest(".fom-delete-btn") as HTMLElement | null;

      if (!btn) return;
      if (!btn.dataset.id) return;

      this.dbClient.removeExpense(+btn.dataset.id);
    });
  }

  private createListeners() {
    this.createTableRemoveButtonListener();
  }

  private getTotal(type: EntryType) {
    return this.dbClient.getTotal(type);
  }

  private getBalance() {
    return this.dbClient.getBalance();
  }

  private async updateDb() {
    if (!this.dbClientInitialized) {
      await this.dbClient.init();
      this.dbClientInitialized = true;
    }
  }

  public async startApp() {
    await this.updateDb();
    const myApp = this.renderComponents();
    this.appContainer.appendChild(myApp.render());
    this.createListeners();
  }

  public createTable() {
    const table = new TableConstructor(
      this.dbClient.getLocalStore(),
      tableHeadData
    );

    return table.createTable();
  }

  public renderBalanceComponents(): HTMLElement {
    const BalanceCardIncome = new BalanceCardItem("Income", "green", () =>
      this.getTotal("INCOME")
    );
    const BalanceCardExpenses = new BalanceCardItem("Expenses", "red", () =>
      this.getTotal("EXPENSE")
    );

    const BalanceViewComponent = new DivContainer(
      [new Title(`Balance: `, "big"), new BalanceView(() => this.getBalance())],
      "balance-view"
    );

    const BalanceCards = new DivContainer(
      [BalanceCardIncome, BalanceCardExpenses],
      "balance-cards"
    );

    const finalComponent = new DivContainer(
      [BalanceViewComponent, BalanceCards],
      "balance-container"
    );

    return finalComponent.render();
  }

  public renderFormComponents(): HTMLElement {
    console.log(
      "%cFORM component render",
      "color: white; background: green; font-size: 16px; padding:5px"
    );

    const FormNameInput = new FormInput("text", "Name", "nameInput");
    const FormAmountInput = new FormInput("number", "Amount", "amountInput");

    const FormEntryType = new BaseComponent(
      { tag: "select" },
      undefined,
      [new Option("INCOME", "INCOME"), new Option("EXPENSE", "EXPENSE")],
      undefined,
      { id: "enryTypeInput" }
    );

    const FormAddButton = new BaseComponent(
      { tag: "button" },
      "ADD EXPENSE",
      undefined,
      "",
      {
        onClick: () => {
          const inputName = document.getElementById(
            "nameInput"
          ) as HTMLInputElement;

          const inputAmount = document.getElementById(
            "amountInput"
          ) as HTMLInputElement;

          const inputEntryType = document.getElementById(
            "enryTypeInput"
          ) as HTMLSelectElement;

          if (
            inputName.value !== "" &&
            inputAmount.value !== "" &&
            inputEntryType
          ) {
            this.dbClient.addExpense({
              name: inputName?.value,
              amount: +inputAmount.value,
              entryType: inputEntryType.value as EntryType,
            });
            inputName.value = "";
            inputAmount.value = "";
          } else {
            inputName.placeholder = "Type your name";
            inputAmount.placeholder = "Type amount";
          }
        },
      }
    );

    const finalComponent = new DivContainer([
      new Title("Add new", "middle"),
      new DivContainer(
        [FormEntryType, FormNameInput, FormAmountInput, FormAddButton],
        "form"
      ),
    ]);

    return finalComponent.render();
  }

  public renderTableComponents(): HTMLElement {
    const TableComponent = new Table(() => this.createTable());
    return TableComponent.render();
  }

  private renderComponents(): BaseComponent {
    const FormContainer = new DivContainer(
      [this.renderFormComponents()],
      undefined,
      { id: ID_FORM_COMPONENT }
    );

    const TableContainer = new DivContainer(
      [new Title("Expenses", "middle").render(), this.renderTableComponents()],
      undefined,
      { id: ID_TABLE_COMPONENT }
    );

    const TableAndFormContainer = new DivContainer(
      [FormContainer, TableContainer],
      "form-and-table-container"
    );
    const BalanceContainer = new DivContainer(
      [this.renderBalanceComponents()],
      undefined,
      { id: ID_BALANCE_COMPONENT }
    );

    const App = new DivContainer(
      [BalanceContainer.render(), TableAndFormContainer.render()],
      "main-wrapper"
    );

    return App;
  }
}
