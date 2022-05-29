import { Router } from "express";
let router = Router();
import {
  getWeekendEventList,
  getAllWeekendEventList,
} from "../scraping/ifz.js";

router.get("/weekendeventlist", getWeekendEventList);
router.get("/allweekendeventlist", getAllWeekendEventList);

export default router;
