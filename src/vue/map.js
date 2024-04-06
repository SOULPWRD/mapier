import {h, ref, onMounted} from "https://esm.sh/vue";
import make_osm_map from "../map/osm.js";

function create_map() {
    function setup() {
        const map_ref = ref(null);

        onMounted(function () {
            const map = make_osm_map();
            map.setTarget(map_ref.value);
        });

        return function render() {
            return h("div", {
                ref: map_ref,
                style: {
                    width: "100%",
                    height: "400px"
                }
            })
        };
    }

    return Object.freeze({
        setup
    });
}

export default Object.freeze(create_map);


//demo import run from "./demo.js";
//demo run(create_map());