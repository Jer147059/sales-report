// Routing
const router = require("express").Router();

// receieve model
let Sales = require("../models/sales");

// API: /sales/{query}

// get all sales from DB sort by date(new to old), but only limited number(perPage) of sales
// i.e.: /sales?page=1&perPage=20
// reason: number of document is too big, better limit the response number
router.route('/').get((req, res) => {
    let page = req.query.page
    let perPage = req.query.perPage
    
    if(+page && +perPage){
        Sales.find().sort({ saleDate: -1 }).skip((page - 1) * perPage).limit(perPage).exec()
            .then( sales => res.json(sales) )
            .catch( err => res.status(400).json(`error: ${err}`) );
    }else{
        res.status(400).json("error: page and perPage query parameters must be valid numbers");
    }
});

// get sales by id
// i.e.: /sales/id/5bd761deae323e45a93cdcb3
router.route('/id/:_id').get((req, res) => {
    Sales.findOne({_id: req.params._id})
        .then( sales => res.json(sales) )
        .catch( err => res.status(400).json(`error: ${err}`) );
})

// get sales in a specific date range, optionally, recieve location, or item name, or customer as query
// i.e.: /sales/record?fromDate=2017-04-01&toDate=2017-05-30&location=New York&item=laptop
// from 2017/4/1 to 2017/5/30, location in New York, item includes laptop
router.route('/record').get((req, res) => {

    let query = { saleDate:{ $gte: new Date(req.query.fromDate), $lte: new Date(req.query.toDate)} }

    if(req.query.location){
        query.storeLocation = req.query.location
    }

    if (req.query.item) {
        query.items = { $elemMatch: { name: req.query.item } };
    }

    Sales.find(query)
        .then( sales => res.json(sales) ) 
        .catch( err => res.status(400).json(`error: ${err}`) )

})

// update the given id's sales data
// i.e.: sales/id/5bd761deae323e45a93cdcb3
router.route('/id/:_id').put((req, res) => {
    Sales.updateOne({_id:  req.params._id}, { $set: req.body })
        .then( () => res.status(201).json("Update sales record") ) 
        .catch( err => res.status(400).json(`error: ${err}`) )
})

// delete the given id's sales data
// i.e.: sales/id/5bd761deae323e45a93cdcb3
router.route('/id/:_id').delete((req, res) => {
    Sales.deleteOne({_id:  req.params._id})
        .then( () => res.status(201).json("DELETE sales record") ) 
        .catch( err => res.status(400).json(`error: ${err}`) )
})

// add a new sales document to collection of MongoDB
// i.e.: sales/id/5bd761deae323e45a93cdcb3
router.route('/').post((req, res) => {
    const newSales = new Sales(req.body)
    newSales.save()
        .then( () => res.status(201).json("ADD sales record"))
        .catch( err => res.status(400).json(`error: ${err}`) )
})

module.exports = router;