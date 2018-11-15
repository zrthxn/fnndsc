import { expect } from 'chai';
import Request from './request';
import { FeedList } from './feed';

// http://sinonjs.org/releases/v5.1.0/fake-xhr-and-server/

describe('Resource', () => {
  const username = 'cube';
  const password = 'cube1234';
  const chrisUrl = 'http://localhost:8000/api/v1/';
  const auth = { username: username, password: password };
  //const auth = {token: "d757da9c364fdc92368b90392559e0de78f54f02"};
  let commentListRes;

  before(() => {
    return new Promise(function(resolve, reject) {
      Request.runAsyncTask(function*() {
        let feedListRes = new FeedList(chrisUrl, auth);
        try {
          feedListRes = yield feedListRes.get();
          const feedItem = feedListRes.getItems().filter(item => {
            return item.data.id === 1;
          })[0];
          commentListRes = yield feedItem.getComments();
          commentListRes = yield commentListRes.post({
            title: 'Test comment',
            content: 'Test comment content',
          });
          commentListRes = yield commentListRes.get();
        } catch (ex) {
          reject(ex);
          return;
        }
        resolve(commentListRes);
      });
    });
  });

  describe('Comment', () => {
    let commentItem;

    beforeEach(() => {
      // get the plugin instance with id 1
      commentItem = commentListRes.getItems()[0].clone();
    });

    it('can modify this comment item resource through a REST API PUT request', done => {
      const data = {
        title: 'PUT test comment',
        content: 'PUT test comment content',
      };

      const result = commentItem.put(data);

      result
        .then(commentItem => {
          expect(commentItem.data.title).to.equal(data.title);
          expect(commentItem.data.content).to.equal(data.content);
        })
        .then(done, done);
    });

    /*it('can delete this comment item resource through a REST API PUT request', done => {

      const result = commentItem.delete();

      result
        .then(commentItem => {
          expect(commentItem).to.be.a('null');
        })
        .then(done, done);
    });*/
  });

  describe('CommentList', () => {
    let commentList;

    beforeEach(() => {
      commentList = commentListRes.clone();
    });

    it('can create a new comment item resource through a REST API POST request', done => {
      const data = {
        title: 'POST test comment',
        content: 'POST test comment content',
      };

      const result = commentList.post(data);

      result
        .then(commentList => {
          const createdCommentItem = commentList.getItems()[0];
          expect(createdCommentItem.data.title).to.equal(data.title);
          expect(createdCommentItem.data.content).to.equal(data.content);
        })
        .then(done, done);
    });
  });
});
