class customAPIError extends Error{
    constructor(message, statusCode){
        super(message)

        this.isOperational =  true;
       // Error.captureStackTrace(this, this.constructor)
        //console.log(Error)
        this.statusCode = statusCode;
        this.status = `${this.statusCode}.startsWith('4') ? fail : 'error' `;
    }
    
}

module.exports = customAPIError