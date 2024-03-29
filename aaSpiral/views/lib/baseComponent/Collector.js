class Collector {

    #table = [];

    constructor(...args) {
        this.#table = args;
    }

    add(value){
        this.#table.push(value);
    }
    
    collect(){
        return this.#table;
    }

}

export default Collector;


