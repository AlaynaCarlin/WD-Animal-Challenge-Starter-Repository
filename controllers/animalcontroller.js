const express = require("express");
const router = express.Router();
const { Animal } = require("../models");
// const jwt = require("jsonwebtoken");
const validateJWT = require("../middleware/validate-session");


router.post("/create_animal", validateJWT, async (req, res) => {
    let { name, legNumber, predator } = req.body.user;
    try {
        const newAnimal = await Animal.create({
            name,
            legNumber,
            predator,
            owner: id
        });

        res.status(201).json({
            message: "animal object saved!",
        });
    } catch (err) {
        res.status(500).json({
            message: `failed so save animal. Error --> ${err}`
        });
    }
    // Animal.create({
    //     name: "dog",
    //     legNumber: 4,
    //     predator: true
    // })
});

router.get("/", validateJWT, async (req, res) => {
    try {
        const animals = await Animal.findAll();
        res.status(200).json(animals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete("/delete/:id", validateJWT, async (req, res) => {
    const animalId = req.params.id;

    try {
        const query = {
            where: {
                id: animalId
            }
        };
        await Animal.destroy(query);
        res.status(200).json({ message: "Animal Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put("/update/:id", validateJWT, async (req, res) => {
    const { name, legNumber, predator } = req.body;
    const animalId = req.params.id;
    // const userID = req.user.id;
    // console.log(animalId, userID);
    const query = {
        where: {
            id: animalId,
            // userID: userID
        }
    };

    const updateAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
    };

    try {
        const update = await Animal.update(updateAnimal, query);
        res.status(200).json(
            {
            message: "Animal successfully updated!",
            update: update
        }
        );
    } catch (err) {
        res.status(500).json({ error: err });
        console.log(err);
    }
});


module.exports = router;