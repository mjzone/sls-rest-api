"use strict";
let init = require("./steps/init");
let { an_authenticated_user } = require("./steps/given");
let { we_invoke_createNote, we_invoke_updateNote, we_invoke_getNotes, we_invoke_deleteNote } = require("./steps/when");
describe(`Given an authenticated user`, () => {
  let idToken;
  beforeAll(async () => {
    init();
    let user = await an_authenticated_user();
    idToken = user.AuthenticationResult.IdToken;
  });

  describe(`When we invoke the POST /notes endpoint`, () => {
    it(`Should create a new note`, async () => {
      const body = {
        id: "304",
        title: "My test note",
        body: "hello test body!",
      };
      let res = await we_invoke_createNote({ idToken, body });
      expect(res.statusCode).toEqual(201);
      expect(res.body).not.toBeNull();
    });
  });

  describe(`When we invoke the PUT /notes/:id endpoint`, () => {
    it(`Should update the note`, async () => {
      const noteId = "304";
      const body = {
        title: "My test note updated",
        body: "hello test updated body!",
      };
      let res = await we_invoke_updateNote({ idToken, body, noteId });
      expect(res.statusCode).toEqual(200);
      expect(res.body).not.toBeNull();
    });
  });

  describe(`When we invoke the DELETE /notes/:id endpoint`, () => {
    it(`Should delete the note`, async () => {
      const noteId = "304";
      let res = await we_invoke_deleteNote({ idToken, noteId });
      expect(res.statusCode).toEqual(200);
      expect(res.body).not.toBeNull();
    });
  });
});
