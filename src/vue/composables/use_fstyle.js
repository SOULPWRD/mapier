// This is a composable binding between fstyle function and vuejs
// it returns a reactive ref object for the style classes

import {
    ref,
    readonly,
    watchEffect,
    onUnmounted,
} from "vue";
import fstyle from "../fstyle.js";

const context = fstyle.context();

function use_fstyle(styler) {
    const classes = ref([]);
    let handle;
   
    watchEffect(function watcher() {
        const requireable = styler();
        const new_handle = context.require(requireable);
        if (handle !== undefined) {
            handle.release();
        }
        classes.value = new_handle.classes;
        handle = new_handle;
    });
   
    onUnmounted(function () {
        handle.release();
    });
    
    return readonly(classes);
}

//demo import {h} from "https://esm.sh/vue"
//demo import run from "../demo.js";

//demo const color_styler = fstyle.css(function color({background_color}) {
//demo     return `
//demo        .[] {
//demo             width: 50px;
//demo             height: 50px;
//demo             background-color: ${background_color}
//demo          }
//demo     `;
//demo });

//demo function demo_component() {
//demo     function setup() {
//demo         const color_classes = use_fstyle(function () {
//demo             return color_styler({background_color: "green"});
//demo         });

//demo         return function render() {
//demo             return h("div", {
//demo                 class: color_classes.value
//demo             });
//demo         };
//demo     }

//demo     return Object.freeze({
//demo         setup
//demo     });
//demo }

//demo run(demo_component())




export default Object.freeze(use_fstyle);