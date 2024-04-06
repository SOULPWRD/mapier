import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";

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
        })
    });
}

export default Object.freeze(make_osm_map);