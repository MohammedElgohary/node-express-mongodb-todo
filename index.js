const app = require("./src/app");

const port = app.get("PORT");

app.listen(port, () => {
  console.log(`App is ready on port ${port} \n http://localhost:${port}/`);
});