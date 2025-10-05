import express from "express";
import axios from "axios";

const app=express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render("index.ejs");
});

app.get('/weather',async(req,res)=>{
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    console.log("Received coordinates:", latitude, longitude); 
    if(!latitude || !longitude ){
        return res.status(400).render("error.ejs",{message: "Latitude and Longitude are required"});  
    }
    try{
      
        const apiUrl=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m&current_weather=true&timezone=auto`;
        console.log("API URL:", apiUrl); 
        const response = await axios.get(apiUrl);
        const data = response.data;

        const current =data.current_weather;
        const hourly = data.hourly;

        res.render("weather.ejs",{current,hourly});

    }
    catch(error){
        console.log("Error calling in API");
        res.status(404).render("error.ejs",{message:"Page not Found"});

    }

});
app.listen(port,()=>{
    console.log(`Server is running on port number ${port}`);
});
