"use strict";

const _ = require("lodash");
const Promise = require("bluebird");
const http = require("superagent-promise")(require("superagent"), Promise);

let addHeaders = (httpReq, { idToken }) => {
  httpReq.set("Authorization", idToken);
};

let addBody = (httpReq, body) => {
  httpReq.send(body);
};

let viaHttp = async (relPath, method, opts) => {
  let root = process.env.TEST_ROOT;
  let url = opts.noteId ? `${root}/${relPath}/${opts.noteId}` : `${root}/${relPath}`;
  let httpReq = http(method, url);
  let body = _.get(opts, "body");
  console.log(`invoking via HTTP ${method} ${url}`);
  try {
    addHeaders(httpReq, opts);
    if (body) {
      addBody(httpReq, body);
    }
    let res = await httpReq;
    return {
      statusCode: res.status,
      body: res.body,
      headers: res.headers,
    };
  } catch (err) {
    return {
      statusCode: err.status,
      headers: err.response.headers,
    };
  }
};

exports.we_invoke_createNote = async (opts) => {
  let res = viaHttp("notes", "POST", opts);
  return res;
};

exports.we_invoke_updateNote = async (opts) => {
  let res = viaHttp("notes", "PUT", opts);
  return res;
};

exports.we_invoke_getNotes = async (opts) => {
  let res = viaHttp("notes", "GET", opts);
  return res;
};

exports.we_invoke_deleteNote = async (opts) => {
  let res = viaHttp("notes", "DELETE", opts);
  return res;
};
