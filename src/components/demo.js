// A helper function that bundles a simple logic for demoing components in WEBL

/*jslint browser */

import {createApp} from "vue";

function run(component, props = {}) {
    document.documentElement.innerHTML = "";
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    const div = document.createElement("div");
    document.body.append(div);
    createApp(component, props).mount(div);
}

export default Object.freeze(run);