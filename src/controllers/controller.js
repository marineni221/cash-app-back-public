class Controller {

    /**
     * 
     * @param {Object<{
    *  response: Response,
    *  data: Array,
    *  message: string,
    *  statusCode: number
    * 
    * }>} successResponseParam 
    */

    static successResponse({response, data, message = "", statusCode = 200}) {
        response.status(statusCode).json({data, message, success: true});
    }

    /**
     * 
     * @param {Object<{
     *  response: Response,
     * data: Array,
     * errors: Array | string,
     * statusCode: number
     * 
     * }>} errorResponseParam 
     */

    static errorResponse({response, data, errors = [], statusCode = 500}) {
        response.status(statusCode).json({data, errors, success: false});
    }
}

module.exports = Controller;