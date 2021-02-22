const User = require("../models/User");
const School = require("../models/School");
const Student = require("../models/Student")

// controller for creating student
exports.createStudent = async (req, res, next) => {
    const {_id} = req.user
    const { alias, level} = req.body 

    const avatar = `https://ui-avatars.com/api/?background=206de8&color=fff&length=1&rounded=true&name=${alias}`;
    const user = await User.findById(_id)
    const student = await Student.create({
        _user: _id,
        alias,
        level,
        avatar
    })

    user._students.push(student._id)
    user.save()
    res.status(201).json(student, user)
}

// controller for getting all students
exports.getAllStudents = async (req, res, next) =>{
    const students = await Student.find()
    res.status(201).json(students)
}
// router.get("/student/:studentId", catchErrors(getStudentById));
//controller for getting student by ID
exports.getStudentById = async (req, res, next) => {
    const {studentId} = req.params
    const student = await Student.findById(studentId)
    res.status(201).json(student)
}



// router.patch("/student/:studentId", catchErrors(updateStudent));
// controller para editar a student
exports.updateStudent = async (req, res, next) => {
    const {studentId} = req.params 
    const {_id} = req.user
    const {alias, level} = req.body
    const user = await User.findById(_id)
    if(user._student.includes(studentId)){
        const student = await Student.findByIdAndUpdate(
            studentId,
            {
                alias,
                level
            },
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
    if(user._student.includes(studentId)){
        await Student.findByIdAndRemove(studenId)
        const index = user._student.indexOf(studentId)
        await user._student.splice(index, 1)
        await user.save()
        const schools = await School.find({_students: {$contains: studentId}})
        for (let i=0; i<=schools.length; i++){
            const index = schools[i]._students.indexOf(studentId)
            await school[i]._students.splice(index, 1)
            await school[i].save()
        }
        res.status(200).json({message: 'Student Deleted'})
    } else {
        res.status(401).json({message: "Unathorized"})
    }
}