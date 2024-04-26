/*jslint */

// A tool button is a type of the capbability button that enables the interaction with the map

import {h} from "vue";
import fstyle from "../fstyle.js";
import use_fstyle from "../composables/use_fstyle.js";
import icons from "../icons/icons.js";

const props = [
    "is_expandable",
    "is_active",
    "type"
];

const button_styler = fstyle.css(function tool({
    is_active = false
}) {
    const active_color = "rgba(242, 129, 155, 1)";
    const background_color = (
        is_active
        ? active_color
        : "rgba(19, 60, 62, 1)"
    );

    const background_color_hover = (
        is_active
        ? active_color
        : "rgba(26, 82, 85, 1)"
    );

    return `
        .[] {
            color: white;
            background-color: ${background_color};
            height: 36px;
            width: 36px;
            border: 0;
            padding: 8px;
            border-radius: 4px;
            text-align: center;
        }
        .[]:hover {
            background-color: ${background_color_hover};
            cursor: pointer;
        }
    `;
});

function setup(props, {emit}) {
    const {
        is_active,
        is_expandable,
        type
    } = props;

    const button_classes = use_fstyle(() => button_styler({
        is_active
    }));
    const icon_component = icons[type];

    function handle_button_click() {
        emit("tool:clicked", type);
    }

    function render_buttons() {
        return [
            h(
                "button",
                {
                    class: button_classes.value,
                    onClick: handle_button_click
                },
                [
                    h(icon_component, {stroke: "white"})
                ]
            ),
            (
                is_expandable
                ? h("button")
                : []
            )
        ];
    }

    function render() {
        return h(
            "div",
            render_buttons()
        );
    }

    return render;
}

//demo import run from "../demo.js";
//demo import pin_icon from "../icons/pin.js";

//demo run(function render() {
//demo     return h({
//demo             props,
//demo             setup
//demo         },
//demo         {is_active: false, is_expandable: false, type: "pin"}
//demo     );
//demo });

export default Object.freeze({
    props,
    setup
});