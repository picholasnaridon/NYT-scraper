var Note    = require("../models/note.js");
var Article = require("../models/article.js");
var cheerio = require("cheerio");
var request = require("request");

module.exports = {
  delete: function (req, res){
    Note.findByIdAndRemove(req.params.id, function (err, todo) {  
      if (err) {
        console.log(err);
      } 
      else {
        res.redirect("/articles");
      }
    });
  },

  addComment:  function (req, res){
    var result = {
      author: req.params.name,
      commentBody: req.body.comment
    };
    var entry = new Note (result);
    entry.save(function(err, doc) {
      if (err) {
        console.log(err);
      } 
      else {
        Article.findOneAndUpdate({'_id': req.params.id}, {$push: {'notes':doc._id}}, {new: true})
        .exec(function(err, doc){
          if (err){
            console.log(err);
          } else {
            res.redirect("/articles");
          }
        });
      }
    });
  },

  getComment: function (req,res){
      res.redirect('/articles');
    },

    scrape: function(req, res) {

    request("https://www.nytimes.com/section/world", function(error, response, html) {

      const $ = cheerio.load(html);
      let titlesArray = [];
      $("div.story-body").each(function(i, element) {
        let result = {};
        result.link = $(element).find("a").attr("href");
        result.title = $(element).find("h2.headline").text().trim();
        result.summary = $(element).find("p.summary").text().trim();
        let img = $(element).parent().find("figure.media").find("img").attr("src");
        if (img) {
          result.img = img;
        }
        let newArt = new Article(result);
        if (titlesArray.indexOf(result.title) === -1) {
          titlesArray.push(result.title); 
          Article.count({ title: result.title}, function (err,dupeCheck){
            if (dupeCheck === 0) {
              let entry = new Article(result); 
              entry.save(function(err,doc){
                if (err) {
                  console.log(err);
                } 
              });
            } 
          });
        } 
      }); 
    }, res.redirect("/articles")); 
  },

  home: function(req, res) {
    Article.find({}, null, {sort: {created: -1}}, function(err, data) {
      if(data.length === 0) {
        res.redirect("/scrape");
      } else{
        res.redirect("/articles")
      }
    });
  },

  getArticles: function (req, res){
    Article.find().sort({_id: -1})
      .populate('notes')
      .exec(function(err, doc){
        if (err){
          console.log(err);
        } 
        else {
          var expbsObject = {articles: doc};
          res.render('index', expbsObject);
        }
      });
  }
}