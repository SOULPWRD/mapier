/*jslint */

// Mapier's header. It displays several functionalities.

import {h} from "vue";
import fstyle from "../fstyle.js";
import use_fstyle from "../composables/use_fstyle.js";

const header_styler = fstyle.css(function header() {
    return `
        .[] {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            position: absolute;
            width: 100%;
            height: 48px;
            z-index: 1;
            background-color: red;
        }
    `;
});

function header_component(ignore, {slots}) {
    const header_classes = use_fstyle(() => header_styler());

    function render() {
        return h(
            "div",
            {class: header_classes.value},
            slots
        );
    }

    return render;
}

//demo import run from "../demo.js";
//demo run({setup: header_component});

export default Object.freeze({
    setup: header_component
});