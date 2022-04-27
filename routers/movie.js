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
        $set: req.body,
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
  const qSearch = new RegExp(req.query.q.replace("+", " "), "i");
  console.log(qSearch);
  if (qSearch) {
    try {
      let movie = await Movie.find({
        $or: [
          {
            name_vi: qSearch,
          },
          {
            name_en: qSearch,
          },
        ],
      }).sort({ movie_name: -1, date: -1 });
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
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
            "Current": page,
          });
          res.status(200).json(movie);
        });
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

// filter
router.get("/filter", async (req, res) => {
  const filter = req.query;
  const movie = await Movie.find();

  try {
    const list = movie.filter(function (item) {
      for (var key in filter) {
        if (item[key] === undefined || item[key] != filter[key]) return false;
      }
      return true;
    });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

// filter v2
router.get("/filterv2", async (req, res)=>{
  const queryCond={}
  if(req.query.city)
    queryCond.city=req.query.city.replace("+"," ")
  if(req.query.state)
    queryCond.state=req.query.state.replace("+", " ")
    if(req.query.year)
      queryCond.year=req.query.year
    if(req.query.genre)
      queryCond.genre=req.query.genre
  try {
    const movie = await Movie.find(queryCond)
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})
module.exports = router;
