import { App } from "./helpers/app";
import { Observer } from "./helpers/Observer";
import "./index.css";

export const appObserver = new Observer();
const appInstance = new App("root");
appInstance.startApp();


