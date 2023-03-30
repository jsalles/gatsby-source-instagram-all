"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _queryString = _interopRequireDefault(require("query-string"));
var _createInstagramNode = _interopRequireDefault(require("./createInstagramNode"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const defaultOptions = {
  limit: Infinity,
  pageLimit: 30
};
function sourceNodes(_x, _x2) {
  return _sourceNodes.apply(this, arguments);
}
function _sourceNodes() {
  _sourceNodes = _asyncToGenerator(function* ({
    actions,
    createNodeId,
    getCache
  }, configOptions) {
    const createNode = actions.createNode;
    delete configOptions.plugins;
    const config = _objectSpread(_objectSpread({}, defaultOptions), configOptions);
    const limit = config.limit,
      account_id = config.account_id;
    const apiOptions = _queryString.default.stringify({
      limit: config.pageLimit,
      access_token: config.access_token
    });
    const apiUrl = `https://graph.facebook.com/v16.0/${account_id}/media?fields=id,media_url,media_type,permalink,timestamp,caption,username,thumbnail_url,children{id,media_url,media_type,thumbnail_url,timestamp}&${apiOptions}`;

    // Helper function to fetch and parse data to JSON
    const fetchAndParse = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (api) {
        const data = yield (0, _nodeFetch.default)(api);
        const response = yield data.json();
        return response;
      });
      return function fetchAndParse(_x3) {
        return _ref.apply(this, arguments);
      };
    }();

    // Recursively get data from Instagram api
    const getData = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* (url, data = []) {
        var _response$paging;
        let response = yield fetchAndParse(url);
        if (response.error !== undefined) {
          console.error("\nINSTAGRAM API ERROR: ", response.error.message);
          return data;
        }
        data = data.concat(response.data);
        let next_url = response === null || response === void 0 ? void 0 : (_response$paging = response.paging) === null || _response$paging === void 0 ? void 0 : _response$paging.next;
        if (data.length < limit && next_url) {
          return getData(next_url, data);
        }
        return data;
      });
      return function getData(_x4) {
        return _ref2.apply(this, arguments);
      };
    }();

    // Create nodes
    const createNodes = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(function* (API) {
        let data = yield getData(API).then(res => res);
        if (data.length > limit) {
          data = data.slice(0, limit);
        }
        var _iterator = _createForOfIteratorHelper(data),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            const item = _step.value;
            if (item.id !== undefined && ["IMAGE", "CAROUSEL_ALBUM", "VIDEO"].includes(item.media_type)) {
              const nodeData = yield processMedia(item);
              createNode(nodeData);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
      return function createNodes(_x5) {
        return _ref3.apply(this, arguments);
      };
    }();

    // Processes a media to match Gatsby's node structure
    const processMedia = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(function* (media) {
        media.album = media.children && media.children.data.length && media.children.data.map(node => node);
        const nodeId = createNodeId(`instagram-media-${media.id}`);
        const nodeContent = JSON.stringify(media);
        const nodeContentDigest = _crypto.default.createHash("md5").update(nodeContent).digest("hex");
        const nodeData = Object.assign({}, media, {
          id: nodeId,
          media_id: media.id,
          parent: null,
          children: [],
          internal: {
            type: `InstagramContent`,
            content: nodeContent,
            contentDigest: nodeContentDigest
          }
        });

        // Create local image node
        yield (0, _createInstagramNode.default)(nodeData, getCache, createNode, createNodeId);
        return nodeData;
      });
      return function processMedia(_x6) {
        return _ref4.apply(this, arguments);
      };
    }();
    return createNodes(apiUrl);
  });
  return _sourceNodes.apply(this, arguments);
}
var _default = sourceNodes;
exports.default = _default;