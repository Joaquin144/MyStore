/**
 * This class has 2 members: query: lambda function and queryString: object[the qeury portion of URL is treated as object not String]
 * lambda function will get mutated to apply filter/pagination/search and then be called by controller to get desired results.
 */
class ApiFeatures{
    constructor(query,queryStr){//query is Product.find() method and queryStr are req parameters. See previous branch for clarity.
        this.query = query;
        this.queryStr = queryStr;       
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"//small 'i' means case-insensitive
            }
        } : {};
        this.query = this.query.find({...keyword});//Product.find() = Product.find().find({...keyword})
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr}//this.queryStr is an object so it would create a shallow copy. To avoid that use spread operator[...] which creates deep copy

        ////console.log(queryCopy);
        //Removing some fields for category
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach((key)=>{
            delete queryCopy[key]
        });
        ////console.log(queryCopy);

        //Filter for price and rating [We need to take care of grater than and less than]
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)//one $ for String Interpolation and other for MongoDB syntax of < > <= >=
        ////console.log(queryStr);
        
        //Objective: return the modified Product.find() function that could be called by ProductController
        this.query = this.query.find(JSON.parse(queryStr));//Product.find() = Product.find().find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage){
        const currPage = Number(this.queryStr.page) || 1;//if page was not given in query then it will be set as 1
        const skip = (resultPerPage)*(currPage-1);//Simple Maths Nothing special
        this.query = this.query.limit(resultPerPage).skip(skip);//Product.find() = Product.find().limit(resultPerPage).skip(skip) --> Now don't get scared (+_+)
        return this;
    }
}

module.exports = ApiFeatures