// An app instance

/*jslint browser */

import {h} from "vue";
import make_map from "./map.js";
import fstyle from "./fstyle.js";
import use_fstyle from "./composables/use_fstyle.js"

const base_styler = fstyle.css(function base() {
    return `
        body {
            margin: 0;
            padding: 0;
        }
    `;
});

function make_app() {
    function setup() {
        const base_classes = use_fstyle(() => base_styler());

        return function render() {
            return h("div", {
                class: base_classes.value
            }, [
                h(make_map())
            ]);
        };
    }

    return Object.freeze({
        setup
    });
}

//demo import run from "./demo.js";
//demo run(make_app());

export default Object.freeze(make_app);