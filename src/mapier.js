// The main entry file for the build process

/*jslint browser */

import make_app from "./vue/app.js";
import ssr from "./vue/ssr.js";

function init(target) {
    const app = make_app();
    ssr.create_app(app).mount(target);
}

init("#app");