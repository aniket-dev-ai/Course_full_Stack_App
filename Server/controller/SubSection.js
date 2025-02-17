const SubSection = require("../model/SubSection");
const Section = require("../model/Section");

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const uploadDetails = await uploadVideoToCloudinary(
      video,
      process.env.CLOUDINARY_SUBSECTION_FOLDER
    );

    const newSubSection = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      video: uploadDetails.secure_url,
    });

    const updatedsection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSections: newSubSection._id } },
      { new: true }
    );
    //log the updated section after adding populate query
    await updatedsection.populate("subSections").execPopulate();
    return res.status(200).json({ message: "SubSection Created Successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, timeDuration, description } = req.body;
        if (!subSectionId || !title || !timeDuration || !description) {
        return res.status(400).json({ message: "Please fill all the fields" });
        }
        const updatedSubSection = await SubSection.findByIdAndUpdate(
        { _id: subSectionId },
        { title, timeDuration, description },
        { new: true }
        );
        return res.status(200).json({ message: "SubSection Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId } = req.body;
        if (!subSectionId) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const deletedSubSection = await SubSection.findByIdAndDelete({ _id: subSectionId });
        return res.status(200).json({ message: "SubSection Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}