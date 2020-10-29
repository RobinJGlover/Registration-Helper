class Question {
    constructor(question, choices) {
        this.question = question;
        this.choices = choices;
    }
}

class QuestionDisplay {
    constructor(parent, question) {
        this.question = question;
        this.container_div = create_div(parent, 'q-disp-container');
        this.question_div = create_div(this.container_div, 'q-disp-question d-flex justify-content-center');
        this.answer_holder_div = create_div(this.container_div, 'q-disp-answer-holder d-flex justify-content-center');
        this.answer_divs = [];
        for (let i = 0; i < this.question.choices.length; i++) {
            this.answer_divs.push(create_div(this.answer_holder_div, 'q-disp-answer btn btn-primary m-3'));
            this.answer_divs[i].addEventListener('click', () => {
                result = this.question.choices[i].on_choose();
                console.log(result);
                process();
            })

        }

        this.draw();
    }

    draw() {
        this.question_div.innerHTML = "<h7>" + this.question.question + "</h7>";
        for (let i = 0; i < this.question.choices.length; i++) {
            this.answer_divs[i].innerHTML = this.question.choices[i].label;
        }
    }
}

class Decision {
    constructor(label, on_choose) {
        this.label = label;
        this.on_choose = on_choose;
    }
}

const q_euro_anomaly_diagnosed = new Question(
    "Is the anomaly diagnosed?",
    [
        new Decision("Yes", () => q_euro_outcome_date),
        new Decision("No", () => {
            needs.confirmation = true;
            return q_euro_outcome_date;
        }),
    ]
);

const q_euro_outcome_date = new Question(
    "Is there a pregnancy outcome and delivery date?",
    [
        new Decision("Yes", () => null),
        new Decision("Pregnancy outcome only", () => {
            if (needs.confirmation) {
                return "Please provide confirmation of anomaly and date of delivery";
            }
            return "Please provide date of delivery.";
        }),
        new Decision("Date of delivery only", () => {
            if (needs.confirmation) {
                return "Please provide confirmation of anomaly and pregnancy outcome";
            }
            return "Please provide pregnancy outcome.";
        }),
        new Decision("No", () => {
            if (needs.confirmation) {
                return "Please provide confirmation of anomaly, pregnancy outcome and date of delivery."
            }
            return "Please provide pregnancy outcome and date of delivery.";
        })
    ]
)

const q_fasp_anomaly_diagnosed = new Question(
    "Is the anomaly diagnosed?",
    [
        new Decision("Yes", () => q_fasp_edd),
        new Decision("No", () => {
            needs.confirmation = true;
            console.log('need confirmation');
            return q_fasp_edd;
        })
    ]
)

const q_fasp_edd = new Question(
    "Do you have an EDD?",
    [
        new Decision("Yes", () => q_fasp_structural_or_trisomy),
        new Decision("No", () => {
            needs.edd = true;
            console.log('need EDD');
            return q_fasp_structural_or_trisomy;
        })
    ]
);

const q_fasp_structural_or_trisomy = new Question(
    "Is the FASP anomaly structural or a trisomy?",
    [
        new Decision("Structural", () => q_fasp_early_detection),
        new Decision("Trisomy (T13, T18 or T21)", () => console.log("Trisomy")),
    ]
);

const q_fasp_early_detection = new Question(
    "Do you have a scan detecting the anomaly before FA scan window?",
    [
        new Decision("Yes", () => {
            if(needs.confirmation) {
                if(needs.edd) {
                    return "Please provide EDD and confirmation of anomaly.";
                }
                return "Please provide confirmation of anomaly."
            }
            else if(needs.edd) {
                return "Please provide EDD.";
            }
             else {
                return null;
            }
        }),
        new Decision("No", () => q_fasp_fa_scan),
    ]
)

const q_fasp_fa_scan = new Question(
    "Do you have the FA / recall scan with correct views?",
    [
        new Decision("Yes", ()=>null),
        new Decision("No", ()=>{
            if(needs.confirmation) {
                if(needs.edd) {
                    return "Please provide EDD, FA scan and confirmation of anomaly."
                }
                return "Please provide FA scan and confirmation of anomaly.";
            }
            else if(needs.edd) {
                return "Please provide EDD and FA scan.";
            }
            else {
                return "Please provide FA scan.";
            }
        }),
        new Decision("Yes, but gestation >20+6", ()=>{
            if(needs.confirmation) {
                if(needs.edd){
                    return "Please provide booking date, EDD and confirmation of anomaly.";
                }
                return "Please provide booking date and confirmation of anomaly.";
            } else if(needs.edd) {
                return "Please provide booking date and EDD.";
            } else {
                return "Please provide booking date.";
            }
        }),
        new Decision("Yes, but anomaly seen antenatally after FA scan window", ()=> {
            if(needs.confirmation) {
                if(needs.edd) {
                    return "Please provide EDD, scan of first suspicion and confirmation of anomaly.";
                }
                return "Please provide scan of first suspicion and confirmation of anomaly.";
            } else if(needs.edd) {
                return "Please provide EDD and scan of first suspicion.";
            } else {
                "Please provide scan of first suspicion";
            }
        })
    ]
);

const TODO = new Question("Decision path incomplete");