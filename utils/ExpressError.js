class ExpressError extends Error {
    constructor(message,satatusCode){
        super();
        this.message = message;
        this.satatusCode = satatusCode;
    }
}


module.exports = ExpressError;
