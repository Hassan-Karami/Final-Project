const mongoose = require('mongoose');
 
const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 40
    },
    thumbnail: {
      type: String,
      default: "/images/articleDefaultThumbnail.png",
    },
    content: {
      type: String,
      required: true,
    },
    description: { type: String },

    images: [{ type: String }],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "registration_date",
    },
  }
);

module.exports = mongoose.model('Article', ArticleSchema);
