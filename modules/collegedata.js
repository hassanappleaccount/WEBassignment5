
class data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}
const fs = require('fs');
var dataCollection = null;

function initialize(){
    return new Promise((resolve, reject) => {
      fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
        if (err) {
          reject("Unable to read students.json");
          return;
        }
        let students = JSON.parse(studentDataFromFile);

        fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
          if (err) {
            reject("Unable to read courses.json");
            return;
          }
          let courses = JSON.parse(courseDataFromFile);

          dataCollection = new data(students, courses);
          resolve();
        });
      });
    })
}

function getAllStudents(){
    return new Promise(function(resolve, reject){
        if(dataCollection != null){
            resolve(dataCollection.students);
            return;
        }
        else{
            reject("no results returned")
        }
    });
}



function getTAs () {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
        const tas = dataCollection.students.filter(student => student.TA === true);
        if (tas.length > 0) {
          resolve(tas);
        } else {
          reject("No results returned");
        }
      } else {
        reject("No results returned");
      }
    });
  }
;
function getCourses(){
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.courses && dataCollection.courses.length > 0) {
        resolve(dataCollection.courses);
      } else {
        reject("No results returned");
      }
    });
  }

  function updateStudent(studentData){
    return new Promise(function (resolve, reject) {
      if(studentData.length == 0){
        reject("No result returned"); // Rejecting promise if error occours
        return;
      }
      for(i=0; i < dataCollection.students.length; i++){
        if(studentData.studentNum == dataCollection.students[i].studentNum){
          dataCollection.students[i].firstName = studentData.firstName
          dataCollection.students[i].lastName = studentData.lastName
          dataCollection.students[i].email = studentData.email
          dataCollection.students[i].addressStreet = studentData.addressStreet
          dataCollection.students[i].addressCity = studentData.addressCity
          dataCollection.students[i].addressProvince = studentData.addressProvince
          dataCollection.students[i].TA = (typeof studentData.TA === 'undefined') ? false : true;
          dataCollection.students[i].status = studentData.status
          dataCollection.students[i].course = studentData.course
        }
      }
      
      resolve(studentData);
      return
    });
  }
  function getCourseById(id){
    return new Promise(function (resolve, reject) {
      allCoursesData = dataCollection.courses;
      if(allCoursesData.length <= 0){
        reject("No result returned"); // Rejecting promise if error occours
        return;
      }
      for (let i = 0; i < allCoursesData.length; i++) {
        if(allCoursesData[i].courseId == id){
            resolve(allCoursesData[i]);
            return;
        }
      }
      reject("no results returned"); // Rejecting promise if error occours
      return;
    });
  }
  
  function getStudentsByCourse(course){
    return new Promise(function (resolve, reject) {
      studentData = dataCollection.students;
      studentArr = []
      if(studentData.length <= 0){
        reject("No result returned"); // Rejecting promise if error occours
        return;
      }
      for (let i = 0; i < studentData.length; i++) {
        if(studentData[i].course == course){
          studentArr.push(studentData[i]);
        }
      }
      if(studentArr.length == 0){
        reject("No result returned"); // Rejecting promise if error occours
        return;
      }
      resolve(studentArr);
      return
    });
  }
  function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
        const student = dataCollection.students.find(student => student.num === num);
        if (student) {
          resolve(student.name);
        } else {
          reject("No results returned");
        }
      } else {
        reject("No results returned");
      }
    });
  }

  function addStudent(studentData) {
    return new Promise((resolve, reject) => {
      if (!studentData.TA) {
        studentData.TA = false;
      } else {
        studentData.TA = true;
      }
      studentData.studentNum = dataCollection.students.length + 1;
      dataCollection.students.push(studentData);
      resolve();
    });
  }
function getStudentByNum(num){
    return new Promise(function (resolve, reject) {
      studentData = dataCollection.students;
      if(studentData.length <= 0){
        reject("No result returned"); // Rejecting promise if error occours
        return;
      }
      for (let i = 0; i < studentData.length; i++) {
        if(studentData[i].studentNum == num){
            resolve(studentData[i]);
            return;
        }
      }
      reject("no results returned"); // Rejecting promise if error occours
      return;
    })
}
module.exports = {initialize, data, getAllStudents, getTAs, getCourses, getStudentsByCourse, getStudentByNum, addStudent, updateStudent, getCourseById, getStudentByNum};
