const User = require("../models/User");
const School = require("../models/School");

// controlador para crear una escuela
exports.createSchool = async (req, res, next) => {
  const {
    name,
    generalInfo,
    primaryContactName,
    primaryContactEmail,
    primaryContactPhone,
    address,
    capacity,
    educationalMethod,
    educationLevelMin,
    educationLevelMax,
    primaryEducationalLanguage,
    secondaryEducationalLanguage,
    tuition,
  } = req.body;
  const { _id } = req.user;

  const user = await User.findById(_id);
  const school = await School.create({
    _user: user._id,
    name,
    generalInfo,
    primaryContactName,
    primaryContactEmail,
    primaryContactPhone,
    address,
    capacity,
    educationalMethod,
    educationLevelMin,
    educationLevelMax,
    primaryEducationalLanguage,
    secondaryEducationalLanguage,
    tuition,
  });

  user.isSchool = true;
  user._schools.push(school._id);

  await user.save();

  res.status(201).json({school, user});
};

// controlador para actualizar información de escuelas
exports.updateSchoolInfo = async (req, res, next) => {
  const { _id } = req.user;
  const { schoolId } = req.params;
  const {
    name,
    generalInfo,
    primaryContactName,
    primaryContactEmail,
    primaryContactPhone,
    address,
    capacity,
    educationalMethod,
    educationLevelMin,
    educationLevelMax,
    primaryEducationalLanguage,
    secondaryEducationalLanguage,
    tuition,
  } = req.body;
  const user = await User.findById(_id);
  if (user._schools.includes(schoolId)) {
    const school = await School.findByIdAndUpdate(
      schoolId,
      {
        name,
        generalInfo,
        primaryContactName,
        primaryContactEmail,
        primaryContactPhone,
        address,
        capacity,
        educationalMethod,
        educationLevelMin,
        educationLevelMax,
        primaryEducationalLanguage,
        secondaryEducationalLanguage,
        tuition,
      },
      { new: true }
    );

    res.status(200).json(school);
  } else {
    res.status(401).json({ message: "Unathorized" });
  }
};

// Controlador para obtener todas las escuelas
exports.getSchoolsByUser = async (req, res) => {
  const {_id} = req.user
  const schools = await School.find({_user: _id});
  res.status(200).json({ schools });
};

// Controlador para obtener todas las escuelas
exports.getAllSchools = async (req, res) => {
  const schools = await School.find();
  res.status(200).json({ schools });
};

//TODO: Verificar como voy a pasar estos como props o body para hacer el filtrado
// Controlador para filtrar escuelas
exports.getAllFilteredSchools = async (req, res) => {
  const {
    city,
    educationalMethod,
    educationLevelMin,
    educationLevelMax,
    primaryEducationalLanguage,
    secondaryEducationalLanguage,
    tuition,
  } = req.body;

  const schools = await School.find(req.body);
  res.status(200).json({ schools });
};

exports.getSchool = async (req, res) => {
  const { schoolId  } = req.params;
  const school = await School.findById(schoolId);
  res.status(200).json({ school });
};

exports.deleteSchool = async (req, res) => {
  const { schoolId } = req.params;
  const { _id} = req.user;
  const user = await User.findById(_id)
  if (user._schools.includes(schoolId)) {
   await School.findByIdAndRemove(schoolId)
   const index = user._schools.indexOf(schoolId)
   user._schools.splice(index, 1)
   await user.save()
   user._schools.length === 0 ? user.isSchool = false : null
   await user.save()
   res.status(200).json({message: "School removed"})
  } else {
    res.status(400).json({message: "School does not exist within your Schools Catalogue"})
  }
};