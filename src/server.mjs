import app from "./app.mjs";
import http from 'http';
import 'dotenv/config'

const PORT = process.env.PORT || 3000;

const server = http.createServer(app)



try {
    server.listen(PORT,()=>{
        console.log(`Server is listening on port ${PORT}`);
    })
}catch (error) {
    console.log("Error occurred: ", error);
}

