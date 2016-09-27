'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d3Geo = require('d3-geo');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


var PROP_TYPES = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  latitude: _react.PropTypes.number.isRequired,
  longitude: _react.PropTypes.number.isRequired,
  zoom: _react.PropTypes.number.isRequired,
  isDragging: _react.PropTypes.bool.isRequired,
  renderWhileDragging: _react.PropTypes.bool.isRequired,
  globalOpacity: _react.PropTypes.number.isRequired,
  /**
    * An Immutable List of feature objects.
    */
  features: _react.PropTypes.instanceOf(_immutable2.default.List),
  colorDomain: _react.PropTypes.array,
  colorRange: _react.PropTypes.array.isRequired,
  valueAccessor: _react.PropTypes.func.isRequired
};

var DEFAULT_PROPS = {
  renderWhileDragging: true,
  globalOpacity: 1,
  colorDomain: null,
  colorRange: ['#FFFFFF', '#1FBAD6'],
  valueAccessor: function valueAccessor(feature) {
    return feature.get('properties').get('value');
  }
};

var ChoroplethOverlay = function (_Component) {
  _inherits(ChoroplethOverlay, _Component);

  function ChoroplethOverlay() {
    _classCallCheck(this, ChoroplethOverlay);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChoroplethOverlay).apply(this, arguments));
  }

  _createClass(ChoroplethOverlay, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._redraw();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._redraw();
    }
  }, {
    key: '_redraw',
    value: function _redraw() {
      var pixelRatio = _window2.default.devicePixelRatio;
      var canvas = this.refs.overlay;
      var ctx = canvas.getContext('2d');
      var mercator = (0, _viewportMercatorProject2.default)(this.props);

      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      ctx.clearRect(0, 0, this.props.width, this.props.height);

      function projectPoint(lon, lat) {
        var point = mercator.project([lon, lat]);
        /* eslint-disable no-invalid-this */
        this.stream.point(point[0], point[1]);
        /* eslint-enable no-invalid-this */
      }

      if (this.props.renderWhileDragging || !this.props.isDragging) {
        var transform = (0, _d3Geo.geoTransform)({ point: projectPoint });
        var path = (0, _d3Geo.geoPath)().projection(transform).context(ctx);
        this._drawFeatures(ctx, path);
      }
      ctx.restore();
    }
  }, {
    key: '_drawFeatures',
    value: function _drawFeatures(ctx, path) {
      var features = this.props.features;

      if (!features) {
        return;
      }
      var colorDomain = this.props.colorDomain || (0, _d3Array.extent)(features.toArray(), this.props.valueAccessor);

      var colorScale = (0, _d3Scale.scaleLinear)().domain(colorDomain).range(this.props.colorRange).clamp(true);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = features[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var feature = _step.value;

          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = '1';
          ctx.fillStyle = colorScale(this.props.valueAccessor(feature));
          var geometry = feature.get('geometry');
          path({
            type: geometry.get('type'),
            coordinates: geometry.get('coordinates').toJS()
          });
          ctx.fill();
          ctx.stroke();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var pixelRatio = _window2.default.devicePixelRatio || 1;
      return _react2.default.createElement('canvas', {
        ref: 'overlay',
        width: this.props.width * pixelRatio,
        height: this.props.height * pixelRatio,
        style: {
          width: this.props.width + 'px',
          height: this.props.height + 'px',
          position: 'absolute',
          pointerEvents: 'none',
          opacity: this.props.globalOpacity,
          left: 0,
          top: 0
        } });
    }
  }]);

  return ChoroplethOverlay;
}(_react.Component);

exports.default = ChoroplethOverlay;


