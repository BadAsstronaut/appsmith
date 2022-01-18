const dsl = require("../../../../fixtures/emptyDSL.json");
const explorer = require("../../../../locators/explorerlocators.json");

const widgetName = "phoneinputwidget";

describe("Phone input widget - ", () => {
  before(() => {
    cy.addDsl(dsl);
  });

  it("Add new dropdown widget", () => {
    cy.get(explorer.addWidget).click();
    cy.dragAndDropToCanvas(widgetName, { x: 300, y: 300 });
    cy.get(`.t--widget-${widgetName}`).should("exist");
    cy.dragAndDropToCanvas("textwidget", { x: 300, y: 500 });
    cy.openPropertyPane("textwidget");
    cy.updateCodeInput(
      ".t--property-control-text",
      `{{PhoneInput1.text}}:{{PhoneInput1.countryCode}}:{{PhoneInput1.dialCode}}`,
    );
  });

  it("should check for the format and dialCode", () => {
    cy.get(`.t--widget-${widgetName} input`).clear();
    cy.wait(300);
    cy.get(`.t--widget-${widgetName} input`).type("9999999999");
    cy.get(".t--widget-textwidget").should("contain", "(999) 999-9999:US:+1");

    cy.openPropertyPane(widgetName);
    cy.selectDropdownValue(
      ".t--property-control-defaultcountrycode",
      "Afghanistan (+93)",
    );
    cy.get(`.t--widget-${widgetName} input`).clear();
    cy.wait(300);
    cy.get(`.t--widget-${widgetName} input`).type("1111111111");
    cy.get(".t--widget-textwidget").should("contain", "1111111111:AF:+93");
    cy.get(".t--input-country-code-change").should("contain", "🇦🇫+93");

    cy.get(".t--property-control-allowcountrycodechange label")
      .last()
      .click({ force: true });
    cy.get(".t--input-country-code-change")
      .first()
      .click();
    cy.get(".t--search-input input").type("+91");
    cy.wait(500);
    cy.get(".t--dropdown-option")
      .last()
      .click();
    cy.get(`.t--widget-${widgetName} input`).clear();
    cy.wait(300);
    cy.get(`.t--widget-${widgetName} input`).type("9999999999");
    cy.get(".t--widget-textwidget").should("contain", "99999 99999:IN:+91");
    cy.get(".t--input-country-code-change").should("contain", "🇮🇳+91");
  });
});