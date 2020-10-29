let needs = {
    confirmation: false,
    edd: false,
}


let q_disp_holder, result;

window.onload = () => {
    q_disp_holder = _select('q-disp-holder');
    reset();
}

function process() {
    q_disp_holder.innerHTML = '';
    let q_disp;
    if (result instanceof Question) {
        q_disp = new QuestionDisplay(q_disp_holder, result);
    } else if(typeof(result) === 'string') {
        end_of_decision_tree(true);
        _select('search-action-result').innerHTML = result;
    } else if(result === null) {
        _select('search-action-result-holder').innerHTML = "No search action required.";
        end_of_decision_tree(false); 
    }
}

function end_of_decision_tree(with_result) {
    if (with_result) {
        _select('copy-button').style.display = 'block';
    }
    _select('main-result-holder').style.display = 'flex';
    _select('reset-button').style.display = 'block';
    q_disp_holder.style.display = "none";
}

function reset() {
    result = new Question(
        "Is is a FASP or EUROCAT case?",
        [
            new Decision("FASP", () => q_fasp_anomaly_diagnosed),
            new Decision("EUROCAT", () => {
                return q_euro_anomaly_diagnosed
            })
        ]
    )

        for(let n in needs) {
            needs[n] = false;
        }

    _select('main-result-holder').style.display = 'none';
    _select('copy-button').style.display = 'none';
    _select('reset-button').style.display = 'none';

    q_disp_holder.style.display = "block";

    _select('search-action-result-holder').innerHTML = "Your search action is: <span class='text-primary ml-2' id='search-action-result'></span>";
    process();
}

function to_clipboard() {
    let s = _select('search-action-result').innerHTML;
    textToClipboard(s);
    alert('Copied action to clipboard.');
}

function textToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}