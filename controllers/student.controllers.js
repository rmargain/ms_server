const User = require("../models/User");
const School = require("../models/School");
const Student = require("../models/Student")

// controller for creating student
exports.createStudent = async (req, res, next) => {
    const {_id} = req.user
    const { alias, level} = req.body 

    const avatar = `https://ui-avatars.com/api/?background=206de8&color=fff&length=1&rounded=true&name=${alias}`;
    const user = await User.findById(_id)
    const students = await Student.find({ _user: _id, alias: alias });

    if (students.length > 0){
        res.status(401).json({message: "You already have a student with the same Alias, please try a different Alias"})
    }
    const student = await Student.create({
        _user: _id,
        alias,
        level,
        avatar
    })

    user._students.push(student._id)
    await user.save()
    res.status(201).json({student, user})
}

// controller for getting all students
exports.getAllStudents = async (req, res, next) =>{
    const students = await Student.find()
    res.status(201).json(students)
}
//controller for getting student by ID
exports.getStudentById = async (req, res, next) => {
    const {studentId} = req.params
    const student = await Student.findById(studentId)
    res.status(201).json(student)
}



// controller para editar a student
exports.updateStudent = async (req, res, next) => {
    const {studentId} = req.params 
    const {_id} = req.user
    // const {alias, level} = req.body
    const user = await User.findById(_id)
    if(user._students.includes(studentId)){
        const student = await Student.findByIdAndUpdate(
            studentId,
            req.body,
            {new: true}
        )
        res.status(200).json(student)
    } else {
        res.status(401).json({message: 'Unathorized'})
    }
}
// router.delete("/student/:studentId", catchErrors(deleteStudent));
// controller para borrar student
exports.deleteStudent = async (req, res, next) =>{
    const {studentId} = req.params 
    const {_id} = req.user 
    const user = await User.findById(_id)
    if(user._students.includes(studentId)){
        await Student.findByIdAndRemove(studentId)
        const index = user._students.indexOf(studentId)
        user._students.splice(index, 1)
        await user.save()
        const schools = await School.find({_students: studentId})
        if(schools.length > 0){
            for (let i=0; i<=schools.length; i++){
            const index = schools[i]._students.indexOf(studentId)
            school[i]._students.splice(index, 1)
            await school[i].save()
        }
        } 
        res.status(200).json({message: 'Student Deleted'})
    } else {
        res.status(401).json({message: "Unathorized"})
    }
}