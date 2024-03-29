import express from "express";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "aaSpiral")));

app.get("/*", (req, res) =>{
  const u = req.url;
  console.log({u});
  let url = u ==='/' ? __dirname+ "/aaSpiral/Home/home.html":u.startsWith('/views')?__dirname+"/aaSpiral"+u:__dirname+u;
  console.log(url);
  res.sendFile(url)
});


app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
