const category = require("../models/category");

exports.createcategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const categorydetails = await category.create({
      name: name,
      description: description,
    });

    console.log(categorydetails);

    return res.status(200).json({ message: "category Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.showAllcategorys = async (req, res) => {
  try {
    const allcategorys = await category.find({}, { name: 1, description: 1 });
    res.status(200).json(allcategorys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.categoryPagedetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const selectedCategory = await category.findById(categoryId);
    if (!selectedCategory) {
      return res.status(400).json({ message: "Category Not Found" });
    }

    const diffCategory = await category
      .find({
        _id: { $ne: categoryId },
      })
      .populate("products")
      .exec();

    return res.status(200).json(selectedCategory , diffCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
