const express = require('express');
const quizRouter = express.Router();
const axios = require('axios');

quizRouter.get('/', async (_, res) => {
  await axios.get("http://localhost:9200/quiz/_search",
    {
      headers: { "Content-Type": "application/json" },
      data: {
        "query": {
          "bool": {
            "must_not": [
              {
                "match": { "pass": "pass" }
              },
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
      res.json({ data: result.data.aggregations });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
})
quizRouter.get('/:keyword', async (req, res) => {
  const { keyword } = req.params;
  await axios.get("http://localhost:9200/quiz/_search",
    {
      headers: { "Content-Type": "application/json" },
      data: {
        "query": {
          "bool": {
            "must_not": [
              {
                "match": { "pass": "pass" }
              },
              {
                "match": { "subject_category": "subject_category" }
              }
            ],
            "filter": [
              {
                "match": { "message": keyword }
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
      res.json({ data: result.data.aggregations });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
})

module.exports = quizRouter;