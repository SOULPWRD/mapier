/*jslint node, browser*/

import pubsub_contructor from "./pubsub.js";

const events = {
    PROCESS_TASK: "process"
};

function queue(spec) {
    const pubsub = pubsub_contructor();
    const { concurrency } = spec;
    const tasks_queue = [];
    const running_tasks = new Set();

    // state properties
    let is_subscribed = false;
    let is_paused = false;

    // private methods
    function process_task() {
        const task = tasks_queue.shift();
        running_tasks.add(task);
        pubsub.emit(events.PROCESS_TASK, task);
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
            events.PROCESS_TASK,
            function (task) {
                listener(function (result_data, error) {
                    task.callback(result_data, error);
                    running_tasks.delete(task);

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

    function running_size() {
        return running_tasks.size;
    }

    function queue_size() {
        return tasks_queue.length;
    }


    return Object.freeze({
        push,
        queue_size,
        running_size,
        subscribe
    });
}

//demo const q = queue({concurrency: 1});
//demo function done(data, error) {}
//demo q.push(done, 1);
//demo q.push(done, 2);
//demo q.push(done, 3);
//demo q.subscribe(function (callback, data) {
//demo     setTimeout(function () {
//demo        document.body.innerHTML = data;
//demo        callback();
//demo     }, 1000);
//demo });

export default Object.freeze(queue);