/*jslint
    browser
*/

/*property
    addEventListener, appendChild, body, center, click, createElement,
    createObjectURL, crossOrigin, download, drawImage, fillRect, getContext,
    getElementById, getImage, getTileCoord, height, hidden, href, innerHTML,
    join, layers, onerror, onload, parse, preventDefault, querySelector,
    removeChild, setTileLoadFunction, source, src, target, textContent,
    toDataURL, type, url, view, width, zoom
*/

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import create_html from "./html.js";

const tile_width = 256;
const tile_height = 256;

function save(filename, content, type) {
    const a = document.createElement("a");
    const blob = new Blob([content], {type});
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "";
    a.click();
    document.body.removeChild(a);
}

function init() {
    const save_button = document.getElementById("save");
    const core_script = document.querySelector(
        "script[data-id=\"core\"]"
    ).textContent;
    const store_data = document.querySelector(
        "script[data-id=\"store\"]"
    ).textContent;

    let tile_cache;

    try {
        tile_cache = JSON.parse(store_data);
    } catch (ignore) {
        tile_cache = {};
    }

    const view = new View({
        center: [0, 0],
        zoom: 2
    });
    const osm_source = new XYZ({
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    });
    const tile_layer = new TileLayer({source: osm_source});
    const map = new Map({
        layers: [tile_layer],
        target: "map",
        view
    });

    osm_source.setTileLoadFunction(function (tile, src) {
        const cache_key = `OSM_${tile.getTileCoord().join("_")}`;

        if (tile_cache[cache_key]) {
            tile.getImage().src = tile_cache[cache_key];
            return;
        }

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = `${tile_width}`;
            canvas.height = `${tile_height}`;
            ctx.drawImage(image, 0, 0);

            tile_cache[cache_key] = canvas.toDataURL("image/png");
            tile.getImage().src = src;
        };
        image.src = src;
        image.onerror = function (ignore) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = `${tile_width}`;
            canvas.height = `${tile_height}`;
            ctx.fillRect(0, 0, tile_width, tile_height);
            tile.getImage().src = canvas.toDataURL();
        };
    });


    save_button.addEventListener("click", function (e) {
        e.preventDefault();
        save(
            "mapier.html",
            create_html(core_script, tile_cache),
            "text/html"
        );
    });

    return map;
}

function load() {
    window.addEventListener("load", init);
}

load();