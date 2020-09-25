var express = require("express")
const bodyParser = require("body-parser")
var app = express()
var bodyparser = require("body-parser")
var mongoose = require("mongoose")
var methodoverride = require("method-override")
var expresssanitizer = require("express-sanitizer")

mongoose.connect("mongodb://localhost/restfulblog", { useNewUrlParser: true, useUnifiedTopology: true })
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(expresssanitizer())
app.use(methodoverride("_method"))
var blogschema = {
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
}
var blog = mongoose.model("Blog", blogschema)

// blog.create({
// title:"test blog",
// image:"https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&h=350",
// body:"this ias a test blog post"
// }
// )



//index
app.get("/blogs", function (req, res) {
    blog.find({}).then(function (e) {
        res.render("index", { posts: e })
    }).catch(function (e) {
        console.log(e);

    })

})

//new
app.get("/blogs/new", function (req, res) {
    res.render("new")
})
app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    blog.create(req.body.blog).then(function (e) {
        res.redirect("/blogs")
    }).catch(function (e) {
        console.log(e);

    })
})
//show
app.get("/blogs/:id", function (req, res) {
    blog.findById(req.params.id).then(function (e) {
        res.render("show", { blog: e })
    }).catch(function (e) {
        console.log(e);

        res.redirect("/blogs")
    })

})
//edit
app.get("/blogs/:id/edit", function (req, res) {
    blog.findById(req.params.id).then(function (e) {
        res.render("edit", { blog: e })
    }).catch(function (e) {
        console.log(e);

        res.redirect("/blogs")
    })
})

app.put("/blogs/:id", function (req, res) {
    blog.findByIdAndUpdate(req.params.id, req.body.blog).then(function (e) {
        res.redirect("/blogs/" + req.params.id)
    }).catch(function (e) {
        console.log(e);
        res.redirect("/blogs")
    })
})

//delete
app.delete("/blogs/:id", function (req, res) {
    blog.findByIdAndRemove(req.params.id).then(function (e) {
        res.redirect("/blogs")
    }).catch(function (e) {
        console.log(e);

    })

})
app.get("/", function (req, res) {
    res.redirect("/blogs")
})

app.listen(3001)