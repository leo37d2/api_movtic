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
  console.log(req.query.q);
  const qSearch = new RegExp(req.query.q, "i");
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

router.get("/", async (req, res) => {
  try {
    const movie = await Movie.find();
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

// filter one by one

//filter by genre
const fGenre = (query) =>
  Movie.find({
    genre: {
      $in: [query],
    },
  });
// filter by date
const fDate = (query) =>
  Movie.find({
    date: {
      $in: [query],
    },
  });
// filter by city
const fCity = (query) =>
  Movie.find({
    city: {
      $in: [qCity],
    },
  });
// filter by state
const fState = (query) =>
  Movie.find({
    state: query,
  });
// filter by genre & date
const fGD = (query1, query2) =>
  Movie.find({
    genre: {
      $in: [query1],
    },
    date: {
      $in: [query2],
    },
  });
// filter by genre & city
const fGC = (query1, query2) =>
  Movie.find({
    genre: {
      $in: [query1],
    },
    city: {
      $in: [query2],
    },
  });
// filter by genre & state
const fGS = (query1, query2) =>
  Movie.find({
    genre: {
      $in: [query1],
    },
    state: query2,
  });
// filter by date & city
const fDC = (query1, query2) =>
  Movie.find({
    date: {
      $in: [query1],
    },
    city: {
      $in: [query2],
    },
  });
// filter by  date & state
const fDS = (query1, query2) =>
  Movie.find({
    date: {
      $in: [query1],
    },
    state: query2,
  });
// filter by city & state
const fCS = (query1, query2) =>
  Movie.find({
    city: {
      $in: [query1],
    },
    state: query2,
  });
router.get("/filter", async (req, res) => {
  const qGenre = req.query.genre;
  const qDate = new Date(req.query.date);
  const qCity = req.query.city;
  const qState = req.query.state;
  try {
    let list;
    if (qGenre && qDate) list = await fGD(qGenre, qDate);
    else if (qGenre && qCity) list = await fGC(qGenre, qCity);
    else if (qGenre && qState) list = await fGS(qGenre, qState);
    else if (qDate && qCity) list = await fDC(qDate, qCity);
    else if (qDate && qState) list = await fDS(qDate, qState);
    else if (qCity && qState) list = await fCS(qCity, qState);
    else if (qGenre) list = await fGenre(qGenre);
    else if (qDate) list = await fDate(qDate);
    else if (qCity) list = await fCity(qCity);
    else if (qState) list = await fState(qState);
    else list = await Movie.find();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
