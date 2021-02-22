/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const {MongoClient} = require("mongodb");
const {ObjectID} = require('mongodb');
const client = MongoClient(process.env.DB);
const project = "fcc-project-library";
const collection = "books";


module.exports = function (app) {
  const nond_arr = [undefined,"",NaN,null];
  const notfound = "no book exists";

  app.route('/api/books')
    .get(function (req, res){
      client.connect((err, database) => {
        const db = database.db(project);
        db.collection(collection).find({}).toArray((err,result) => {
          res.send(result);
        });
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (nond_arr.includes(title)) {
        res.send("missing required field title");
      } else {
        client.connect((err, database) => {
          const db = database.db(project);
          db.collection(collection).insertOne({
            title: title,
            comments: [],
            commentcount: 0
          }, (err, obj) => {
            const result = obj.ops[0];
            res.json({title:result.title, _id:result["_id"]});
          });
        });
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      client.connect((err, database) => {
        const db = database.db(project);
        db.collection(collection).deleteMany({}, (err,obj) => {
          res.send("complete delete successful");
        });
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      try {
        var bookid = new ObjectID(req.params.id);
      } catch {
        res.send(notfound);
        return 0;
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      client.connect((err, database) => {
        const db = database.db(project);
        db.collection(collection).findOne({
          _id: bookid
        }, (err,obj) => {
          if (obj === null) {
            res.send(notfound);
          } else {
            res.json(obj);
          }
        });
      });
    })
    
    .post(function(req, res){
      let comment = req.body.comment;
      if (nond_arr.includes(comment)) {
        res.send("missing required field comment");
      } else {
        try {
          var bookid = new ObjectID(req.params.id);
        } catch {
          res.send(notfound);
          return 0;
        }
        client.connect((err, database) => {
          const db = database.db(project);
          db.collection(collection).findOneAndUpdate({
            _id: bookid
          }, {
            $push: {comments: comment},
            $inc: {commentcount: 1}
          }, 
          {returnOriginal: false}, 
          (err, obj) => {
            if (obj.value === null) {
              res.send(notfound);
            } else {
              res.json(obj.value);
            }
          });
        });
      }
    })
    
    .delete(function(req, res){
      try {
        var bookid = new ObjectID(req.params.id);
      } catch {
        res.send(notfound);
        return 0;
      }
      //if successful response will be 'delete successful'
      client.connect((err, database) => {
        const db = database.db(project);
        db.collection(collection).deleteOne({
          _id: bookid
        }, (err,obj) => {
          if (obj.deletedCount==0) {
            res.send(notfound);
          } else {
            res.send("delete successful");
          }
        });
      });
    });
};