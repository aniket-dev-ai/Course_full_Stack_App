const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !tag ||
      !whatYouWillLearn ||
      !thumbnail
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userId = req.user.id;
    const instructordetails = await User.findById(userId);
    console.log(instructordetails);
    if (!instructordetails) {
      return res.status(400).json({ message: "Instructor not found" });
    }

    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({ message: "Tag not found" });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.CLOUDINARY_COURSE_FOLDER
    );

    const newcourse = await Course.create({
      courseName,
      courseDescription,
      instructor: userId,
      whatYouWillLearn: whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      tag: tagDetails._id,
    });

    await User.findByIdAndUpdate(
      { _id: instructordetails._id },
      { $push: { courses: newcourse._id } },
      { new: true }
    );

    return res.status(200).json({ message: "Course Created Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: 1,
        thumbnail: 1,
        price: 1,
        tag: 1,
        instructor: 1,
        ratingAndReviews: 1,
        studentsEnrolled: 1,
      }
        .populate("instructor")
        .exec()
    );
    return res.status(200).json(allCourses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
