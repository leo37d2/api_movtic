const Bill = require("../models/Bill");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//create a bill
router.post("/", verifyToken, async (req, res) => {
  const newBill = new Bill({
    user_id: req.body.user_id,
    type: req.body.type,
    product_id: req.body.product_id,
    price: req.body.price,
    ticket_quantity: req.body.ticket_quantity,
    seat: req.body.seat,
    food_id: req.body.food_id,
    food_quantity: req.body.food_quantity,
    total: req.body.price * req.body.ticket_quantity,
  });
  try {
    const savedBill = await newBill.save();
    res.status(200).json(savedBill);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get user bills
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const bills = await Bill.findById({ userId: req.params.userId });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all bills
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update a bill
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateBill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateBill);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete a bill
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.status(200).json("Đã xóa thành công");
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET MONTHLY INCOME

router.get("/income", async (req, res) => {
  const qMonth = Number(req.query.month);
  const qYear = Number(req.query.year);
  try {
    const income = await Bill.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          sales: "$total",
          type:"$type"
        },
      },
      {
        $match: {
          month:qMonth,
          year:qYear,
          type: req.query.type,
        },
      },
      {
        $group: {
          _id: "$month",
          totals: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
