const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();


mongoose.connect('mongodb://localhost:27017/articleDB', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const articleSchema = {
    name: String,
    content: String
};
const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (err) console.log(err);
            else res.send(foundArticles);
        });
    })
    .post((req, res) => {
        const article1 = new Article({
            name: req.body.name,
            content: req.body.content
        });
        article1.save();
        res.send("Article added.")
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (err) console.log(err);
            else res.send('All articles are deleted.')
        });
    });

app.route('/articles/:articleId')
    .get((req, res) => {
        Article.findById(req.params.articleId, (err, foundArticle) => {
            if (err) console.log(err);
            else res.send(foundArticle);
        });
    })
    .delete((req, res) => {
        Article.findByIdAndDelete(req.params.articleId, (err) => {
            if (err) console.log(err)
            else res.send("The article has been deleted.")
        });
    })
    .put((req, res) => {
        Article.update({_id: req.params.articleId},
            {name: req.body.name, content: req.body.content},
            {overwrite: true},
            (err) => {
                if (err) console.log(err);
                else res.send("The article is updated.")
            }
        );
    })
    .patch((req, res) => {
        Article.update({_id: req.params.articleId},
            {$set: req.body},
            (err) => {
                if (err) console.log(err);
                else res.send("The article's name is updated.")
            }
        );
    });

app.listen(3000, () => {
    console.log("It is running on port 3000.");
});