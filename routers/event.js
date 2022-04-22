const Event = require("../models/Event");

const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
//create a event
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newEvent = new Event(req.body);
  try {
    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a event
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete event

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json("Đã xóa thành công phim...!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// search by name

router.get("/search", async (req, res) => {
  const qSearch = new RegExp(req.query.q, "i");
  if (qSearch) {
    try {
      let event = await Event.find({
        event_name: qSearch,
      });
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// get a event

router.get("/find/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all sport

router.get("/", async (req, res) => {
  try {
    const event = await Event.find();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json(error);
  }
});

// filter one by one

//filter by categorie
const fCategories = (query) =>
  Event.find({
    categories: query,
  });
// filter by date
const fDate = (query) =>
  Event.find({
    date: {
      $in: [query],
    },
  });
// filter by city
const fCity = (query) =>
  Event.find({
    city: {
      $in: [qCity],
    },
  });
// filter by state
const fState = (query) =>
  Event.find({
    state: query,
  });
// filter by categories & date
const fGD = (query1, query2) =>
  Event.find({
    categories: query1,
    date: {
      $in: [query2],
    },
  });
// filter by categories & city
const fGC = (query1, query2) =>
  Event.find({
    categories: query1,
    city: {
      $in: [query2],
    },
  });
// filter by categories & state
const fGS = (query1, query2) =>
  Event.find({
    categories: query1,
    state: query2,
  });
// filter by date & city
const fDC = (query1, query2) =>
  Event.find({
    date: {
      $in: [query1],
    },
    city: {
      $in: [query2],
    },
  });
// filter by  date & state
const fDS = (query1, query2) =>
  Event.find({
    date: {
      $in: [query1],
    },
    state: query2,
  });
// filter by city & state
const fCS = (query1, query2) =>
  Event.find({
    city: {
      $in: [query1],
    },
    state: query2,
  });
router.get("/filter", async (req, res) => {
  const qCategories = req.query.categories;
  const qDate = new Date(req.query.date);
  const qCity = req.query.city;
  const qState = req.query.state;
  try {
    let list;
    if (qCategories && qDate) list = await fGD(qCategories, qDate);
    else if (qCategories && qCity) list = await fGC(qCategories, qCity);
    else if (qCategories && qState) list = await fGS(qCategories, qState);
    else if (qDate && qCity) list = await fDC(qDate, qCity);
    else if (qDate && qState) list = await fDS(qDate, qState);
    else if (qCity && qState) list = await fCS(qCity, qState);
    else if (qCategories) list = await fGenre(qCategories);
    else if (qDate) list = await fDate(qDate);
    else if (qCity) list = await fCity(qCity);
    else if (qState) list = await fState(qState);
    else list = await Event.find();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
