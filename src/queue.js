/*jslint node, browser*/

import pubsub_contructor from "./pubsub.js";

const events = {
    process_task: "process_task",
    queue_drained: "queue_drained"
};

function queue(spec) {
    const { concurrency } = spec;
    const pubsub = pubsub_contructor();
    const tasks_queue = [];
    const running_tasks = new Set();

    // private state properties
    let is_subscribed = false;
    let is_paused = false;

    // private methods
    function process_task() {
        const task = tasks_queue.shift();
        running_tasks.add(task);
        pubsub.emit(events.process_task, task);
    }

    // public methods
    function push(callback, data) {
        const task = { callback, data };
        tasks_queue.push(task);

        if (is_subscribed === true
            && is_paused === false
            && running_tasks.size < concurrency
        ) {
            process_task();
        }
    }

    function pause() {
        //todo
    }

    function subscribe(listener) {
        // avoid registering listeners more than once
        if (is_subscribed === true) {
            return;
        }

        is_subscribed = true;

        const unsubscribe = pubsub.subscribe(
            events.process_task,
            function (task) {
                listener(function (result_data, error) {
                    task.callback(result_data, error);
                    running_tasks.delete(task);

                    if (tasks_queue.length === 0
                        && running_tasks.size === 0
                    ) {
                        pubsub.emit(events.queue_drained);
                    }

                    if (is_paused === false
                        && running_tasks.size < concurrency
                        && tasks_queue.length > 0
                    ) {
                        process_task();
                    }
                }, task.data);
            }
        );

        if (is_paused === false) {
            process_task();
        }

        return function dispose() {
            unsubscribe();
            is_paused = true;
            is_subscribed = false;
        };
    }

    function on_drain(callback) {
        pubsub.subscribe(events.queue_drained, callback);
    }

    function running_size() {
        return running_tasks.size;
    }

    function queue_size() {
        return tasks_queue.length;
    }

    return Object.freeze({
        on_drain,
        push,
        queue_size,
        running_size,
        subscribe
    });
}

//demo const q = queue({concurrency: 3});
//demo function done(data, error) {}
//demo q.push(done, 1);
//demo q.push(done, 2);
//demo q.push(done, 3);
//demo q.subscribe(function (callback, data) {
//demo     setTimeout(function () {
//demo        const paragraph = document.createElement("p")
//demo        paragraph.innerHTML = data;
//demo        document.body.appendChild(paragraph);
//demo        callback();
//demo     }, 1000);
//demo });
//demo q.on_drain(function () {
//demo     const paragraph = document.createElement("p")
//demo     paragraph.innerHTML = "drained";
//demo     document.body.appendChild(paragraph);
//demo });

export default Object.freeze(queue);