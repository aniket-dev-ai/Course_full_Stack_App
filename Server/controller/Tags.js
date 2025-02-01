const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const tagdetails = await Tag.create({
      name: name,
      description: description,
    });

    console.log(tagdetails);

    return res.status(200).json({ message: "Tag Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.showAllTags = async (req, res) => {
  try {
    const alltags = await Tag.find({}, { name: 1, description: 1 });
    res.status(200).json(alltags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
