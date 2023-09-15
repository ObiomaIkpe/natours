const customAPIError =require('../errors/customAPIError');

exports.deleteOne = Model => async (req, res, next) => {

   const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc){
        throw new  customAPIError(`no ${Model} found`, 404)
    }
           res.status(204).json({
           data: null
       })    
}


