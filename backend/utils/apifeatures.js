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
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr}//this.queryStr is an object so it would create a shallow copy. To avoid that use spread operator[...] which creates deep copy

        console.log(queryCopy);
        //Removing some fields for category
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach((key)=>{
            delete queryCopy[key]
        });
        console.log(queryCopy);

        //Filter for price and rating [We need to take care of grater than and less than]
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)//one $ for String Interpolation and other for MongoDB syntax of < > <= >=
        console.log(queryStr);
        
        //Objective: return the modified Product.find() function that could be called by ProductController
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
}

module.exports = ApiFeatures