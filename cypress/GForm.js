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
                this.type("input", question.answer.toString());
                break;
            case "date":
                this.fillDate(question.answer.toString());
                break;
            case "time":
                this.fillTime(question.answer.toString());
                break;
            case "paragraph":
                this.type("paragraph", question.answer.toString());
                break;
            case "checkbox":
                this.selectCheckbox(question.answer)
                break;
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

    selectCheckbox = (selected) => {
        selected.forEach(value => {
            this.selectRadio(value)
        })
    }

    fillTime = (input) => {
        if(input === "now"){
            input = String(new Date().getHours()).padStart(2, 0) + ":" + String(new Date().getMinutes()).padStart(2, 0)
        }
        const time = input.split(":");
        cy.get(this.selectors.time)
        .parent()
        .parent()
        .parent()
        .parent()
        .parent()
        .parent()
        .get('input')
        .each((child, i) => {
            cy.get(child).type(time[i])
        });
    };

    fillDate = (value) => {
        if(value === "now"){
            const today = new Date().getFullYear() + "-" + (parseInt(new Date().getMonth())+1) + "-" + new Date().getDate()
            this.type("input", today)
        }else{
            this.type("input", question.answer.toString())
        }
    }

    nextSection = () => {
        cy.get(this.selectors.buttons)
        .contains(/Next|Berikutnya|Kirim|Submit/g)
        .click();
    };
}