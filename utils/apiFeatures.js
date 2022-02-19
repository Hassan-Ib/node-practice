module.exports = class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }
  filter() {
    //COMMON PRACTICE OF querying with bool with exp from req
    // /tours?key[gte|gt|lte|lt]=value&price=200 => {key : {gte : value}, price : 200}
    //BUILDING BASIC QUERY WITHOUT THE SPECIAL FIELDS
    // const queryObj = { ...req.query }; //shallow copy
    // console.log("obj query from req ",queryObj);
    // const excludeQuery = ['page', 'limit', 'sort', 'fields']; // query fileds to be on the look out for
    // excludeQuery.forEach((el) => delete queryObj[el]);
    // let queryStr = JSON.stringify(queryObj);

    // MUTATING QUERY
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // get query from db;
    // let query = Tours.find(JSON.parse(queryStr));
    const queryObj = { ...this.queryObj }; //shallow copy
    console.log('obj query from req ', queryObj);
    const excludeQuery = ['page', 'limit', 'sort', 'fields']; // query fileds to be on the look out for
    excludeQuery.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    // MUTATING QUERY
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // get query from db;
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      // get field/fields to sort with e.g price,-rating => ["price", "-rating"] "price -rating"
      let sortQuery = this.queryObj.sort.split(',').join(' ');
      //check if it is ascending or descending ordder
      console.log(sortQuery);
      this.query = this.query.sort(sortQuery);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitfields() {
    if (this.queryObj.fields) {
      const fieldsQuery = this.queryObj.fields.split(',').join(' ');
      console.log('fields query = ', fieldsQuery);
      this.query = this.query.select(fieldsQuery);
    }
    return this;
  }

  paginate() {
    let { limit, page } = this.queryObj;
    page = Number(page) || 1;
    limit = Number(limit) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
};
