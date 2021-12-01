const axios = require('axios');

const { SYNONYM_RECORDS } = require("../utils/vo");
const logger = require('../log');

const SEARCH_URL = process.env.SEARCH_DOMAIN + "/quiz/_search"
const HEADER_QUERY = { "Content-Type": "application/json" };
const AGGREGATE_QUERY = {
  "group_by_subject": {
    "terms": {
      "field": "subject_category.keyword"
    },
    "aggs": {
      "group_by_chapter": {
        "terms": {
          "field": "chapter_category"
        }
      }
    }
  }
}

// +++ content
const getQuiz = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { data } = await axios.get(SEARCH_URL,
      {
        headers: HEADER_QUERY,
        data: {
          "query": {
            "bool": {
              "should": [
                {
                  "match": { "chapter_category": chapterId }
                }
              ]
            }
          }
        }
      })
    res.json({ data: data.hits });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

const getChapter = async (req, res) => {
  await axios.get(SEARCH_URL,
    {
      headers: HEADER_QUERY,
      data: {
        "query": {
          "bool": {
            "must_not": [
              {
                "match": { "subject_category": "subject_category" }
              }
            ]
          }
        },
        "aggs": AGGREGATE_QUERY
      }
    })
    .then(({ data }) => {
      res.json({
        quizRecord: req.session.user?.quizRecord ?? "",
        data: data.aggregations.group_by_subject
      });
    })
    .catch(err => {
      logger.error(err.message);
      res.status(500).json({ message: err.message });
    })
};

// +++ search
const getChapterByKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;
    const { data } = await axios.get(SEARCH_URL,
      {
        headers: HEADER_QUERY,
        data: {
          "query": {
            "bool": {
              "should": [
                {
                  "match": { "answer": keyword }
                },
                {
                  "match": { "message.nori": keyword }
                }
              ]
            }
          },
          "aggs": AGGREGATE_QUERY
        }
      });
    res.json({
      keyword,
      quizRecord: req.session.user?.quizRecord ?? "",
      data: data.aggregations.group_by_subject
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const getChapterBySynonymKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;
    const synonymData = SYNONYM_RECORDS[keyword];
    if (!synonymData)
      throw new Error("유사어가 존재하지 않습니다.");

    const { data } = await axios.get(SEARCH_URL,
      {
        headers: HEADER_QUERY,
        data: {
          "query": {
            "bool": {
              "should": [
                {
                  "terms": { "answer": synonymData },
                },
                {
                  "terms": { "message.nori": synonymData }
                }
              ]
            }
          },
          "aggs": AGGREGATE_QUERY
        }
      });
    res.json({
      synonymData,
      quizRecord: req.session.user?.quizRecord ?? "",
      data: data.aggregations.group_by_subject
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getQuiz,
  getChapter,
  getChapterByKeyword,
  getChapterBySynonymKeyword
};