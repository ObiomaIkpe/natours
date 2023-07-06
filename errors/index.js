const notFoundError =  require('./notFoundError')
const badRequestError =  require('./badRequestError');
const customAPIError = require('./customAPIError')
const unauthenticatedError = require('./unauthenticatedError')

module.exports = {
    notFoundError,
    badRequestError,
    customAPIError,
    unauthenticatedError
}