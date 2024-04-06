import run from "https://deno.land/x/replete@0.0.15/run.js";

run({
    browser_port: 3000,
    deno_args: ["--allow-all"],
    which_node: "node",
    command(message) {
        message.source = message.source.replaceAll(
            "//demo ",
            ""
        );
        return message;
    }
});