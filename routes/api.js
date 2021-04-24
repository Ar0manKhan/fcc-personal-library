'use strict';

module.exports = function (app, model) {

  app.route('/api/books')
    .get(function (_req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      model.find({}, (err, data) => {
        if (err) res.send("Some unexpected error occured, try again");
        else res.send(data);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send("missing required field title");
        return;
      }

      const new_book = new model({ title });

      new_book.save((err, data) => {
        if (err) res.send("Some unexpected error occured, try again");
        else res.json({ _id: data._id, title });
      });
    })

    .delete(function (_req, res) {
      //if successful response will be 'complete delete successful'
      model.deleteMany({}, (err, _data) => {
        if (err) res.send("Some unexpected error occured, try again");
        else res.send("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      model.findById(bookid, (err, data) => {
        if (err || !data) res.send("no book exists");
        else res.send(data);
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) res.send("missing required field comment");
      else model.findByIdAndUpdate(bookid, {
        $inc: { commentcount: 1 },
        $push: { comments: comment }
      }, { new: true }, (err, data) => {
        if (err || !data) res.send("no book exists");
        else res.send(data);
      });
    })

    .delete(function (req, _res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      model.findByIdAndRemove(bookid, (err, data) => {
        if (err || !data) res.send("no book exists");
        else res.send("delete successful");
      });
    });
};
