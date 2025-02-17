const Course = require("../models/Course");
const Section = require("../models/Section");

exports.createSection = async (req, res) => {
  try {
    const { sectonName, courseId } = req.body;
    if (!sectonName || !courseId) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const newSection = await Section.create({ sectonName });
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { courseContent: newSection._id } },
      { new: true }
    );
    //populate to replace section/sub_section both in the updatedCOurse
    await updatedCourse.populate("courseContent").execPopulate();

    return res.status(200).json({ message: "Section Created Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.updateSection = async (req, res) => {
    try {
        const { sectionId, sectionName } = req.body;
        if (!sectionId || !sectionName) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { sectionName },
            { new: true }
        );
        return res.status(200).json({ message: "Section Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.body;
        if (!sectionId) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const deletedSection = await Section.findByIdAndDelete({ _id: sectionId });
        return res.status(200).json({ message: "Section Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

