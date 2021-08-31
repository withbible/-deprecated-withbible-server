const express = require('express');
const quizRouter = express.Router();
const axios = require('axios');

quizRouter.get('/', async (req, res) => {
  await axios.get("http://localhost:9200/quiz/_search",
    {
      headers: { "Content-Type": "application/json" },
      data: {
        size: 0,
        aggs: {
          group_by_state: {
            terms: {
              field: "column9.keyword"
            }
          }
        }
      }
    })
    .then(result => {
      console.log(result.data.aggregations);
      res.json({ data: result.data.aggregations });
    })
    .catch(err => {
      console.log("I AM ERROR: ", err);
      res.status(500).json({ message: err.message });
    })
})

module.exports = quizRouter;