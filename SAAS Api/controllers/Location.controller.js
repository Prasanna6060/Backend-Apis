import currentLocation from "../models/CurrentLocation.model.js";

export const postLocation = async(req, res) => {
    const {longitude, latitude, userId} = req.body;
    if(!longitude || !latitude || !userId){
        return res.status(401).json({message: "All fields are required"});
    };
    try {
        const newLocation = await currentLocation({
            userId,
            currentLocation:{
             type: "Point",
             coordinates: [longitude, latitude]
            }

        })
        const saveUser = await newLocation.save();
      return  res.status(201).json({message: "Location Successfully Saved", saveUser}, )
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};


export const getUserLocation = async (req, res) => {
    const id = req.params.userId;
    try {
      const findUser = await currentLocation.find({ userId: id });
  
      if (!findUser.length) {
        return res.status(404).json({ message: "Location not found" });
      }
  
      return res.status(200).json({ message: "Success", data: findUser });
    } catch (error) {
      console.error("❌ Error fetching location:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };


  export const getallTechniciansLocation = async(req, res) => {
   try {
    const Technicians = await currentLocation.find({}).select('-__v');
    console.log(Technicians);
    return res.status(200).json({message: "SUccessful", Technicians})
   } catch (error) {
    console.log(error)
   }
  }