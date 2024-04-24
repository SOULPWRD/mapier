/* jslint node */

import {writeFile} from "node:fs";
import {build} from "vite";
import bunyan from "bunyan";
import cjs from "@rollup/plugin-commonjs";
import node from "@rollup/plugin-node-resolve";
import parseq from "./parseq.js";
import ssr from "./components/ssr.js";
import make_app from "./components/app.js";

const logger = bunyan.createLogger({name: "mapier:build"});

function generate_bundle(input_file) {
    return function (callback) {
        return build({
            build: {
                rollupOptions: {
                    input: input_file,
                    output: {
                        format: "iife",
                        name: "mapier"
                    },
                    plugins: [
                        cjs(),
                        node()
                    ]
                },
                write: false
            }
        }).then(function ({output}) {
            callback(output[0].code);
        }).catch(function (err) {
            callback(undefined, err);
        });
    };
}

function write_html(output_file) {
    return function (callback, html) {
        writeFile(output_file, html, function (err) {
            if (err !== undefined) {
                return callback(undefined, err);
            }

            callback();
        });
    };
}

function build_html(input_file, output_file) {
    return parseq.sequence([
        generate_bundle(input_file),
        ssr.render_html(make_app()),
        write_html(output_file)
    ]);
}

build_html(
    "./src/mapier.js",
    "./src/mapier.html"
)(function (ignore, error) {
    if (error) {
        logger.error({error}, "An error has occurred during build.");
        return;
    }

    logger.info("The app has been succesfully built.");
});