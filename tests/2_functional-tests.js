/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

//
const requester = chai.request(server).keepOpen();
//

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });*/
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        requester
        .post("/api/books")
        .send({title: "test"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, "test");
          assert.isDefined(res.body["_id"]);
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        requester
        .post("/api/books")
        .send({title: ""})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title");
          done();
        });
      });
    });


    suite('GET /api/books => array of books', function(){
      test('Test GET /api/books',  function(done){
        requester
        .get("/api/books")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 1);
          assert.equal(Object.keys(res.body[0]).join(""),"_idtitlecommentscommentcount");
          done();
        });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      test('Test GET /api/books/[id] with id not in db',  function(done){
        requester
        .get("/api/books/123456789012")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        requester
        .get("/api/books")
        .end((err, arr) => {
          let id = arr.body[Math.floor(Math.random()*arr.body.length)]["_id"];
          requester
          .get(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(Object.keys(res.body).join(""),"_idtitlecommentscommentcount");
            done();
          });
        });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      test('Test POST /api/books/[id] with comment', function(done){
        requester
        .get("/api/books")
        .end((err, arr) => {
          let id = arr.body[Math.floor(Math.random()*arr.body.length)]["_id"];
          let comment = "test7";
          requester
          .post(`/api/books/${id}`)
          .send({comment: comment})
          .end((err, res) => {
            assert.equal(Object.keys(res.body).join(""),"_idtitlecommentscommentcount");
            assert.isAtLeast(res.body.commentcount, 1);
            assert.isTrue(res.body.comments.includes(comment));
            done();
          });
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        requester
        .post("/api/books/123456789012")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field comment");
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        requester
        .post("/api/books/123456789012")
        .send({comment: "test"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        });
      });
    });


    suite('DELETE /api/books/[id] => delete book object id', function() {
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        requester
        .get("/api/books")
        .end((err, arr) => {
          let id = arr.body[Math.floor(Math.random()*arr.body.length)]["_id"];
          let comment = "test7";
          requester
          .delete(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.text ,"delete successful");
            done();
          });
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        requester
        .delete("/api/books/123456789012")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        });
      });
    });
  });
});