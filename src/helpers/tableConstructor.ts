import { BaseComponent } from "./baseComponent";

export class TableConstructor {
  private data: Array<any>;
  private headData: Array<string>;

  constructor(data: Array<any>, headData: Array<string>) {
    this.data = data;
    this.headData = headData;
  }

  private createDeleteButton = (id: number) => {
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

  private createTableHead = (): HTMLTableRowElement => {
    const thead = document.createElement("thead");
    thead.className = "table-htead";
    const tr = document.createElement("tr");
    tr.className = "tabke-htead-tr";

    this.headData.forEach((e) => {
      const el = document.createElement("th");
      el.textContent = e;
      el.classList = "tabke-htead-tr-th";
      tr.appendChild(el);
    });

    return thead.appendChild(tr);
  };

  private createTableBody = (): HTMLTableSectionElement => {
    const dbData = this.data;
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
        this.createDeleteButton(e.id)
      );
      tbody.appendChild(tr);
    });

    return tbody;
  };

  public createTable() {
    const table = new BaseComponent(
      { tag: "table" },
      undefined,
      [this.createTableHead(), this.createTableBody()],
      "table"
    );

    return table.render();
  }
}
