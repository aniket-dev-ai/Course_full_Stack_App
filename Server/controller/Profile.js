const Profile = require("../model/Profile");
const User = require("../model/User");

exports.updateprofile = async (req, res) => {
  try {
    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;
    const id = req.user.id;
    if (!gender || !contactNumber) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findByIdAndUpdate(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();
    return res
      .status(200)
      .json({ message: "Profile Updated Successfully", profileDetails });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    await Profile.findByIdAndDelete(profileId);
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "Account Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getAllUsers = async (req, res) => {
    try {
        const id = req.user.id;
        const users = await User.find(id).populate("additionalDetails").exec();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }   1
}