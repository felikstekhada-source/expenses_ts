export const componentIDs = {
  ID_FORM_COMPONENT: "id-form-component",
  ID_TABLE_COMPONENT: "id-table-component",
  ID_BALANCE_COMPONENT: "id-balance-component",
};

export const tableHeadData = ["id", "Name", "Amount", "Type", "Delete"];

export type ComponentId = (typeof componentIDs)[keyof typeof componentIDs];
