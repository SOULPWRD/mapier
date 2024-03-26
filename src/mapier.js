/*jslint
    browser
*/

/*property
    addEventListener, appendChild, body, click, createElement, createObjectURL,
    download, freeze, getElementById, hidden, href, innerHTML, preventDefault,
    querySelector, type
*/

import create_html from "./html.js";
import map from "./map.js";

function save(filename, content, type) {
    const a = document.createElement("a");
    const blob = new Blob([content], {type});
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "";
    a.click();
    document.body.removeChild(a);
}

function init() {
    const button = document.getElementById("save");
    const core_script = document.querySelector("script[data-id=\"core\"]").textContent;

    button.addEventListener("click", function (e) {
        e.preventDefault();
        save("mapier.html", create_html(core_script), "text/html");
    });

    map.tile_osm();
}

function load() {
    window.addEventListener("load", init);
}

load();