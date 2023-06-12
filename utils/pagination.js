const paginate = (query , pageNumber, pageLimit)=>{
    const page = parseInt(pageNumber);
    const limit = parseInt(pageLimit);
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);

}

module.exports = {paginate}