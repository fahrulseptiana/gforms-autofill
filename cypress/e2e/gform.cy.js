import GForm from "../GForm";

describe("Google Forms Automation", () => {
  let gfa;
  const form = Cypress.env("FORM");
  const n = Cypress.env("N");

  before(() => {
    gfa = new GForm();
  });

  for (let i = 1; i <= n; i++) {
    it("Iteration " + i, () => {
      gfa.fillForm("forms/" + form);
    });
  }
});