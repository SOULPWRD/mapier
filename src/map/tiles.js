/*jslint
    browser
*/

/*property
    PI, abs, bottom_tile, calculateExtent, calculate_extent,
    calculate_tile_urls, cos, floor, freeze, getSize, getView, height,
    left_tile, log, pow, push, right_tile, tan, toString, top_tile, total_tiles,
    width
*/

import {transformExtent} from "ol/proj";

const epsg_3857 = "EPSG:3857";
const epsg_4326 = "EPSG:4326";

function calculate_extent(map) {
    const size = map.getSize();
    const view = map.getView();

    return view.calculateExtent(size);
}

function lon_to_tile(lon, zoom) {
    return (
        Math.floor(
            (lon + 180) / 360 * Math.pow(2, zoom)
        )
    );
}

function lat_to_tile(lat, zoom) {
    return (
        Math.floor(
            (
                1 - Math.log(
                    (
                        Math.tan(lat * Math.PI / 180)
                    ) + (
                        1 / Math.cos(lat * Math.PI / 180)
                    )
                ) / Math.PI
            ) / 2 * Math.pow(2, zoom)
        )
    );
}

function calculate_tile_bounds(extent, zoom) {
    const wgs_extent = transformExtent(extent, epsg_3857, epsg_4326);
    const west_edge = wgs_extent[0];
    const south_edge = wgs_extent[1];
    const east_edge = wgs_extent[2];
    const north_edge = wgs_extent[3];

    const top_tile = lat_to_tile(north_edge, zoom);
    const left_tile = lon_to_tile(west_edge, zoom);
    const bottom_tile = lat_to_tile(south_edge, zoom);
    const right_tile = lon_to_tile(east_edge, zoom);
    const width = Math.abs(left_tile - right_tile) + 1;
    const height = Math.abs(top_tile - bottom_tile) + 1;
    const total_tiles = width * height;

    return Object.freeze({
        bottom_tile,
        height,
        left_tile,
        right_tile,
        top_tile,
        total_tiles,
        width
    });
}

function calculate_tile_urls(url_base, extent, zoom) {
    const {
        bottom_tile,
        left_tile,
        right_tile,
        top_tile
    } = calculate_tile_bounds(extent, zoom);
    const urls = [];
    let x;
    let y;

    for (y = top_tile; y <= bottom_tile; y += 1) {
        for (x = left_tile; x <= right_tile; x += 1) {
            urls.push(
                new URL(`/${zoom}/${x}/${y}.png`, url_base).toString()
            );
        }
    }

    return urls;
}

export default Object.freeze({
    calculate_extent,
    calculate_tile_urls
});