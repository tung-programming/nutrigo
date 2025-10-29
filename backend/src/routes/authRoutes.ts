import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticateUser, (req: any, res) => {
  res.json({ message: "Protected route accessed!", user: req.user });
});
export default router;
