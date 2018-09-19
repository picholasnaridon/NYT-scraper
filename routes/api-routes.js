var controller = require('../controllers/controller')

module.exports = function(app, Aritcle, Note)  {

  app.get("/", controller.home);
  app.get("/scrape", controller.scrape); 
  app.get('/articles', controller.getArticles);
  app.get('/display/comment/:id', controller.getComment);
  app.post('/add/comment/:id', controller.addComment);
  app.post('/remove/comment/:id', controller.delete);
}




