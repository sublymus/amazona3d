import EventEmiter from '../../lib/event/eventEmiter.js'
class Anim extends EventEmiter {
    //TODO  analyse de 0
    #accu;
    #curentRun;
    #runnig;

    #status;
    #onPause = false;

    #eventsLoop = [];
    #methodEvent;

    #duration;
    #endRequire;
    #cursor;

    constructor(params) {
        super();
        if (typeof params != 'object') {
            params = {};
        }
        this.params = params;
        this.#methodEvent = {
            'start': 'onEnd',
            'startReverse': 'onStart',
            'toggle': 'onEnd onStart',
        }

        this.defautCursor = p => p;
        this.duration = this.params.duration;
        this.endRequire = this.params.endRequire;
        this.cursor = this.params.cursor;

        this.rest();
    }
    rest() {

        if (this.#curentRun != undefined) {
            this.#curentRun.stop();
            //this.#removeEventsLoop();
        }
        this.#runnig = false;
        this.pause(false);

        this.#accu = 0;
        this.#progress();
        this.#updateStatus("onStart");
    }
    get status() {
        return this.#status;
    }
    get duration() {
        return this.#duration;
    }
    set duration(v) {
        this.#duration = v ?? 1000;
    }
    get endRequire() {
        return this.#endRequire;
    }
    set endRequire(v) {
        this.#endRequire = v ?? false;
    }
    get cursor() {
        this.#cursor
    }
    set cursor(v) {
        this.#cursor = v instanceof Function ? (v(this.#accu / this.duration) instanceof Number ? v : this.defautCursor) : this.defautCursor;
    }

    #purgeLoopEvents() {
        if (this.#curentRun != undefined) {
            this.#curentRun.stop();
        }
        if (this.#eventsLoop.length > 0) {
            this.#eventsLoop.forEach((e, i) => {
                this.remove(e);
            });
        }
        this.#eventsLoop = [];
        //this.rest();
    }

    loop(v) {
        this.#purgeLoopEvents();
        if (typeof this.#methodEvent[v.method] != 'string') throw new Error("the loop methode <" + v.method + "> is not find");

        v.maxCycleCount = typeof v.maxCycleCount == 'number' ? parseInt(v.maxCycleCount) : Infinity;

        let count = 0;
        const listener = (p, e) => {
            count++;
            if (v.maxCycleCount != Infinity) {
                if (count >= v.maxCycleCount) {
                    this.#purgeLoopEvents();
                    return;
                }
            }
            this[v.method]('loop');
        }
        this.when(this.#methodEvent[v.method], listener, (uid) => {
            this.#eventsLoop.push({
                event: this.#methodEvent[v.method],
                uid
            });
        });
        this[v.method]('loop');
    }

    pause(pause) {
        if (typeof pause == 'boolean') {
            this.emit('pause', { befor: this.#onPause, after: pause });
            this.#onPause = pause
        }
        return this.#onPause;
    }

    #updateStatus(event) {
        if (event != this.#status) {
            this.#status = event;
            this.emit(event, this);
            this.emit("change", this);
        }

    }

    #progress() {
        this.emit("progress", this.#accu / this.duration);
    }

    start(loop) {

        if (this.endRequire && this.#runnig) {
            return this;
        }
        if (loop != 'loop') this.#purgeLoopEvents();
        this.#accu = 0;
        this.#progress();
        this.#updateStatus("onStart");
        this.#updateStatus("start");
        this.#updateStatus("normal");
        this.#run();
        return this;
    }

    startReverse(loop) {

        if (this.endRequire && this.#runnig) {
            return this;
        }
        if (loop != 'loop') this.#purgeLoopEvents();
        this.#accu = this.duration;
        this.#progress();
        this.#updateStatus("onEnd");
        this.#updateStatus("startReverse");
        this.#updateStatus("reverse");
        this.#run();
        return this;
    }

    toggle(option) {
        if (this.endRequire && this.#runnig) {
            return this;
        }
        if (option == "onEnd") {
            if (this.status == "reverse" || this.status == "onStart") {
                this.toggle();
            }
            return;
        } else if (option == "onStart") {
            if (this.status == "normal" || this.status == "onEnd") {
                 this.toggle();
            }
            return
        }
        if (this.#runnig) {
             if (this.pause()) this.pause(false);
            // if (option != 'loop') this.#purgeLoopEvents();
            if (this.status == "normal") {
                this.emit('toggle', { befor: 'normal', after: 'reverse' });
                this.#updateStatus("reverse");
            } else if (this.status == "reverse") {
                this.emit('toggle', { befor: 'reverse', after: 'normal' });
                this.#updateStatus("normal");
            }
        } else {
            if (this.status == "onStart") {
                this.emit('toggle', { befor: 'onStart', after: 'start' });
                this.start(option);
            } else if (this.status == "onEnd") {
                this.emit('toggle', { befor: 'onEnd', after: 'startReverse' });
                this.startReverse(option);
            }
        }
        return this;
    }

    #run() {
        if (this.#curentRun != undefined) {
            this.#curentRun.stop();
        }
        if (this.pause()) this.pause(false);

        let lastTime = 0;
        let pauseTime = 0;
        let allPauseTime = 0;
        let pauseCatched = false;
        let instantPause = 0;

        let newStatus;
        this.#runnig = true;
        let begin = true;
        const data = {
            stop: () => {
                this.#runnig = false;
                data.stopAction = true;
            },
            stopAction: false
        }
        this.#curentRun = data
        const anim = (time) => {
            if (data.stopAction) return;
            if (!this.#onPause) {
                if (pauseCatched) {
                    pauseCatched = false;
                    allPauseTime += pauseTime;
                }
                time = time - allPauseTime;
                if (begin) {
                    begin = false;
                    lastTime = time;
                }
                const interval = time - lastTime;
                lastTime = time;

                if (this.status == "normal") {
                    this.#accu += interval;
                } else if (this.status == "reverse") {
                    this.#accu -= interval;
                } else {
                    throw new Error(" Error in running < this.status = normal || reverse >")
                }

                if (this.#accu > this.duration) {
                    this.#accu = this.duration;
                    newStatus = "onEnd";
                    this.#runnig = false;
                }
                if (this.#accu < 0) {
                    this.#accu = 0;
                    newStatus = "onStart";
                    this.#runnig = false;
                }
                this.#progress();

            } else {
                if (!pauseCatched) {
                    instantPause = time;
                    pauseCatched = true;
                }
                pauseTime = time - instantPause;
            }

            if (this.#runnig) {
                requestAnimationFrame(anim);
            } else {
                this.#updateStatus(newStatus);
            }
        };
        requestAnimationFrame(anim);
    }
}

export default Anim;