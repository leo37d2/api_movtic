const Movie = require("../models/Movie");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

//create a movie
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newMovie = new Movie(req.body);
  try {
    const savedMovie = await newMovie.save();
    res.status(200).json(savedMovie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a movie
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          user_name: req.body.user_name,
          password: req.body.password,
          isUser: req.body.isUser,

        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a movie

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json("Đã xóa thành công phim...!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// search by name
router.get("/search", async (req, res) => {
  // query
  const qSearch = new RegExp(req.query.q.replace("+", " "), "i");

  // partion
  let perPage = 16;
  let page = req.query.page || 1;
  try {
    await Movie.aggregate([{
$match:{
  $or:[
    {
      name_vi:qSearch
    },
    {
      name_en:qSearch
    }
  ]
}
    },
      {
        $project: {
          language: 0,
          ticket_price: 0,
          date: 0,
          description: 0,
          singer_actor_id: 0,
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((error, movie) => {
        Movie.countDocuments((error, count) => {
          if (error) return res.status(401).json(error);
          res.header({
            "Page-size": Math.ceil(count / perPage),
            Current: page,
          });
          res.status(200).json(movie);
        });
      });
  } catch (error) {
    res.status(500).json(error);
  }
});
// search by name <search bar>
router.get("/searchbar", async (req, res) => {
  // query
  const qSearch = new RegExp(req.query.q.replace("+", " "), "i");

  // partion
  let perPage = 16;
  let page = req.query.page || 1;
  try {
    await Movie.aggregate([{
$match:{
  $or:[
    {
      name_vi:qSearch
    },
    {
      name_en:qSearch
    }
  ]
}
    },
      {
        $project: {
          language: 0,
          ticket_price: 0,
          date: 0,
          description: 0,
          singer_actor_id: 0,
        },
      },
    ]).sort({name_vi:-1}).limit(5)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((error, movie) => {
        Movie.countDocuments((error, count) => {
          if (error) return res.status(401).json(error);
          res.header({
            "Page-size": Math.ceil(count / perPage),
            Current: page,
          });
          res.status(200).json(movie);
        });
      });
  } catch (error) {
    res.status(500).json(error);
  }
});
// get a movie

router.get("/find/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all movie

router.get("/all", async (req, res) => {
  let perPage = 16;
  let page = req.query.page || 1;
  try {
    await Movie.aggregate([
      {
        $project: {
          language: 0,
          ticket_price: 0,
          date: 0,
          description: 0,
          singer_actor_id: 0,
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((error, movie) => {
        Movie.countDocuments((error, count) => {
          if (error) return res.status(401).json(error);

          res.header({
            "Page-size": Math.ceil(count / perPage),
            Current: page,
          });
          res.status(200).json(movie);
        });
      });
  } catch (error) {
    res.status(500).json(error);
  }
});



// filter v3
router.get("/filterv3", async (req, res) => {
  // query
  const queryCond = {};
  if (req.query.city) queryCond.city = new RegExp( req.query.city.replace("+", " "),"i");
  if (req.query.state) queryCond.state = new RegExp( req.query.state.replace("+", " "),"i");
  if (req.query.year) queryCond.year = Number(req.query.year);
  if (req.query.genre) queryCond.genre = new RegExp( req.query.genre.replace("+", " "),"i");
  console.log(queryCond);
  // partion
  let perPage = 16;
  let page = req.query.page || 1;
  try {
    await Movie.aggregate([
      {
        $match: queryCond
      },
      {
        $project: {
          language: 0,
          ticket_price: 0,
          date: 0,
          description: 0,
          singer_actor_id: 0,
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((error, movie) => {
        Movie.countDocuments((error, count) => {
          if (error) return res.status(401).json(error);

          res.header({
            "Page-size": Math.ceil(count / perPage),
            Current: page,
          });
          res.status(200).json(movie);
        });
      });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
