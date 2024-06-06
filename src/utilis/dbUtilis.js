const { connection } = require("../dbConfig/db");
const moment = require("moment");
exports.uploadImagesDbutilis = async (imgData) => {
  try {
    var now = moment().format("YYYY-MM-DD HH:mm:ss");
    let sql = `Insert into images_tb (image_url, created_at, updated_at) Values(?,?,?);`;
    let result = await connection.query(sql, [imgData.filename, now, now]);
    if (result[0].affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.fetchImageDetails = async () => {
  try {
    let sql = `Select * from images_tb as itb;`;
    let result = await connection.query(sql);
    return result[0];
  } catch (error) {
    console.error(error);
    return [];
  }
};
exports.updateImageStatusDbutilis = async (image_id, user_ip) => {
  try {
    var now = moment().format("YYYY-MM-DD HH:mm:ss");
    var currentDate = moment().format("YYYY-MM-DD");
    console.log("~~~~~~~~~~~~>>>>>", currentDate);
    let todayStart = `${currentDate} 00:00:00`,
      todayEnd = `${currentDate} 23:59:59`;
    console.log(todayStart, todayEnd);
    let checkAlreadyExistUserIp = `Select * from image_status_tb where image_id =? and user_ip = ? and created_at >= ? and created_at <= ?;`;
    let checkAlreadyExistUserIpResult = await connection.query(
      checkAlreadyExistUserIp,
      [image_id, user_ip, todayStart, todayEnd]
    );
    console.log(checkAlreadyExistUserIpResult[0].length);
    if (checkAlreadyExistUserIpResult[0].length > 0) {
      let updateSql = `Update image_status_tb set hits_count = ? where image_id =? and user_ip = ? and created_at >= ? and created_at <= ?;`;
      let result = await connection.query(updateSql, [
        checkAlreadyExistUserIpResult[0][0].hits_count + 1,
        image_id,
        user_ip,
        todayStart,
        todayEnd,
      ]);
      if (result[0].affectedRows > 0) {
        return true;
      }
      return false;
    } else {
      let sql = `Insert into image_status_tb (image_id, user_ip, created_at,updated_at,hits_count) Values(?,?,?,?,?);`;
      let result = await connection.query(sql, [
        image_id,
        user_ip,
        todayStart,
        todayStart,
        1,
      ]);
      if (result[0].affectedRows > 0) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
exports.fetchImageDetailsDbUtilis = async (id, date_start, date_end) => {
  try {
    let sql1 = `Select * from images_tb where id = ${id}`;
    let result1 = await connection.query(sql1, [id]);
    let condition = "",
      condition1 = "";
    if (date_start && date_end) {
      condition += ` and istb.created_at >= '${date_start}' and istb.created_at <= '${date_end}'`;
      condition1 += ` and c.created_at >= '${date_start}' and c.created_at <= '${date_end}' or r.created_at >= '${date_start}' and r.created_at <= '${date_end}'`;
    }
    let sql = `Select count(distinct istb.user_ip) as totalCount, Sum( istb.hits_count ) as hits_count, istb.created_at, DATE_FORMAT(istb.created_at, '%Y-%m-%d') AS DAY from images_tb as itb left join image_status_tb as istb on itb.id = istb.image_id where itb.id = ? ${condition} GROUP BY DATE_FORMAT(istb.created_at, '%Y-%m-%d')`;

    let sql2 = `SELECT img.id, img.image_url, c.id as comment_id, c.comments, r.id as reply_id,  c.user_email , r.reply_text, r.replier, r.parent_id, r.created_at as replies_created_at , c.created_at as comments_created_at, DATE_FORMAT(c.created_at, '%Y-%m-%d') AS DAY
    FROM images_tb img
    LEFT JOIN comments c ON c.image_id = img.id
    LEFT JOIN replies r ON r.comments_id = c.id
    WHERE img.id = ? ${condition1} GROUP BY DATE_FORMAT(c.created_at, '%Y-%m-%d')`;
    console.log(sql2);
    let result2 = await connection.query(sql2, [id]);
    console.log("~~~~~~~~~~~~~~~~~`", result2);
    let returnData = await processData(result2[0]);
    let result = await connection.query(sql, [id]);
    console.log(result[0]);
    let data = {
      id: result1[0][0].id,
      image_url: result1[0][0].image_url,
      details: result[0].map((res) => {
        delete res.created_at;
        res.hits_count = res.hits_count ? res.hits_count * 1 : 0;
        return res;
      }),
      comments: returnData[0]?.comments ? returnData[0]?.comments : [],
    };
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

exports.fetchImageDetailsDbUtilisByUser = async (id) => {
  try {
    let sql1 = `SELECT img.id, img.image_url, c.id as comment_id, c.comments, r.id as reply_id, c.user_email ,r.reply_text, r.replier, r.parent_id,  r.created_at as replies_created_at , c.created_at as comments_created_at
    FROM images_tb img
    LEFT JOIN comments c ON c.image_id = img.id
    LEFT JOIN replies r ON r.comments_id = c.id
    WHERE img.id = ?`;
    let result1 = await connection.query(sql1, [id]);
    let data = processData(result1[0]);
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

exports.insertCommentsInImages = async (commentData) => {
  try {
    console.log(commentData);
    var now = moment().format("YYYY-MM-DD HH:mm:ss");
    let sql = `Insert into comments (comments, user_email, image_id, created_at, updated_at) Values (?,?,?,?,?);`;
    let result = await connection.query(sql, [
      commentData.comment,
      commentData.commenter,
      commentData.image_id,
      now,
      now,
    ]);
    console.log(result);
    if (result[0].affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return {};
  }
};
exports.insertRepliesOnCommentsInImages = async (replyData) => {
  try {
    console.log(replyData);
    var now = moment().format("YYYY-MM-DD HH:mm:ss");
    let sql = `Insert into replies (comments_id	,parent_id,	replier, reply_text,created_at,	updated_at) Values (?,?,?,?,?,?);`;
    let result = await connection.query(sql, [
      replyData?.comment_id,
      replyData?.parent_id ? replyData?.parent_id : null,
      replyData?.replier,
      replyData?.reply,
      now,
      now,
    ]);
    console.log(result);
    if (result[0].affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const processData = (data) => {
  const result = {};
  data.forEach((row) => {
    const {
      id,
      image_url,
      comment_id,
      comments,
      reply_id,

      reply_text,
      replier,
      user_email,
      parent_id,
      comments_created_at,
      replies_created_at,
      DAY,
    } = row;

    if (!result[id]) {
      result[id] = {
        id,
        image_url,
        comments: [],
      };
    }

    const existingComment = result[id].comments.find(
      (comment) => comment.id === comment_id
    );

    if (!existingComment) {
      const newComment = {
        id: comment_id,
        comments,
        user_email,
        comments_created_at: comments_created_at,
        DAY: DAY,
        replies: [],
      };

      if (reply_id) {
        addReplyToComment(
          newComment.replies,
          reply_id,
          reply_text,
          replier,
          parent_id,
          replies_created_at,
          DAY
        );
      }
      result[id].comments.push(newComment);
    } else {
      if (reply_id) {
        addReplyToComment(
          existingComment.replies,
          reply_id,
          reply_text,
          replier,
          parent_id,
          replies_created_at,
          DAY
        );
      }
    }
  });

  function addReplyToComment(
    repliesArray,
    reply_id,
    reply_text,
    replier,
    parent_id,
    replies_created_at,
    DAY
  ) {
    const parentReply = findParentReply(repliesArray, parent_id);
    if (parentReply) {
      addReplyToComment(
        parentReply.inner_replies,
        reply_id,
        reply_text,
        replier,
        null,
        replies_created_at,
        DAY
      );
    } else {
      repliesArray.push({
        id: reply_id,
        reply: reply_text,
        replier,
        replies_created_at: replies_created_at,
        DAY: DAY,
        inner_replies: [],
      });
    }
  }

  function findParentReply(repliesArray, parent_id) {
    for (const reply of repliesArray) {
      if (reply.id === parent_id) {
        return reply;
      }
      const parentReply = findParentReply(reply.inner_replies, parent_id);
      if (parentReply) {
        return parentReply;
      }
    }
    return null;
  }

  return Object.values(result);
};

exports.insertUserDetailsInDb = async (name, user_email, pass) => {
  try {
    var now = moment().format("YYYY-MM-DD HH:mm:ss");
    let sql = `Insert into user_tb (name,	user_email,	password,	created_at,	updated_at) Values(?,?,?,?,?);`;
    let result = await connection.query(sql, [
      name,
      user_email,
      pass,
      now,
      now,
    ]);
    if (result[0].affectedRows > 0) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

exports.getAlreadyRegisteredUser = async (email) => {
  try {
    let sql = `Select * from user_tb where user_email = ?`;
    let result = await connection.query(sql, [email]);
    return result[0];
  } catch (error) {
    console.log(error);
    return false;
  }
};
