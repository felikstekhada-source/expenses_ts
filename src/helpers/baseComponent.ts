export class BaseComponent {
  private element: BaseComponentElement;
  private text?: string;
  private children?: HTMLElement[] | BaseComponent[];
  private className?: string;
  private baseClassName: string = "base-component";
  private props?: any;
  protected newElement!: HTMLElement;

  constructor(
    element: BaseComponentElement,
    text?: string,
    children?: HTMLElement[] | BaseComponent[],
    className?: string,
    props = {}
  ) {
    this.element = element;
    this.className = className;
    this.children = children;
    this.text = text;
    this.props = props;
  }

  private createNewElement(): HTMLElement {
    this.newElement = document.createElement(this.element.tag);

    if (this.element.type) {
      this.newElement.setAttribute("type", this.element.type);
    }
    if (this.className)
      this.newElement.className = this.baseClassName + ` ${this.className}`;

    if (this.text) this.newElement.textContent = this.text;
    return this.newElement;
  }

  private createChildren() {
    if (this.children) {
      this.children.forEach((e) => {
        if (e instanceof BaseComponent) this.newElement.appendChild(e.render());
        else {
          this.newElement.appendChild(e);
        }
      });
    }
  }

  private parseProps() {
    Object.entries(this.props).forEach(([key, value]) => {
      if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        this.newElement.addEventListener(eventName, value as EventListener);
      } else {
        this.newElement.setAttribute(key, value as string);
      }
    });
  }

  public render(): HTMLElement {
    this.createNewElement();
    this.parseProps();
    this.createChildren();
    return this.newElement;
  }
}

type BaseComponentElement = {
  tag: keyof HTMLElementTagNameMap;
  type?: string;
};
