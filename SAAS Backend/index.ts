import app from "./src/app";
import "dotenv/config";

app.listen(process.env.PORT,() => {
    console.log(`Server is running in port ${process.env.PORT}`)
});