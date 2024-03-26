/*jslint
    node, devel
*/

/*property
    bundle, catch, close, code, format, generate, input, log, output, sequence,
    stringify, then
*/

import {writeFile} from "node:fs";
import {rollup} from "rollup";
import cjs from '@rollup/plugin-commonjs';
import node from '@rollup/plugin-node-resolve';
import parseq from "./parseq.js";
import html from "./html.js";

const input_options = {
    input: "src/mapier.js",
    plugins: [node({browser: true}), cjs()]
};

const output_options = {
    format: "iife",
    name: "mapier",
};

function tap(callback, value) {
    console.log(value)
    callback(value)
}

function create_bundle(options) {
    return function (callback) {
        rollup(options).then(
            (bundle) => callback(bundle)
        ).catch(
            (err) => callback(undefined, err)
        );
    };
}

function generate_output(options) {
    return function (callback, bundle) {
        bundle.generate(options).then(
            function ({output}) {
                const [{code}] = output;
                callback({bundle, code});
            }
        ).catch(
            (err) => callback(undefined, err)
        );
    };
}

function close_bundle(callback, {bundle, code}) {
    bundle.close().then(
        () => callback(code)
    ).catch(
        (err) => callback(undefined, err)
    );
}

function write_quine(callback, code) {
    const content = html(code);

    writeFile("./src/mapier.html", content, function (err) {
        if (err !== undefined) {
            return callback(undefined, err);
        }

        return callback(content);
    });
}

function log_result(value, reason) {
    if (reason) {
        console.log("An error has occured: ", JSON.stringify(reason));
        return;
    }

    console.log("File has been successfully generated\n");
    console.log(value);
}

parseq.sequence([
    create_bundle(input_options),
    generate_output(output_options),
    tap,
    close_bundle,
    write_quine
])(log_result);


