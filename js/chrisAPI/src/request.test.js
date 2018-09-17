import Request from './request';
import RequestException from './exception';
import { expect } from 'chai';

// http://sinonjs.org/releases/v5.1.0/fake-xhr-and-server/

describe('Request', () => {

  let req;
  const chrisUrl = 'http://localhost:8000/api/v1/';
  const auth = {
    username: 'cube',
    password: 'cube1234',
  };
  const contentType = 'application/vnd.collection+json';

  beforeEach(() => {
    req = new Request(auth, contentType);
  });

  it('can make authenticated GET request', done => {
    const result = req.get(chrisUrl);

    result
      .then(response => {
        expect(response.collection.links).to.have.lengthOf.at.least(1);
      })
      .then(done, done);
  });

  it('can report unsuccessfull authenticated GET request', done => {
    const result = req.get(chrisUrl + '1test/');

    result
      .catch(error => {
        expect(error).to.be.an.instanceof(RequestException);
      })
      .then(done, done);
  });

  it('can make authenticated multipart POST request and DELETE request', done => {
    const data = {
      upload_path: "/test.txt",
    };
    const fileContent = "This is a test file";
    const fileData = JSON.stringify(fileContent);
    const dfile = new Blob([fileData], { type: 'application/json' });

    const result = req.post(chrisUrl + 'uploadedfiles/', data, dfile);

    result
      .then(response => {
        const path = response.collection.items[0].data.filter(descriptor => {
          return descriptor.name === 'upload_path';
        })[0].value;

        expect(path).to.equal(data.upload_path);

        // now delete the file
        const url = response.collection.items[0].href;
        return req.delete(url); // pass rejection or fulfilment down the promise chain
      })
      .then(done, done);
  });

  /*it('can make authenticated DELETE request', done => {
    const result = req.delete(chrisUrl + '1/');

    result
      .then(response => {
          window.console.log('delete response: ', response);
      })
      .then(done, done);
  });*/
});