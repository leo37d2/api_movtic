const User = require("../models/User");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
// // create a user
// router.post("/", async (req, res)=>{
//     const newUser = new User(req.body)
//     try {
//         const savedUser = await newUser.save()
//         res.status(200).json(savedUser)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

// get all user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// search a user by phone or email
router.get("/search", verifyTokenAndAdmin,async (req, res) => {
  const qSearch = new RegExp(req.query.q, "i");
  try {
    let user = await User.find({
      $or: [
        {
          phone: qSearch,
        },
        {
          email: qSearch,
        },
      ],
    }).sort({ user_name: -1 });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update a user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete a user
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Đã xóa thành công");
  } catch (error) {
    res.status(500).json(error);
  }
});

// get a user
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
