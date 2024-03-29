import UidGenerator from '../../lib/uidGenerator/uidGenerator.js'

class EventEmiter extends UidGenerator {
    #eventsManager = {};
    #constraints = null;
    constructor(constraints) {
        super();
        this.#constraints = constraints ?? {};
    }
    /**
    * 
    * @param {String} event the string of event that you want verify
    * @returns undefined
    */
    #avalaible(event) {
        if (this.#constraints?.events) {

            if (!this.#constraints.events.includes(event)) {

                throw new Error(`event : <<${event}>>  is not supported`);
            }
        }
        return true;
    }
    /**
     * @param {String} event  gff
     * @param {Function} listener  rdrdfg
     * @param {Boolean} onChange  dg
     * @returns dgfhhg
     */
    when(events, listener, changeRequired) {

        let uid = this.validatedUid(listener.uid) ? listener.uid : listener.uid=(changeRequired ? '#' : '') + this.generateUid();

        if (typeof events !== "string") throw new Error(" first param must be String value like :  when('click change focus' , listener)")
        if (typeof listener !== "function") throw new Error(" second param must be Function value like :  when('click change focus' , listener)")

        events.split(' ').forEach(event => {
            if (event == '') {
                return;
            }
            this.#avalaible(event);
            let eventData = this.#eventsManager[event];
            eventData = eventData ? eventData : this.#eventsManager[event] = { // first listen
                listeners: {},
                lastValue: undefined,
            };
            eventData.listeners[uid] = {
                listener: function (value, lastValue) { listener(value, { value, lastValue, event, uid, count: this.count }); },
                count: 0
            }
        });

        // if(typeof uidListerner == 'function') uidListerner(uid);

        return this;
    }
    /**
     * @param {String} event 
     * @param {Object} value 
     * @returns 
     */
    emit(events, value) {
        if (typeof events !== "string") return;

        events?.split(' ').forEach(event => {
            if (event == '') {
                return;
            }
            this.#avalaible(event);
            let eventData = this.#eventsManager[event];
            if (eventData == undefined) return;         // this event is not yet listened to
            if (value == undefined) value = eventData.lastValue;
            const changed = eventData.lastValue !== value;
            const listeners = eventData.listeners;     // event listener recovery
            for (const uid in listeners) {

                if ((uid.charAt(0) == '#') && !changed) continue;

                new Promise(resolve => {
                    resolve(listeners[uid].listener(value, eventData.lastValue));
                    listeners[uid].count = listeners[uid].count + 1;
                });
            }
            eventData.lastValue = value;
        });
    }


    // emiteAll(emiteRequired, events , value || undefined) {
    //     if (emiteRequired == undefined) {
    //         for (const event in this.#eventsManager) {
    //             this.emite(event);
    //         }
    //     } else if (emiteRequired) {
    //         events.split(' ').map(event => {
    //             console.log("event =='' :", event == '');
    //             if (event != '') this.emite(event);
    //         });
    //     } else {
    //         for (const event in this.#eventsManager) {
    //             if (events.includes(event)) continue;
    //             this.emite(event);
    //         }
    //     }

    // }

    /**
     * 
     * @param {String} event the string of event that you want remove : 'E1 E2 E2 E3'
     * @param {String} uid uid of event that you want remove
     * @returns listener removed or undifined if id or event is note define  
     */
    remove(e) {
        let listener;
        e.uid = e.uid ? e.uid : e.listener?.uid;
        
        e.event = e.event + (e.events ? ' ' + e.events : '');
        e.event.split(' ').forEach((event) => {
            //this.#avalaible(e.events);
            const eventData = this.#eventsManager[event];
            if (eventData == undefined) return;        // this event is not yet listened to
            const listeners = eventData.listeners;
            const listenerData = listeners[e.uid];
            if (listenerData == undefined) return;
            delete listeners[e.uid];
            listener = listenerData.listener;
        });
        return listener;
    }
    removeAllEventEmiterListerners() {

    }
}

export default EventEmiter;