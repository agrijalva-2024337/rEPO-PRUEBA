import Subject from "../models/subject.js";

export const createSubject = async (req, res, next) => {
  try {

    const { name } = req.body;

    const subject = await Subject.create({ name });

    res.json(subject);

  } catch (error) {

    next(error);

  }
};

export const getSubjects = async (req, res, next) => {
  try {

    const subjects = await Subject.find();

    res.json(subjects);

  } catch (error) {

    next(error);

  }
};