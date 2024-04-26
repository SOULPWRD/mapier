/*jslint */

// A pin icon 

import { h } from "vue";

const props = [
    "fill",
    "stroke"
];

function setup(props = {}) {
    const {
        stroke = "#000000",
        fill = "none"
    } = props;

    function render() {
        return h("svg", {
            viewBox: "0 0 24 24",
            fill,
            xmlns: "http://www.w3.org/2000/svg"
        }, [
            h("g", [
                h("rect", { width: "24", height: "24", fill }),
                h("path", {
                    d: "M18 9C18 13.7462 14.2456 18.4924 12.6765 20.2688C12.3109 20.6827 11.6891 20.6827 11.3235 20.2688C9.75444 18.4924 6 13.7462 6 9C6 7 7.5 3 12 3C16.5 3 18 7 18 9Z",
                    stroke,
                    "stroke-linejoin": "round"
                }),
                h("circle", { cx: "12", cy: "9", r: "2", stroke, "stroke-linejoin": "round" })
            ])
        ]);
    }

    return render;
}

//demo import run from "../demo.js";
//demo run({ setup, props });

export default Object.freeze({
    props,
    setup
});