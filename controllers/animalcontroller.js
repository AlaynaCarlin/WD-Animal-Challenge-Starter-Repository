const express = require("express");
const router = express.Router();
const { Animal } = require("../models");


router.post("/create_animal", async (req, res) => {
    let { name, legNumber, predator } = req.body.user;
    try {
        const newAnimal = await Animal.create({
            name,
            legNumber,
            predator
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

router.get("/", async (req, res) => {
    try {
        const animals = await Animal.findAll();
        res.status(200).json(animals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const animalId = req.params.id;

    try {
        const query = {
            where: {
                id: animalId
            }
        };
        await Animal.destroy(query);
        res.status(200).json({ message: "Animal Removed"});
    } catch (err) {
        res.status(500).json({ error: err});
    }
});


module.exports = router;