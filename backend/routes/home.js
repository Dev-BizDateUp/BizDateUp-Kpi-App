const express = require("express");
// const { route } = require("./createmployeeroute");
const router = express.Router();

router.get('/', async (req, res) => {
    return res.status(200).send('Hello world!')
})

module.exports = router;