ChoroplethOverlay.propTypes = PROP_TYPES;
ChoroplethOverlay.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9jaG9yb3BsZXRoLnJlYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW1CQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OzsrZUF6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQVNBLElBQU0sYUFBYTtBQUNqQixTQUFPLGlCQUFVLE1BQVYsQ0FBaUIsVUFEUDtBQUVqQixVQUFRLGlCQUFVLE1BQVYsQ0FBaUIsVUFGUjtBQUdqQixZQUFVLGlCQUFVLE1BQVYsQ0FBaUIsVUFIVjtBQUlqQixhQUFXLGlCQUFVLE1BQVYsQ0FBaUIsVUFKWDtBQUtqQixRQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFMTjtBQU1qQixjQUFZLGlCQUFVLElBQVYsQ0FBZSxVQU5WO0FBT2pCLHVCQUFxQixpQkFBVSxJQUFWLENBQWUsVUFQbkI7QUFRakIsaUJBQWUsaUJBQVUsTUFBVixDQUFpQixVQVJmO0FBU2pCOzs7QUFHQSxZQUFVLGlCQUFVLFVBQVYsQ0FBcUIsb0JBQVUsSUFBL0IsQ0FaTztBQWFqQixlQUFhLGlCQUFVLEtBYk47QUFjakIsY0FBWSxpQkFBVSxLQUFWLENBQWdCLFVBZFg7QUFlakIsaUJBQWUsaUJBQVUsSUFBVixDQUFlO0FBZmIsQ0FBbkI7O0FBa0JBLElBQU0sZ0JBQWdCO0FBQ3BCLHVCQUFxQixJQUREO0FBRXBCLGlCQUFlLENBRks7QUFHcEIsZUFBYSxJQUhPO0FBSXBCLGNBQVksQ0FBQyxTQUFELEVBQVksU0FBWixDQUpRO0FBS3BCLGVBTG9CLHlCQUtOLE9BTE0sRUFLRztBQUNyQixXQUFPLFFBQVEsR0FBUixDQUFZLFlBQVosRUFBMEIsR0FBMUIsQ0FBOEIsT0FBOUIsQ0FBUDtBQUNEO0FBUG1CLENBQXRCOztJQVVxQixpQjs7Ozs7Ozs7Ozs7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QUdOLG9CQUFVLFVBSEo7QUFJTix5QkFBZSxNQUpUO0FBS04sbUJBQVMsS0FBSyxLQUFMLENBQVcsYUFMZDtBQU1OLGdCQUFNLENBTkE7QUFPTixlQUFLO0FBUEMsU0FKVixHQURGO0FBZUQ7Ozs7OztrQkFoRmtCLGlCOzs7QUFtRnJCLGtCQUFrQixTQUFsQixHQUE4QixVQUE5QjtBQUNBLGtCQUFrQixZQUFsQixHQUFpQyxhQUFqQyIsImZpbGUiOiJjaG9yb3BsZXRoLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVmlld3BvcnRNZXJjYXRvciBmcm9tICd2aWV3cG9ydC1tZXJjYXRvci1wcm9qZWN0JztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQge2V4dGVudH0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHtzY2FsZUxpbmVhcn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHtnZW9QYXRoLCBnZW9UcmFuc2Zvcm19IGZyb20gJ2QzLWdlbyc7XG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXRpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsb25naXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgem9vbTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBpc0RyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICByZW5kZXJXaGlsZURyYWdnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBnbG9iYWxPcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIC8qKlxuICAgICogQW4gSW1tdXRhYmxlIExpc3Qgb2YgZmVhdHVyZSBvYmplY3RzLlxuICAgICovXG4gIGZlYXR1cmVzOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihJbW11dGFibGUuTGlzdCksXG4gIGNvbG9yRG9tYWluOiBQcm9wVHlwZXMuYXJyYXksXG4gIGNvbG9yUmFuZ2U6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICB2YWx1ZUFjY2Vzc29yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICByZW5kZXJXaGlsZURyYWdnaW5nOiB0cnVlLFxuICBnbG9iYWxPcGFjaXR5OiAxLFxuICBjb2xvckRvbWFpbjogbnVsbCxcbiAgY29sb3JSYW5nZTogWycjRkZGRkZGJywgJyMxRkJBRDYnXSxcbiAgdmFsdWVBY2Nlc3NvcihmZWF0dXJlKSB7XG4gICAgcmV0dXJuIGZlYXR1cmUuZ2V0KCdwcm9wZXJ0aWVzJykuZ2V0KCd2YWx1ZScpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaG9yb3BsZXRoT3ZlcmxheSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fcmVkcmF3KCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5fcmVkcmF3KCk7XG4gIH1cblxuICBfcmVkcmF3KCkge1xuICAgIGNvbnN0IHBpeGVsUmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnJlZnMub3ZlcmxheTtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb25zdCBtZXJjYXRvciA9IFZpZXdwb3J0TWVyY2F0b3IodGhpcy5wcm9wcyk7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zY2FsZShwaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucHJvcHMud2lkdGgsIHRoaXMucHJvcHMuaGVpZ2h0KTtcblxuICAgIGZ1bmN0aW9uIHByb2plY3RQb2ludChsb24sIGxhdCkge1xuICAgICAgY29uc3QgcG9pbnQgPSBtZXJjYXRvci5wcm9qZWN0KFtsb24sIGxhdF0pO1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8taW52YWxpZC10aGlzICovXG4gICAgICB0aGlzLnN0cmVhbS5wb2ludChwb2ludFswXSwgcG9pbnRbMV0pO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJXaGlsZURyYWdnaW5nIHx8ICF0aGlzLnByb3BzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGdlb1RyYW5zZm9ybSh7cG9pbnQ6IHByb2plY3RQb2ludH0pO1xuICAgICAgY29uc3QgcGF0aCA9IGdlb1BhdGgoKS5wcm9qZWN0aW9uKHRyYW5zZm9ybSkuY29udGV4dChjdHgpO1xuICAgICAgdGhpcy5fZHJhd0ZlYXR1cmVzKGN0eCwgcGF0aCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBfZHJhd0ZlYXR1cmVzKGN0eCwgcGF0aCkge1xuICAgIGNvbnN0IHtmZWF0dXJlc30gPSB0aGlzLnByb3BzO1xuICAgIGlmICghZmVhdHVyZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29sb3JEb21haW4gPSB0aGlzLnByb3BzLmNvbG9yRG9tYWluIHx8XG4gICAgICBleHRlbnQoZmVhdHVyZXMudG9BcnJheSgpLCB0aGlzLnByb3BzLnZhbHVlQWNjZXNzb3IpO1xuXG4gICAgY29uc3QgY29sb3JTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAgIC5kb21haW4oY29sb3JEb21haW4pXG4gICAgICAucmFuZ2UodGhpcy5wcm9wcy5jb2xvclJhbmdlKVxuICAgICAgLmNsYW1wKHRydWUpO1xuXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpJztcbiAgICAgIGN0eC5saW5lV2lkdGggPSAnMSc7XG4gICAgICBjdHguZmlsbFN0eWxlID0gY29sb3JTY2FsZSh0aGlzLnByb3BzLnZhbHVlQWNjZXNzb3IoZmVhdHVyZSkpO1xuICAgICAgY29uc3QgZ2VvbWV0cnkgPSBmZWF0dXJlLmdldCgnZ2VvbWV0cnknKTtcbiAgICAgIHBhdGgoe1xuICAgICAgICB0eXBlOiBnZW9tZXRyeS5nZXQoJ3R5cGUnKSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IGdlb21ldHJ5LmdldCgnY29vcmRpbmF0ZXMnKS50b0pTKClcbiAgICAgIH0pO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgcmV0dXJuIChcbiAgICAgIDxjYW52YXNcbiAgICAgICAgcmVmPVwib3ZlcmxheVwiXG4gICAgICAgIHdpZHRoPXsgdGhpcy5wcm9wcy53aWR0aCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBoZWlnaHQ9eyB0aGlzLnByb3BzLmhlaWdodCAqIHBpeGVsUmF0aW8gfVxuICAgICAgICBzdHlsZT17IHtcbiAgICAgICAgICB3aWR0aDogYCR7dGhpcy5wcm9wcy53aWR0aH1weGAsXG4gICAgICAgICAgaGVpZ2h0OiBgJHt0aGlzLnByb3BzLmhlaWdodH1weGAsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgIG9wYWNpdHk6IHRoaXMucHJvcHMuZ2xvYmFsT3BhY2l0eSxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHRvcDogMFxuICAgICAgICB9IH0vPlxuICAgICk7XG4gIH1cbn1cblxuQ2hvcm9wbGV0aE92ZXJsYXkucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbkNob3JvcGxldGhPdmVybGF5LmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=