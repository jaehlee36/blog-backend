require("dotenv").config();
import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import mongoose from "mongoose";
import api from "./api";
import jwtMiddleware from "./lib/jwtMiddleware";

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((e) => {
    console.log(`에러 : ${e}`);
  });

const app = new Koa();
const router = new Router();

// router.get("/", (ctx) => {
//   ctx.body = "홈";
// });
// router.get("/about/:name?", (ctx) => {
//   const { name } = ctx.params;
//   ctx.body = name ? `${name}의 소개` : "소개";
// });
// router.get("/posts", (ctx) => {
//   const { id } = ctx.query;
//   ctx.body = id ? `포스트 #${id}` : "포스트 아이디 없음";
// });

// 라우터 설정
router.use("/api", api.routes());

//라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);
// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// 파라미터인 미들웨어 함수를 애플리케이션에 등록한다
// app.use(async (ctx, next) => {
//   ctx.body = "hello worlzㅋd";
//   console.log("1");
// });

const port = PORT || 4000;
app.listen(port, () => {
  console.log("Listening to port %d", port);
});
