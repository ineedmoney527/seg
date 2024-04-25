import { Router } from "express";
const router = Router();

import {
  createIsbn,
  readAllIsbn,
  readIsbn,
  readAllGenre,
  deleteIsbn,
  updateIsbn,
} from "../controller/bookInfoController.js";

//create
router.post("/", createIsbn);
//read
router.get("/", readAllIsbn);
router.get("/genre/book", readAllGenre);
//readbyId
router.get("/:id", readIsbn);

//update
router.put("/:id", updateIsbn);

//delete
router.delete("/:id", deleteIsbn);

//readAllGenre

export default router;
