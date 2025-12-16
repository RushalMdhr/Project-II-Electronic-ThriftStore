import express from "express";
import {
    createUser,
    getUser,
    switchRole
} from "../controllers/userControllers.js";

const router = express.Router();

router.route("/").post(createUser)
router.route("/login").post(getUser)
router.route("/switch/:name").post(switchRole)

export default router;