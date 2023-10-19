import mongoose from "mongoose";


export const Connection = async (username,password) =>{
    const URL = `mongodb+srv://${username}:${password}@cluster0.mehmlre.mongodb.net/?retryWrites=true&w=majority`
    try{
     await mongoose.connect(URL,{useUnifiedTopology:true,useNewUrlParser:true});
     console.log('Datebase is connected succesfully');
    }catch(error){
        console.log('Error while connecting with database',error.message);
    }
}

export default Connection;