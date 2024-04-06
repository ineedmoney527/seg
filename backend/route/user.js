import { Router } from "express";
const router = Router();
import session from "express-session";
import {
  createUser,
  readUser,
  readContactById,
  deleteContact,
  deleteContacts,
  updateContact,
  updateLimit,
  authenticateToken,
  login,
  getLimit,
} from "../controller/contactController.js";

//create

router.get("/profile", (req, res) => {
  console.log(req.user);
  // Perform actions based on the logged-in user
  // ...
});
router.post("/login", login);
router.post("/", createUser);
//read
router.post("/:role_id", readUser);

router.get("/currentUser", authenticateToken, (req, res) => {
  // Assuming user data is stored in req.user after authentication
  const currentUser = req.user;
  res.json(currentUser);
});
//readbyId
router.get("/limit/:id", getLimit);
router.get("/:id", readContactById);

//update
router.put("/limit", updateLimit);
router.put("/:id", updateContact);

//delete
router.delete("/rows/:ids", deleteContacts);
//delete
router.delete("/:id", deleteContact);

//login

export default router;
