import {
  BalanceCardItem,
  BalanceView,
  DivContainer,
  FormInput,
  Title,
} from "../components/components";
import { componentIDs, tableHeadData, type ComponentId } from "../constants";
import { ExpenseDBClient } from "../expenseDBClien/expenseDBClient";
// import { appObserver } from "../main2";
import type { EntryType } from "../types";
import { BaseComponent } from "./baseComponent";
const { ID_BALANCE_COMPONENT, ID_TABLE_COMPONENT, ID_FORM_COMPONENT } =
  componentIDs;

export class App {
  private appContainer: HTMLElement;
  private dbClient: ExpenseDBClient;
  private dbClientInitialized: boolean = false;
  // private observer = appObserver;

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
      this.doRerender([ID_BALANCE_COMPONENT, ID_TABLE_COMPONENT]);
    });
  }

  private createListeners() {
    this.createTableRemoveButtonListener();
  }

  private rerenderSpecificComponent(componentsIdsArr: ComponentId[]) {
    // const balanceComponent = document.getElementById(ID_BALANCE_COMPONENT);
    const tableComponent = document.getElementById(ID_TABLE_COMPONENT);
    // const formComponent = document.getElementById(ID_FORM_COMPONENT);

    componentsIdsArr.forEach((oneId) => {
      switch (oneId) {
        // case ID_BALANCE_COMPONENT:
        //   {
        //     const component = balanceComponent;
        //     if (component) {
        //       component.innerHTML = "";
        //       balanceComponent?.appendChild(this.renderBalanceComponents());
        //     }
        //   }
        //   break;
        // case ID_FORM_COMPONENT:
        //   {
        //     const component = formComponent;
        //     if (component) {
        //       component.innerHTML = "";
        //       formComponent?.appendChild(this.renderFormComponents());
        //     }
        //   }
        //   break;
        case ID_TABLE_COMPONENT:
          {
            const component = tableComponent;
            if (component) {
              component.innerHTML = "";
              tableComponent?.appendChild(this.renderTableComponents());
            }
          }
          break;
        default:
          break;
      }
    });
  }

  private async doRerender(componentIds: ComponentId[]) {
    console.log("DO RERENDER");
    await this.updateDb();
    this.rerenderSpecificComponent([...componentIds]);
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
    this.dataDB = await this.dbClient.getAll();
  }

  public async startApp() {
    await this.updateDb();
    const myApp = this.renderComponents();
    this.appContainer.appendChild(myApp.render());
    this.createListeners();
  }

  public renderBalanceComponents(): HTMLElement {
    const BalanceCardIncome = new BalanceCardItem(
      "Income",
      "green",
      // this.counter.getTotalIconme.bind(this.counter)
      () => this.getTotal("INCOME")
    );
    const BalanceCardExpenses = new BalanceCardItem(
      "Expenses",
      "red",
      // this.counter.getTotalExpenes.bind(this.counter)
      () => this.getTotal("EXPENSE")
    );

    // const BalanceView = new DivContainer(
    //   [new Title(`Balance: ${this.getBalance()}`, "big")],
    //   "balance-view"
    // );

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
    console.log(
      "%cTABLE component render",
      "color: yellow; background: black; font-size: 16px; padding:5px"
    );

    const createDeleteButton = (id: number) => {
      const Button = new BaseComponent(
        { tag: "button" },
        "remove",
        undefined,
        "fom-delete-btn",
        {
          "data-id": id,
        }
      );

      return Button.render();
    };

    const createTableHead = (headData: string[]) => {
      const thead = document.createElement("thead");
      thead.className = "table-htead";
      const tr = document.createElement("tr");
      tr.className = "tabke-htead-tr";

      headData.forEach((e) => {
        const el = document.createElement("th");
        el.textContent = e;
        el.classList = "tabke-htead-tr-th";
        tr.appendChild(el);
      });

      return thead.appendChild(tr);
    };

    const createTableBody = (): HTMLTableSectionElement => {
      const dbData = this.dbClient.getLocalStore();
      const tbody = document.createElement("tbody");
      tbody.className = "table-tbody";

      dbData.forEach((e) => {
        const tr = document.createElement("tr");
        tr.classList = "table-tbody-tr";
        const elementsOrdered = [e.id, e.name, e.amount, e.entryType]; //REMOVE

        elementsOrdered.forEach((eo) => {
          const td = document.createElement("td");
          td.className = "table-tbody-tr-td";
          td.textContent = eo.toString();
          tr.appendChild(td);
        });
        tr.appendChild(document.createElement("td")).appendChild(
          createDeleteButton(e.id)
        );
        tbody.appendChild(tr);
      });

      return tbody;
    };

    const finalComponent = new DivContainer(
      [
        new Title("Expenses", "middle"),
        new BaseComponent(
          { tag: "table" },
          undefined,
          [createTableHead(tableHeadData), createTableBody()],
          "table"
        ),
      ],
      "table-container"
    );

    return finalComponent.render();
  }

  private renderComponents(): BaseComponent {
    const FormContainer = new DivContainer(
      [this.renderFormComponents()],
      undefined,
      { id: ID_FORM_COMPONENT }
    );

    const TableContainer = new DivContainer(
      [this.renderTableComponents()],
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
