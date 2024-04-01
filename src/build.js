/* jslint node */

import {writeFile} from "node:fs";
import bunyan from "bunyan";
import generete_bundle from "./bundle.js";
import parseq from "./parseq.js";
import html from "./html.js";

const logger = bunyan.createLogger({name: "mapier:build"});

function write_html(output_file) {
    return function (callback, code) {
        writeFile(output_file, html(code), function (err) {
            if (err !== undefined) {
                return callback(undefined, err);
            }

            callback();
        });
    };
}

function build_html(input_file, output_file) {
    return parseq.sequence([
        generete_bundle(input_file),
        write_html(output_file)
    ]);
}

build_html(
    "./src/mapier.js",
    "./src/mapier.html"
)(function (ignore, error) {
    if (error) {
        logger.error({error}, "An error has occurred during build");
        return;
    }

    logger.info("The app has been succesfully build.");
});