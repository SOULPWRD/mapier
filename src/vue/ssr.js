// SSR utils
// create_app function creates an isomorphic instance that can be renderder
// on both - the server and client side
// render_html creates an html template for the app

/*jslint node, browser */

import {createSSRApp} from "vue";
import {renderToString} from "vue/server-renderer";

function create_app(app, props = {}) {
    return createSSRApp(app, props);
}

function render_html(app, props = {}) {
    return function (callback, code) {
        return renderToString(create_app(app, props)).then(function (content) {
            return callback(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Vue SSR Example</title>
                </head>
                <body>
                    <div id="app">${content}</div>
                    <script type="module">${code}</script>
                </body>
                </html>
            `);
        }).catch(function (error) {
            callback(undefined, error);
        });
    };
}

export default Object.freeze({
    create_app,
    render_html
});