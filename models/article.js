var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: "No Summary Available"
  },
  issaved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "Save Article",
  },
  created: {
    type: Date,
    default: Date.now
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

ArticleSchema.index({title: "text"}); 

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;