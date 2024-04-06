// An app instance

/*jslint browser */

import {h} from "https://esm.sh/vue";
import make_map from "./map.js";

function make_app() {
    function setup() {
        return function render() {
            return h("div", [
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