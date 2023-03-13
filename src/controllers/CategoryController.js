const Category = require("../models/Category");
const Challenge = require("../models/Challenge");
const normalize = require("../utils/normalize");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const category = await Category.findById(id);

    return res.json(category);
  },

  async list(req, res) {
    const categories = await Category.find();
    return res.json(categories);
  },

  async create(req, res) {
    const { title } = req.body;

    if (!title) {
      return res.status(400).send({ error: "Informe o título para continuar." });
    }

    const slug = normalize(title);

    const exists = await Category.findOne({ slug });

    if (exists) {
      return res.status(400).send({ error: "Esse título já está sendo usado" });
    }

    await Category.create({
      title,
      slug
    });
    return res.json({ message: "Categoria criada!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Category.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    await Category.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
