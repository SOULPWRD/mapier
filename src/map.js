import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

function tile_osm() {
    return new Map({
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                })
            })
        ],
        target: "map",
        view: new View({
            center: [0, 0],
            zoom: 2
        })
    });
}

export default Object.freeze({
    tile_osm
});

