// Generate source code from a given file entry.

/*jslint node */

import {rollup} from "rollup";
import cjs from "@rollup/plugin-commonjs";
import node from "@rollup/plugin-node-resolve";
import parseq from "./parseq.js";

function make_bundle_object(options) {
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
                const [chunk] = output;
                const {code} = chunk;
                callback({bundle, code});
            }
        ).catch(function (err) {
            callback(undefined, err);
        });
    };
}

function close_bundle_object(callback, {
    bundle,
    code
}) {
    bundle.close().then(function () {
        callback(code);
    }).catch(function (err) {
        callback(undefined, err);
    });
}

function generate_bundle(entry_path) {
    return parseq.sequence([
        make_bundle_object({
            input: entry_path,
            plugins: [
                node({browser: true}),
                cjs()
            ]
        }),
        generate_output({
            format: "iife",
            name: "mapier"
        }),
        close_bundle_object
    ]);
}

export default Object.freeze(generate_bundle);