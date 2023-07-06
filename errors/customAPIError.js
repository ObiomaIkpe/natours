class customAPIError extends Error{
    constructor(message){
        super(message)

        this.isOperational =  true;
       // Error.captureStackTrace(this, this.constructor)
        //console.log(Error)
    }
    
}

module.exports = customAPIError