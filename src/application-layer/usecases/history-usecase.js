module.exports = ({
  historyRepository,
  leaderBoardRepository,
  quizRepository,
  database,
  StatusCodes,
}) => {
  return Object.freeze({
    getUserOption,
    postUserOption,
    putUserOption,
    deleteUserOption,
    getActiveChapterCount,
    getActiveChapter,
    getActiveChapterPage,
    getTotalCount,
    getHitCount,
    getAvgHitCount,
  });

  async function getUserOption(categorySeq, chapterNum, userSeq) {
    const rows = await historyRepository.selectUserOption(
      categorySeq,
      chapterNum,
      userSeq
    );

    if (!rows.length) {
      const err = new Error("해당 기록이 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    return Promise.resolve(rows);
  }

  async function postUserOption(categorySeq, chapterNum, userSeq, userOption) {
    const [userOptionRows, [chapterSeqRow]] = await Promise.all([
      historyRepository.selectUserOption(categorySeq, chapterNum, userSeq),
      quizRepository.selectChapterSeq(categorySeq, chapterNum),
    ]);

    if (userOptionRows.length > 0) {
      const err = new Error("중복된 기록입니다.");
      err.status = StatusCodes.METHOD_NOT_ALLOWED;
      return Promise.reject(err);
    }

    const pool = await database.get();
    const connection = await pool.getConnection();
    const { chapterSeq } = chapterSeqRow;

    try {
      await connection.beginTransaction();
      await historyRepository.insertUserOption(
        connection,
        userOption,
        userSeq,
        chapterSeq
      );

      const [[activeCountRow], [hitCountRow]] = await Promise.all([
        historyRepository.selectActiveQuestionCount(
          connection,
          chapterSeq,
          userSeq
        ),
        historyRepository.selectHitCountByChapterSeq(
          connection,
          chapterSeq,
          userSeq
        ),
      ]);

      await historyRepository.insertChapterUserState(
        connection,
        chapterSeq,
        userSeq,
        activeCountRow.activeQuestionCount,
        hitCountRow?.hitQuestionCount ?? 0
      );

      const [{ quizScore }] = await historyRepository.selectScore(
        connection,
        userSeq
      );
      await leaderBoardRepository.updateLeaderBoard(
        connection,
        userSeq,
        quizScore
      );
      await connection.commit();

      return Promise.resolve();
    } catch (err) {
      await connection.rollback();

      err.status = StatusCodes.INTERNAL_SERVER_ERROR;
      return Promise.reject(err);
    } finally {
      connection.release();
    }
  }

  async function putUserOption(categorySeq, chapterNum, userSeq, userOption) {
    const [userOptionRows, [chapterSeqRow]] = await Promise.all([
      historyRepository.selectUserOption(categorySeq, chapterNum, userSeq),
      quizRepository.selectChapterSeq(categorySeq, chapterNum),
    ]);

    if (!userOptionRows.length) {
      const err = new Error("해당 기록이 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    const isModified =
      Object.keys(userOption).length !== userOptionRows.length ||
      userOptionRows.some(
        (each) => each.questionOptionSeq !== userOption[each.questionSeq]
      );

    if (!isModified) {
      const status = StatusCodes.NO_CONTENT;
      return Promise.resolve(status);
    }

    const pool = await database.get();
    const connection = await pool.getConnection();
    const { chapterSeq } = chapterSeqRow;

    try {
      await connection.beginTransaction();
      await historyRepository.updateUserOption(
        connection,
        userOption,
        userSeq,
        chapterSeq
      );

      const [[activeCountRow], [hitCountRow]] = await Promise.all([
        historyRepository.selectActiveQuestionCount(
          connection,
          chapterSeq,
          userSeq
        ),
        historyRepository.selectHitCountByChapterSeq(
          connection,
          chapterSeq,
          userSeq
        ),
      ]);

      await historyRepository.updateChapterUserState(
        connection,
        activeCountRow.activeQuestionCount,
        hitCountRow?.hitQuestionCount ?? 0,
        chapterSeq,
        userSeq
      );

      const [{ quizScore }] = await historyRepository.selectScore(
        connection,
        userSeq
      );
      await leaderBoardRepository.updateLeaderBoard(
        connection,
        userSeq,
        quizScore
      );
      await connection.commit();

      return Promise.resolve(StatusCodes.CREATED);
    } catch (err) {
      await connection.rollback();

      err.status = StatusCodes.INTERNAL_SERVER_ERROR;
      return Promise.reject(err);
    } finally {
      connection.release();
    }
  }

  async function deleteUserOption(categorySeq, chapterNum, userSeq) {
    const [userOptionRows, [chapterSeqRow]] = await Promise.all([
      historyRepository.selectUserOption(categorySeq, chapterNum, userSeq),
      quizRepository.selectChapterSeq(categorySeq, chapterNum),
    ]);

    if (!userOptionRows.length) {
      const err = new Error("해당 기록이 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    const pool = await database.get();
    const connection = await pool.getConnection();
    const { chapterSeq } = chapterSeqRow;

    try {
      await connection.beginTransaction();
      await Promise.all([
        historyRepository.deleteUserOption(userSeq, chapterSeq),
        historyRepository.deleteChapterUserState(userSeq, chapterSeq),
      ]);

      const [{ quizScore }] = await historyRepository.selectScore(
        connection,
        userSeq
      );
      await leaderBoardRepository.updateLeaderBoard(
        connection,
        userSeq,
        quizScore
      );
      await connection.commit();

      return Promise.resolve();
    } catch (err) {
      await connection.rollback();

      return Promise.reject(err);
    } finally {
      connection.release();
    }
  }

  async function getActiveChapterCount(categorySeq, userSeq) {
    const [result] = await historyRepository.selectActiveChapterCount(
      userSeq,
      categorySeq
    );

    if (!result) {
      const err = new Error("해당 기록이 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    return Promise.resolve(result);
  }

  async function getActiveChapter(categorySeq, userSeq) {
    const result = categorySeq
      ? await historyRepository.selectActiveChapterByCategorySeq(
        userSeq,
        categorySeq
      )
      : await historyRepository.selectActiveChapter(userSeq);

    if (!result.length) {
      const err = new Error("해당 기록이 존재하지 않습니다.");
      err.status = StatusCodes.NOT_FOUND;
      return Promise.reject(err);
    }

    return Promise.resolve(result);
  }

  async function getActiveChapterPage(limit, page, lastPage, userSeq) {
    if (!limit || !page || page > lastPage) {
      const err = new Error("해당 기록이 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    const offset = (page - 1) * limit;
    const result = await historyRepository.selectActiveChapterPage(
      userSeq,
      limit,
      offset
    );

    if (!result.length) {
      const err = new Error("해당 기록이 존재하지 않습니다.");
      err.status = StatusCodes.NOT_FOUND;
      return Promise.reject(err);
    }

    return Promise.resolve(result);
  }

  async function getTotalCount(userSeq) {
    const [rows] = await historyRepository.selectTotalCount(userSeq);
    const result = rows.totalCount;

    return Promise.resolve(result);
  }

  async function getHitCount(categorySeq, chapterNum, userSeq) {
    const [result] = await historyRepository.selectHitCountByChapterNum(
      categorySeq,
      chapterNum,
      userSeq
    );

    if (!result) {
      const err = new Error("해당 기록이 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    return Promise.resolve(result);
  }

  async function getAvgHitCount() {
    const rows = await historyRepository.selectAvgHitCount();
    const mergeRows = [];

    rows.forEach((each) => {
      const index = mergeRows.findIndex(
        (exist) => exist.categorySeq === each.categorySeq
      );

      if (index > -1) {
        mergeRows[index].chapterNumArray = mergeRows[
          index
        ].chapterNumArray.concat({
          chapterNum: each.chapterNum,
          avgHitQuestionCount: each.avgHitQuestionCount,
          questionCount: each.questionCount,
        });
      } else {
        const { categorySeq, ...rest } = each;

        mergeRows.push({
          categorySeq,
          chapterNumArray: [rest],
        });
      }
    });

    const result = mergeRows.map((each) => {
      const { chapterNum, avgHitQuestionCount, questionCount, ...rest } = each;
      return rest;
    });

    return Promise.resolve(result);
  }
};
