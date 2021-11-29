const { Router } = require('express');
const router = Router();
const axios = require('axios');

const synonymdata = require("../utils/synonym");
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

router.get('/', async (req, res) => {
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
        quiz: data.aggregations.group_by_subject
      });
    })
    .catch(err => {
      logger.error(err.message);
      res.status(500).json({ message: err.message });
    })
})

router.get('/:keyword', async (req, res) => {
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
    .then(({ data }) => {
      res.json({
        keyword,
        quizRecord: req.session.user?.quizRecord ?? "",
        quiz: data.aggregations.group_by_subject,
      });
    })
    .catch(err => {
      logger.error(err.message);
      res.status(500).json({ message: err.message });
    })
})

router.get('/sample/:synonnym', async (req, res) => {
  const { synonnym } = req.params;
  const smapleArrayData = synonymdata[synonnym];
  await axios.get(SEARCH_URL,
    {
      headers: HEADER_QUERY,
      data: {
        "query": {
          "bool": {
            "should": [
              {
                "terms": { "answer": smapleArrayData },
              },
              {
                "terms": { "message.nori": smapleArrayData }
              }
            ]
          }
        },
        "aggs": AGGREGATE_QUERY
      }
    })
    .then(({ data }) => {
      res.json({
        smapleArrayData,
        quizRecord: req.session.user?.quizRecord ?? "",
        quiz: data.aggregations.group_by_subject,
      });
    })
    .catch(err => {
      logger.error(err.message);
      res.status(500).json({ message: err.message });
    })
})

router.get('/content/:chapterid', async (req, res) => {
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
    .then(({ data }) => {
      res.json({ data: data.hits });
    })
    .catch(err => {
      logger.error(err.message);
      res.status(400).json({ message: err.message });
    })
})

module.exports = router;