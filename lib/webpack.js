'use strict';

var fs = require('fs');

var path = require('path');

var url = require('url');

function buildManifest(compiler, compilation) {
  var context = compiler.options.context;
  var manifest = {};

  for (var _iterator = compilation.chunkGroups, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var chunkGroup = _ref;
    var files = [];

    for (var _iterator2 = chunkGroup.chunks, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var chunk = _ref2;

      for (var _iterator4 = chunk.files, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray4) {
          if (_i4 >= _iterator4.length) break;
          _ref4 = _iterator4[_i4++];
        } else {
          _i4 = _iterator4.next();
          if (_i4.done) break;
          _ref4 = _i4.value;
        }

        var file = _ref4;
        var publicPath = url.resolve(compilation.outputOptions.publicPath || '', file);
        files.push({
          file: file,
          publicPath: publicPath,
          chunkName: chunk.name
        });
      }
    }

    var _loop = function _loop() {
      if (_isArray3) {
        if (_i3 >= _iterator3.length) return "break";
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) return "break";
        _ref3 = _i3.value;
      }

      var block = _ref3;
      var name = void 0;
      var id = null;
      var dependency = block.module.dependencies.find(function (dep) {
        return block.request === dep.request;
      });

      if (dependency) {
        var module = dependency.module;
        id = module.id;
        name = typeof module.libIdent === 'function' ? module.libIdent({
          context: context
        }) : null;
      }

      for (var _i5 = 0; _i5 < files.length; _i5++) {
        var _file = files[_i5];
        _file.id = id;
        _file.name = name;
      }

      manifest[block.request] = files;
    };

    for (var _iterator3 = chunkGroup.blocksIterable, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      var _ret = _loop();

      if (_ret === "break") break;
    }
  }

  return manifest;
}

var ReactLoadablePlugin =
/*#__PURE__*/
function () {
  function ReactLoadablePlugin(opts) {
    if (opts === void 0) {
      opts = {};
    }

    this.filename = opts.filename;
  }

  var _proto = ReactLoadablePlugin.prototype;

  _proto.apply = function apply(compiler) {
    var _this = this;

    var emit = function emit(compilation, callback) {
      var manifest = buildManifest(compiler, compilation);
      var json = JSON.stringify(manifest, null, 2);
      compilation.assets[_this.filename] = {
        source: function source() {
          return json;
        },
        size: function size() {
          return json.length;
        }
      };
      callback();
    };

    if (compiler.hooks) {
      var plugin = {
        name: 'ReactLoadablePlugin'
      };
      compiler.hooks.emit.tapAsync(plugin, emit);
    } else {
      compiler.plugin('emit', emit);
    }
  };

  return ReactLoadablePlugin;
}();

function getBundles(manifest, moduleIds) {
  return moduleIds.reduce(function (bundles, moduleId) {
    return bundles.concat(manifest[moduleId]);
  }, []);
}

exports.ReactLoadablePlugin = ReactLoadablePlugin;
exports.getBundles = getBundles;