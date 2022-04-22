const Singer_actor = require("../models/Singer_actor");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
//create a singer or actor
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newSA = new Singer_actor(req.body);
  try {
    const savedSA = await newSA.save();
    res.status(200).json(savedSA);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get all SA
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const sas = await Singer_actor.find();
    res.status(200).json(sas);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get a sa
router.get("/:id", async (req, res) => {
  try {
    const sa = await Singer_actor.findById(req.params.id);
    res.status(200).json(sa);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete a sa
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Singer_actor.findByIdAndDelete(req.params.id);
    res.status(200).json("Đã xóa thành công!");
  } catch (error) {
    res.status(500).json(error);
  }
});

// update a sa
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateSA = await Singer_actor.findByIdAndUpdate(req.params.id, {
      $set: req.body,
      new:true
    });
    res.status(200).json(updateSA);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
