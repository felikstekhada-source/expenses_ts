import { BaseComponent } from "../helpers/baseComponent";
import { appObserver } from "../main2";

export class Title extends BaseComponent {
  constructor(title: string, size: "small" | "middle" | "big") {
    let tag: keyof HTMLElementTagNameMap;
    let className: string;

    switch (size) {
      case "big":
        tag = "h1";
        className = "title-big";
        break;
      case "middle":
        tag = "h3";
        className = "title-middle";
        break;
      case "small":
      default:
        tag = "h4";
        className = "title-small";
        break;
    }

    super({ tag }, title, undefined, className);
  }
}

export class DivContainer extends BaseComponent {
  constructor(
    children?: HTMLElement[] | BaseComponent[],
    className?: string,
    props?: any
  ) {
    super({ tag: "div" }, undefined, children, className, props);
  }
}

export class FormInput extends BaseComponent {
  constructor(type: string, placeHolder: string, id: string) {
    super({ tag: "input", type }, undefined, undefined, undefined, {
      placeHolder,
      id,
    });
  }
}

export class TotalView extends BaseComponent {
  private moneyFn: () => number;
  private color: string;

  constructor(getMoney: () => number, color: string) {
    super(
      { tag: "div" },
      getMoney().toString(),
      undefined,
      "balance-card-money",
      {
        style: `color: ${color}`,
      }
    );

    this.moneyFn = getMoney;
    this.color = color;
    appObserver.subscribe(["expenseAdded", "expenseRemoved"], () =>
      this.rerender()
    );
  }

  private rerender() {
    if (!this.newElement) return;
    console.log(
      "%cTotalView component rendered",
      "color: yellow; background: red; font-size: 16px; padding:5px"
    );
    const newComponent = new TotalView(this.moneyFn, this.color);
    this.newElement.replaceWith(newComponent.render());
  }
}

export class BalanceCardItem extends BaseComponent {
  constructor(title: string, color: string, getTotalCallback: () => number) {
    super({ tag: "div" }, undefined, [
      new Title(title, "small"),
      new TotalView(getTotalCallback, color),
    ]);
  }
}

// export class BalanceView extends BaseComponent {
//   private getBalance: () => number;
//   constructor(getBalance: () => number) {
//     super(
//       { tag: "div" },
//       undefined,
//       [new Title(`Balance: ${getBalance()}`, "big")],
//       "balance-view",
//       undefined
//     );
//     this.getBalance = getBalance;
//     appObserver.subscribe(["expenseAdded", "expenseRemoved"], () =>
//       this.rerender()
//     );
//   }

export class BalanceView extends BaseComponent {
  private getBalance: () => number;
  constructor(getBalance: () => number) {
    super(
      { tag: "div" },
      getBalance().toString(),
      undefined,
      "balance-number"
      // undefined
    );
    this.getBalance = getBalance;
    appObserver.subscribe(["expenseAdded", "expenseRemoved"], () =>
      this.rerender()
    );
  }

  private rerender() {
    console.log(
      "%cBalanceView component rendered",
      "color: black; background: yellow; font-size: 16px; padding:5px"
    );
    if (!this.newElement) return;
    const newComponent = new BalanceView(this.getBalance);
    this.newElement.replaceWith(newComponent.render());
  }
}
