// The main entry file for the build process

/*jslint browser */

import make_app from "./components/app.js";
import ssr from "./components/ssr.js";

function init(target) {
    const app = make_app();
    ssr.create_app(app).mount(target);
}

init("#app");