import { Router } from "express";
const router = Router();

import {
  createIsbn,
  readAllIsbn,
  readIsbn,
  deleteIsbn,
  updateIsbn,
  readAllGenre,
} from "../controller/bookInfoController.js";

//create
router.post("/", createIsbn);
//read
router.get("/", readAllIsbn);

//readbyId
router.get("/:id", readIsbn);

//update
router.put("/:id", updateIsbn);

//delete
router.delete("/:id", deleteIsbn);

//readAllGenre
router.get("/genre/book", readAllGenre);

export default router;
