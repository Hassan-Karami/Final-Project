const mongoose = require('mongoose');
 
const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
    },
    outline: {
      type: String,
      required: true,
      minLength: 3,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "registration_date",
    },
  }
);

module.exports = mongoose.model('Article', ArticleSchema);