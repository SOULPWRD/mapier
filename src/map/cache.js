// chahe_tiles turns image urls into base64 strings
// and caches them into the provided chace object

/*jslint browser */

/*global Image */


function cache_tiles(tile_cache, tile_source, options = {}) {
    const {
        tile_format = "image/png",
        tile_height = 256,
        tile_width = 256
    } = options;

    tile_source.setTileLoadFunction(function (tile, src) {
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

            tile_cache[cache_key] = canvas.toDataURL(tile_format);
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

    return tile_source;
}