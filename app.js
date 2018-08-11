const expressSanitizer = require('express-sanitizer'),
      methodOverride   = require('method-override'),
      bodyParser       = require('body-parser'),
      mongoose         = require('mongoose'),
      express          = require('express'),
      app              = express();
// APP CONFIG
mongoose.connect('mongodb://localhost/jsrItParkBlog');
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
// MONGOOSE/MODEL CONFIG
let blogSchema = {
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
};
let Blog = mongoose.model('blog', blogSchema);
// RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
});
// INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        err ? console.log(err) : res.render('index', {blogs: blogs});
    });
});
// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});
// CREATE ROUTE
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        err ? res.render('new') : res.redirect('/blogs');
    });
});
// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        err ? res.redirect('/blogs') : res.render('show', {blog: foundBlog});
    });
});
// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        err ? res.redirect('/blogs/' + req.params.id) : res.render('edit', {blog: foundBlog});
    });
});
// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        err ? res.redirect('/blogs') : res.redirect('/blogs/' + req.params.id);
    });
});
// DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, err => {
        err ? res.redirect('/blogs') : res.redirect('/blogs');
    });
});
// SERVER CONFIG
app.listen(3000, () => {
    console.log('Blog has started');
});