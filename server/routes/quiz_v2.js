require('dotenv').config();
const express = require('express');
const axios = require('axios');

const quizRouter = express.Router();
const User = require("../models/User");

SEARCH_URL = "http://localhost:9200/quiz/_search"
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

quizRouter.get('/', async (req, res) => {
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
        quizRecord: req.user?.quizRecord ?? "",
        quiz: data.aggregations.group_by_subject
      });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
})
quizRouter.get('/:keyword', async (req, res) => {
  const { keyword } = req.params;
  await axios.get(SEARCH_URL,
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
    })
    .then(result => {
      res.json({
        keyword,
        quizRecord: req.user?.quizRecord ?? "",
        quiz: result.data.aggregations.group_by_subject,
      });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
})
quizRouter.get('/content/:chapterid', async (req, res) => {
  const { chapterid } = req.params;
  await axios.get(SEARCH_URL,
    {
      headers: { "Content-Type": "application/json" },
      data: {
        "query": {
          "bool": {
            "should": [
              {
                "match": { "chapter_category": chapterid }
              }
            ]
          }
        }
      }
    })
    .then(result => {
      res.json({ data: result.data.hits });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
})
quizRouter.get('/chart/:chapterid', async (req, res) => {
  const { chapterid } = req.params;
  const filter = {}
  filter[`quizRecord.${chapterid}`] = { "$exists": true }

  await User.find(filter)
    .then(result => {
      res.json({ data: result });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })

})
quizRouter.get('/hash/:keyword', async (req, res) => {
  const { keyword } = req.params;
  await axios.get(SEARCH_URL,
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
    })
    .then(result => {
      res.json({
        keyword,
        quizRecord: req.user?.quizRecord ?? "",
        quiz: result.data.aggregations.group_by_subject,
      });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
})
module.exports = quizRouter;