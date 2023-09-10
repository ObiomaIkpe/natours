const {badRequestError} =require('../errors/badRequestError');

exports.deleteOne = Model => async (req, res, next) => {

   const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc){
        throw new  badRequestError(`no ${Model} found`)
    }
           res.status(204).json({
           data: null
       })    
    }


