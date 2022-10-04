const router = require("express").Router();
const makeNotesRoutes = require("./makeNotesRoutes");

router.use(makeNotesRoutes);

module.exports = router;