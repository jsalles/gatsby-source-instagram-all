"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _gatsbySourceFilesystem = require("gatsby-source-filesystem");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const createInstagramFileNode = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (node, getCache, createNode, createNodeId) {
    // Use the thumbnail for video
    const mediaUrl = node.media_type === "VIDEO" ? node.thumbnail_url : node.media_url;
    let fileNode;
    try {
      fileNode = yield (0, _gatsbySourceFilesystem.createRemoteFileNode)({
        url: mediaUrl,
        parentNodeId: node.id,
        getCache,
        createNode,
        createNodeId
      });
    } catch (e) {
      console.error(e);
    }
    if (fileNode) {
      node.localImage___NODE = fileNode.id; // TODO: remove in the future
      node.localFile___NODE = fileNode.id;
    }
  });
  return function createInstagramFileNode(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

// Create local file node for images and albums
const createInstagramNode = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (node, getCache, createNode, createNodeId) {
    if (node.internal.type === "InstagramContent") {
      yield createInstagramFileNode(node, getCache, createNode, createNodeId);
      if (node.album && node.album.length > 0) {
        yield Promise.all(node.album.map( /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator(function* (albumNode) {
            return createInstagramFileNode(albumNode, getCache, createNode, createNodeId);
          });
          return function (_x9) {
            return _ref3.apply(this, arguments);
          };
        }()));
      }
    }
  });
  return function createInstagramNode(_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}();
var _default = createInstagramNode;
exports.default = _default;