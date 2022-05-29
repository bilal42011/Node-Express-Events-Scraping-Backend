import { Router } from "express";
let router = Router();
import {
  getWeekendEventList,
  getAllWeekendEventList,
} from "../scraping/mjut.js";

router.get("/weekendeventlist", getWeekendEventList);
router.get("/allweekendeventlist", getAllWeekendEventList);

export default router;
