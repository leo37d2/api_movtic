const Food = require("../models/Food");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
//create a food

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newFood = new Food(req.body);
  try {
    const savedFood = await newFood.save();
    res.status(200).json(savedFood);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all food

router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update a food

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  console.log();
  try {
    const updateFood = await Food.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updateFood);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get a food
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a food

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(200).json("Đã xóa thành công");
  } catch (error) {}
});
module.exports = router;
