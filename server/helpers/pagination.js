module.exports = (objectPagination, query, countMovies) =>{
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    const totalPage = Math.ceil(countMovies / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;

    return objectPagination;
}