import express from "express";

const app = express();


// Test endpoint working
app.use('/',(req,res) => {
      res.json({ Success: true });
})

app.listen(3000,() => console.log(`Server listen on port 3000`));