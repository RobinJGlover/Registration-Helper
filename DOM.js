function _select(id) {
    return document.getElementById(id);
}

function create_div(parent, id, class_name) {
    let div = document.createElement('div');
    div.id = id;
    if (class_name === undefined) {
        div.className = id;
    } else {
        div.className = class_name;
    }
    parent.appendChild(div);
    return div;
}