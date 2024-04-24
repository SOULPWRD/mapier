// A simple OSM constructor

/*jslint browser */

import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import {defaults} from "ol/control/defaults.js"

function make_osm_map(spec = {}) {
    const {
        center = [0, 0],
        zoom = 2
    } = spec;

    return new Map({
        layers: [
            new TileLayer({
                source: new OSM()
            })
        ],
        view: new View({
            center,
            zoom
        }),
        controls: defaults({
            attribution: false,
            rotate: false,
            rotateOptions: false,
            zoom: false,
            attributionOptions: false,
            zoomOptions: false
        })
    });
}

export default Object.freeze(make_osm_map);