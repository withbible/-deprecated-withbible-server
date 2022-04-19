const Quiz = require('../models/Quiz');

const putQuiz = async (quizObject) => {
  try {
    return await Quiz.insertMany(
      quizObject
    );
  }
  catch (err) {
    throw (err);
  }
};

const getQuizCategoryById = async (categoryId) => {
  try {
    return await Quiz.find(
      { categoryId }
    );
  }
  catch (err) {
    throw (err);
  }
};

const putQuizChapter = async (categoryObject) => {
  try {
    return await new Quiz(categoryObject).save();
  }
  catch (err) {
    throw (err);
  }
};

const postQuizQuestion = async (
  categoryId,
  title,
  text,
  options
) => {
  try {
    // +++ TODO: addtoset's value is not primitive so duplicated issue
    return await Quiz.findOneAndUpdate(
      {
        $and: [
          { categoryId },
          { title },
        ]
      },
      {
        $addToSet: {
          "questions": {
            text,
            options
          },
        }
      },
      { new: true }
    );
  }
  catch (err) {
    throw (err);
  }
};

const deleteQuizQuestion = async (questionId) => {
  try {
    return await Quiz.findOneAndUpdate(
      { 'questions._id': questionId },
      {
        $pull: {
          'questions': {
            '_id': questionId
          }
        }
      },
      { new: true }
    );
  }
  catch (err) {
    throw (err);
  }
}

module.exports = {
  putQuiz,
  getQuizCategoryById,
  putQuizChapter,
  postQuizQuestion,
  deleteQuizQuestion
};