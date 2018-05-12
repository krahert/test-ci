const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const cleanCache = require('../middlewares/cleanCache');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    //! O sa ii chain-uim instantei query-ului facut de Mongoose, metoda noastra
    //! , custom numita cache(), care este monkey-patched in prototipul lui
    //! , mongoose.Query .
    const blogs = await Blog.find({ _user: req.user.id }).cache({key: req.user.id});
    res.send(blogs);
  });

  //! 'cleanCache' o sa ii spuna la route handler sa execute callback-ul si apoi 
  //! , sa curete cache-ul pentru userul respectiv.
  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
