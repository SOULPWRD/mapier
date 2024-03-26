function create_html(script) {
    return [
        "<!DOCTYPE html>",
        "<html>",
        "<head>",
        "<title>Mapier.js</title>",
        "</head>",
        "<body>",
        "<div><button id=\"save\">Save me</button></div>",
        "<div id=\"map\" style=\"width: 100%; height: 400px\"></div>",
        "<div id=\"store\"><script data-id=\"store\"><\/script></div>",
        "<div id=\"core\">",
        "<script data-id='core'>",
        script,
        "<\/script>",
        "</div>",
        "</body>",
        "</html>"
    ].join("\n");
}

export default Object.freeze(create_html);