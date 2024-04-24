/*jslint node unordered*/

import run from "https://deno.land/x/replete@0.0.17/run.js";
import node_resolve from "https://deno.land/x/replete@0.0.17/node_resolve.js";
import ecomcon from "./ecomcon.js";

function custom_locate(specifier, parent_locator) {

// Fully qualified specifiers, such as HTTP URLs or absolute paths, are left for
// the runtime to resolve.

    if (/^\w+:/.test(specifier)) {
        return Promise.resolve(specifier);
    }

// Relative paths are simply adjoined to the parent module's locator.

    if (specifier.startsWith(".") || specifier.startsWith("/")) {
        return Promise.resolve(new URL(specifier, parent_locator).href);
    }

// The default Vuejs module export points to the nodejs bundle
// That means we need to map the resolve path from nodejs to browser runtime file
    if (/^vue/.test(specifier) && /^vue\/server-renderer/.test(specifier) === false) {
        specifier = "vue/dist/vue.runtime.esm-browser.js";
    }

// Any other specifier is assumed to designate a file in some "node_modules"
// directory reachable by the parent module.

// Deno does not expose its machinery for searching "node_modules".
// Node.js does, via 'import.meta.resolve', but in Node.js v20 this function
// became synchronous and thus a performance hazard.

// So, we do it the hard way.

    return node_resolve(specifier, parent_locator);
}

run({
    browser_port: 3000,
    which_node: "node",
    locate: custom_locate,
    command(message) {
        message.source = ecomcon(message.source, ["demo"])
        return message;
    }
});