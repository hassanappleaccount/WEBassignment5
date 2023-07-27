/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hassan ElCHaaban Student ID: 146849229 Date: July 27, 2023
* Online (Cyclic) Link: https://cloudy-fly-umbrella.cyclic.app
*
********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var path = require("path");
var express = require("express");
const bodyParser = require('body-parser');
var app = express();
var collegeData = require("./modules/collegedata.js");
const exphbs = require('express-handlebars');

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
    });


app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
            },
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                return options.inverse(this);
                } else {
                return options.fn(this);
                }
                }
    }
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));








app.get("/addStudent", (req, res) => {
    res.render('addStudent');
});
  
  app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(() => {
      res.redirect('/students');
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Error adding student');
    });
  });
  app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
      .then(() => {
        res.redirect("/students");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error updating student");
      });
  });
  app.get("/students", (req, res) => {
    if (req.query.course) {
      collegeData.getStudentsByCourse(req.query.course).then((data) => {
        res.render("students", { students: data });
      }).catch((err) => {
        res.render("students", { message: "no results" });
      });
    } else {
      collegeData.getAllStudents().then((data) => {
        res.render("students", { students: data });
      }).catch((err) => {
        res.render("students", { message: "no results" });
      });
    }
  });

  app.get("/courses", (req, res) => {
    collegeData.getCourses().then((data) => {
      res.render("courses", { courses: data });
    }).catch((err) => {
      res.render("courses", { message: "no results" });
    });
  });

  app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num).then((studentData) => {
      collegeData.getCourses().then((coursesData) => {
        res.render("student", {
          student: studentData,
          courses: coursesData,
        });
      }).catch((err) => {
        res.render("courses", { message: "no results" });
      });
    }).catch((err) => {
      res.render("student", { message: "no results" });
    });
  });

  app.get('/course/:courseId', (req, res) => {
    let courseId = req.params.courseId;
    collegedata.getCourseById(courseId).then((data) => {
      res.render('course', { course: data });
    }).catch((err) => {
      console.log(err);
      res.status(404).send('Course not found');
    });
  });


  app.get('/', (req, res) => {
    res.render('home'); // Render the "home" view using handlebars template
  });
  

app.get("/about", (req, res) => {
res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

app.use((req, res) => {
    res.status(404).send("404 Page Not Found");
});



collegeData.initialize().then(() => {


app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
}).catch((err) => {
    console.log(err);
}
);
