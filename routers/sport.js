const Sport = require("../models/Sport")

const router = require ("express").Router()
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
//create a sport
router.post("/", verifyTokenAndAdmin,async(req, res)=>{
    const newSport = new Sport(req.body)
    try{
        const savedSport = await newSport.save()
        res.status(200).json(savedSport)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//update sport
router.put("/:id",verifyTokenAndAdmin,async (req, res)=>{
    try{
        const updatedSport = await Sport.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new:true
            }
        );
        res.status(200).json(updatedSport)
    } catch (err) {
        res.status(500).json(err)
    }
})

// delete sport

router.delete("/:id",verifyTokenAndAdmin,async (req, res)=>{
    try{
        await Sport.findByIdAndDelete(req.params.id)
        res.status(200).json("Đã xóa thành công phim...!")
    } catch (err) {
        res.status(500).json(err)
    }
})

// search by name

router.get('/search',async (req, res)=>{
    console.log(req.query.q)
    const qSearch = new RegExp(req.query.q,'i')
    if (qSearch){
        try{
            let sport = await Sport.find({
                sport_name:qSearch
                
            })
            res.status(200).json(sport)
        } catch (err) {
            res.status(500).json(err)
        }
    }
})

// get sport

router.get("/find/:id",async (req, res)=>{
    try {
        const sport=await Sport.findById(req.params.id)
        res.status(200).json(sport)
    } catch (error) {
        res.status(500).json(error)
    }
})

// get all sport

router.get("/", async (req, res)=>{
    try {
        const sport = await Sport.find()
        res.status(200).json(sport)
    } catch (error) {
        res.status(500).json(error)
    }
})

       // filter one by one

    //filter by categorie
    const fCategories = (query)=>   Sport.find({
        categories:query
    })
// filter by date
    const fDate = (query)=>  Sport.find({
        date:{
            $in:[query]
        }
    })
// filter by city
    const fCity= (query)=>   Sport.find({
        city:{
            $in:[qCity]
        }
    })
// filter by state
    const fState = (query)=>   Sport.find({
        state:query
    })
// filter by categories & date
    const fGD = (query1,query2)=>  Sport.find({
        categories:query1,
        date:{
            $in:[query2]
        }
    })
// filter by categories & city
    const fGC = (query1,query2)=> Sport.find({
        categories:query1,
        city:{
            $in:[query2]
        }
    })
// filter by categories & state
    const fGS =(query1,query2)=>  Sport.find({
        categories:query1,
        state:query2
    })
// filter by date & city
    const fDC = (query1,query2)=>  Sport.find({
        date:{
            $in:[query1]
        },
        city:{
            $in:[query2]
        }
    })
// filter by  date & state
    const fDS= (query1,query2)=>  Sport.find({
        date:{
            $in:[query1]
        },
        state:query2
    })
// filter by city & state
    const fCS = (query1,query2)=>  Sport.find({
        city:{
            $in:[query1]
        },
        state:query2
    })
router.get("/filter", async (req, res)=>{
    const qCategories = req.query.categories
    const qDate = new Date (req.query.date)
    const qCity = req.query.city
    const qState = req.query.state
    try {
        let list
        if(qCategories && qDate) list= await fGD(qCategories,qDate)
        else if(qCategories&&qCity) list = await fGC(qCategories,qCity)
        else if(qCategories&&qState) list = await fGS(qCategories,qState)
        else if(qDate&&qCity) list = await fDC(qDate,qCity)
        else if(qDate&&qState) list = await fDS(qDate,qState)
        else if(qCity&&qState) list = await fCS(qCity,qState)
        else if(qCategories) list = await fGenre(qCategories)
        else if(qDate) list = await fDate(qDate)
        else if(qCity) list = await fCity(qCity)
        else if(qState)  list= await fState(qState)
        else list = await Sport.find()
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router