export default class GForm {
    constructor() {
        cy.fixture("selectors").then((selectors) => {
            this.selectors = selectors;
        });
    }

    fillForm = (fixture) => {
        cy.fixture(fixture).then((form) => {
            cy.visit(form.url);
            form.questions.forEach((question) => {
                cy.contains(question.title)
                .parent()
                .parent()
                .parent()
                .next()
                .within(() => {
                    this.fillQuestion(question);
                });
                if (question.sectionEnd) {
                this.nextSection();
                cy.wait(100);
                } else if (question.formEnd) {
                this.nextSection();
                }
            });
        });
    };

    fillQuestion = (question) => {
        switch (question.type) {
            case "shortAnswer":
            case "date":
                this.type("input", question.answer.toString());
                break;
            case "paragraph":
                this.type("paragraph", question.answer.toString());
                break;
            case "checkbox":
            case "multipleChoice":
                this.selectRadio(question.answer.toString())
                break;
            case "dropdown":
                this.selectOption(question.answer.toString())
        }
    };

    type = (type, value) => {
        cy.get(this.selectors[type]).type(value);
    };

    selectOption = (value) => {
        const el = cy.get('div')
        .parent()
        
        el.eq(1)
        .click()
        cy.wait(100)
        el.children().eq(1).contains(value).parent().click()
    }

    selectRadio = (value) => {
        cy.get('div')
        .parent()
        .contains(value).parent().click()
    }

    nextSection = () => {
        cy.get(this.selectors.buttons)
        .contains(/Next|Berikutnya|Kirim|Submit/g)
        .click();
    };
}