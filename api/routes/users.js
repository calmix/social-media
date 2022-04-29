const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// update user information
router.put("/:id", async(req, res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        
        try {
            // console.log(req.params.id);
            const user = await User.updateOne(
                {_id: req.params.id}, 
                {$set: req.body,});
            res.status(200).json("Account has been updated");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account");
    }
})

// delete a user
router.delete("/:id", async(req, res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            // console.log(req.params.id);
            const user = await User.deleteOne({_id: req.params.id});
            res.status(200).json("Account has been deleted");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account");
    }
})

// get user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try{
        const user = userId ? await User.findById(userId) : await User.findOne({username: username});
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch(err) {
        res.status(500).json(err);
    }
});

// get friends
router.get("/friends/:userId", async(req, res)=>{
    try {
        const user = await User.findById(req.params.userId);
        const freinds = await Promise.all(
            user.followins.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        freinds.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList);
    } catch(err) {
        res.status(500).json(err);
    }
})

// follow user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId}});
                await currentUser.updateOne({$push: {followins: req.params.id}});
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("You already followed this user");
            }
            
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
    
});


// unfollow user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId}});
                await currentUser.updateOne({$pull: {followins: req.params.id}});
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("You didn't follow this user");
            }
            
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot unfollow yourself");
    }
    
});


module.exports = router;