const mongoose = require('mongoose');
 
const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
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



//create some article:

// (async()=>{
//   await mongoose.model("Article", ArticleSchema).create([
//     {
//       title: "Article 1",
//       thumbnail: "/images/articleDefaultThumbnail.png",
//       content: "This is the content of Article 1.",
//       description: "Description of Article 1",
//       images: [],
//       author: "648a9e6d103e08d65211d869",
//       comments: [],
//     },
//     {
//       title: "Article 2",
//       thumbnail: "/images/articleDefaultThumbnail.png",
//       content: "This is the content of Article 2.",
//       description: "Description of Article 2",
//       images: [],
//       author: "648a9e6d103e08d65211d869",
//       comments: [],
//     },
//     {
//       title: "Article 3",
//       thumbnail: "/images/articleDefaultThumbnail.png",
//       content: "This is the content of Article 3.",
//       description: "Description of Article 3",
//       images: [],
//       author: "648a9e6d103e08d65211d86a",
//       comments: [],
//     },
//     {
//       title: "Article 4",
//       thumbnail: "/images/articleDefaultThumbnail.png",
//       content: "This is the content of Article 4.",
//       description: "Description of Article 4",
//       images: [],
//       author: "648a9e6d103e08d65211d86a",
//       comments: [],
//     },
//   ]);
// })()