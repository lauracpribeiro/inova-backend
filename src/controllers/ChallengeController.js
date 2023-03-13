const Challenge = require("../models/Challenge");
const Category = require("../models/Category");
const normalize = require("../utils/normalize");

module.exports = {
  async view(req, res) {
    const { id } = req.params;
    const challenge = await Challenge.findById(id)

    return res.json(challenge);
  },

  async list(req, res) {
    const challenges = await Category.find({ slug: {"$ne": "customizado"} }).populate('challenges')
    
    return res.json(challenges);
  },

  async create(req, res) {
    const { title, categorySlug, content } = req.body;

    if (!title) {
      return res.status(400).send({ error: "Informe o desafio para continuar." });
    }

    if (!content) {
      return res.status(400).send({ error: "Informe o conteúdo para continuar." });
    }

    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(400).send({ error: "Essa categoria não existe." });
    }

    const challenge = await Challenge.create({
      title,
      content,
      categoryId: category._id
    });

    category.challenges.push(challenge);
    await category.save(); 

    return res.json({ message: "Desafio criado!" });
  },

  async update(req, res) {
    const { id } = req.params;
    const result = await Challenge.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({ result });
  },

  async delete(req, res) {
    const { id } = req.params;
    await Challenge.findByIdAndDelete({ _id: id });

    return res.json({ message: "Deletado" });
  },
};
