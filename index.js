const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

// 파일 정보 저장 (메모리)
const fileMeta = {};

// 업로드
app.post("/upload", upload.single("file"), (req, res) => {
  const { password, expire } = req.body;

  fileMeta[req.file.filename] = {
    original: req.file.originalname,
    password,
  };

  // 자동 삭제 타이머
  setTimeout(() => {
    fs.unlink(`uploads/${req.file.filename}`, () => {});
    delete fileMeta[req.file.filename];
  }, Number(expire) * 1000);

  res.redirect("/");
});

// 파일 목록
app.get("/files", (req, res) => {
  res.json(fileMeta);
});

// 다운로드 (비밀번호 확인)
app.post("/download", (req, res) => {
  const { name, password } = req.body;
  const meta = fileMeta[name];

  if (!meta || meta.password !== password) {
    return res.status(403).send("비밀번호 틀림");
  }

  res.download(
    path.join(__dirname, "uploads", name),
    meta.original
  );
});

app.listen(PORT, () => {
  console.log("🍜 준우의 라면 파일공유 서버 실행중");
});
