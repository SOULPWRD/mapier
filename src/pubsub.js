/*jslint node, browser*/

// Event emitter implementation

function pubsub_constructor() {
    let subscribers_pool = Object.create(null);
    const timers_pool = new Set();

    function emit(event, data) {
        if (subscribers_pool[event] === undefined) {
            // todo handle error
            throw new Error();
        }

        subscribers_pool[event].forEach(function (listener) {
            const timer_id = setTimeout(function () {
                try {
                    listener(data);
                } catch (err) {
                    throw err;
                }
            });

            timers_pool.add(timer_id);
        });
    }

    function subscribe(event, listener) {
        if (subscribers_pool[event] === undefined) {
            subscribers_pool[event] = new Set();
        }

        subscribers_pool[event].add(listener);

        return function unsubscribe () {
            subscribers_pool[event].delete(listener);
        };
    }

    function dispose() {
        timers_pool.forEach(function (timer_id) {
            clearTimeout(timer_id);
        });

        subscribers_pool = Object.create(null);
    }

    return Object.freeze({
        dispose,
        emit,
        subscribe
    });
}

//demo const pubsub = pubsub_constructor();

//demo pubsub.subscribe("show_text", function (text) {
//demo     document.body.innerHTML = "Hello " + text;
//demo });

//demo pubsub.emit("show_text","world");


export default Object.freeze(pubsub_constructor);