import express from "express";
const app = express();
import cors from "cors";
import mjutrouter from "./routers/mjutrouter.js";
import ifzrouter from "./routers/ifzrouter.js";
import distilleryrouter from "./routers/distilleryrouter.js";
import neueweltrouter from "./routers/neueweltrouter.js";

const port = 5000;
app.use(cors());
app.use("/mjut", mjutrouter);
app.use("/ifz", ifzrouter);
app.use("/distillery", distilleryrouter);
app.use("/neuewelt", neueweltrouter);

app.listen(port, () => {
  console.log("server is listening hello world");
});
