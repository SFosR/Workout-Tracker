const router = require("express").Router();
const Workout = require("../models/workout.js");

// get most recent workout
router.get("/api/workouts", (req, res) => {
    Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: "$exercises.duration"}
        }
    }])
    .then((db) => {
        res.json(db);
    })
    .catch((err) => {
        res.status(400).json(err);
    });
});

// get workout from an one week ago
router.get("/api/workouts/range", (req, res) => {
    Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: "$exercises.duration"}
        }
    }])
    .sort({day: -1}).limit(7)
    .then(db => {
        res.json(db);
    })
    .catch((err) => {
        res.status(400).json(err);
    });
});
 // add a workout
router.put("/api/workouts/:id", (req, res) => {
    Workout.findByIdAndUpdate(
        req.params.id,
        {$push: {exercises: req.body}},
        {new: true}
    )
    .then(db => {
        res.json(db);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json(err);
    });
});

// creates new workout

router.post("/api/workouts", ({body}, res) => {
    Workout.create(body)
        .then(db => {
            res.json(db);
            console.log(db);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

module.exports = router;