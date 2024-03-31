import { Router } from "express";
const router = Router();

import {
  createUser,
  readUser,
  readContactById,
  deleteContact,
  deleteContacts,
  updateContact,
  login,
} from "../controller/contactController.js";

//create
router.post("/login", login);
router.post("/", createUser);
//read
router.post("/:role_id", readUser);

//readbyId
router.get("/:id", readContactById);

//update
router.put("/:id", updateContact);
//delete
router.delete("/rows/:ids", deleteContacts);
//delete
router.delete("/:id", deleteContact);

//login

export default router;
