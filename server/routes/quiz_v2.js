require('dotenv').config();
const express = require('express');
const axios = require('axios');

const quizRouter = express.Router();
const User = require("../models/User");

SEARCH_URL = process.env.ELK_DOMAIN + "/quiz/_search"

quizRouter.get('/', async (req, res) => {
  await axios.get(SEARCH_URL,
    {
      headers: { "Content-Type": "application/json" },
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
        "size": 0,
        "aggs": {
          "group_by_state": {
            "terms": {
              "field": "subject_category.keyword"
            }
          }
        }
      }
    })
    .then(result => {
      res.json({
        quizRecord: req.user?.quizRecord ?? "",
        data: result.data.aggregations
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
      headers: { "Content-Type": "application/json" },
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
        "size": 0,
        "aggs": {
          "group_by_state": {
            "terms": {
              "field": "subject_category.keyword"
            }
          }
        }
      }
    })
    .then(result => {
      res.json({
        keyword,
        quizRecord: req.user?.quizRecord ?? "",
        data: result.data.aggregations,
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
module.exports = quizRouter;