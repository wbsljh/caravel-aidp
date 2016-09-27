'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // Copyright (c) 2015 Uber Technologies, Inc.

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _svgTransform = require('svg-transform');

var _svgTransform2 = _interopRequireDefault(_svgTransform);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function noop() {}

function mouse(container, event) {
  var rect = container.getBoundingClientRect();
  var x = event.clientX - rect.left - container.clientLeft;
  var y = event.clientY - rect.top - container.clientTop;
  return [x, y];
}

var PROP_TYPES = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  latitude: _react.PropTypes.number.isRequired,
  longitude: _react.PropTypes.number.isRequired,
  zoom: _react.PropTypes.number.isRequired,
  points: _react.PropTypes.instanceOf(_immutable2.default.List).isRequired,
  isDragging: _react.PropTypes.bool.isRequired,
  keyAccessor: _react.PropTypes.func.isRequired,
  lngLatAccessor: _react.PropTypes.func.isRequired,
  onAddPoint: _react.PropTypes.func.isRequired,
  onUpdatePoint: _react.PropTypes.func.isRequired,
  renderPoint: _react.PropTypes.func.isRequired
};

var DEFAULT_PROPS = {
  keyAccessor: function keyAccessor(point) {
    return point.get('id');
  },
  lngLatAccessor: function lngLatAccessor(point) {
    return point.get('location').toArray();
  },

  onAddPoint: noop,
  onUpdatePoint: noop,
  renderPoint: noop,
  isDragging: false
};

var DraggablePointsOverlay = (_class = function (_Component) {
  _inherits(DraggablePointsOverlay, _Component);

  function DraggablePointsOverlay(props) {
    _classCallCheck(this, DraggablePointsOverlay);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DraggablePointsOverlay).call(this, props));

    _this.state = {
      draggedPointKey: null
    };
    return _this;
  }

  _createClass(DraggablePointsOverlay, [{
    key: '_onDragStart',
    value: function _onDragStart(point, event) {
      event.stopPropagation();
      _document2.default.addEventListener('mousemove', this._onDrag, false);
      _document2.default.addEventListener('mouseup', this._onDragEnd, false);
      this.setState({ draggedPointKey: this.props.keyAccessor(point) });
    }
  }, {
    key: '_onDrag',
    value: function _onDrag(event) {
      event.stopPropagation();
      var pixel = mouse(this.refs.container, event);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      var lngLat = mercator.unproject(pixel);
      var key = this.state.draggedPointKey;
      this.props.onUpdatePoint({ key: key, location: lngLat });
    }
  }, {
    key: '_onDragEnd',
    value: function _onDragEnd(event) {
      event.stopPropagation();
      _document2.default.removeEventListener('mousemove', this._onDrag, false);
      _document2.default.removeEventListener('mouseup', this._onDragEnd, false);
      this.setState({ draggedPoint: null });
    }
  }, {
    key: '_addPoint',
    value: function _addPoint(event) {
      event.stopPropagation();
      event.preventDefault();
      var pixel = mouse(this.refs.container, event);
      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      this.props.onAddPoint(mercator.unproject(pixel));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var points = _props.points;
      var width = _props.width;
      var height = _props.height;
      var isDragging = _props.isDragging;
      var style = _props.style;

      var mercator = (0, _viewportMercatorProject2.default)(this.props);
      return _react2.default.createElement(
        'svg',
        {
          ref: 'container',
          width: width,
          height: height,
          style: _extends({
            pointerEvents: 'all',
            position: 'absolute',
            left: 0,
            top: 0,
            cursor: isDragging ? _config2.default.CURSOR.GRABBING : _config2.default.CURSOR.GRAB
          }, style),
          onContextMenu: this._addPoint },
        _react2.default.createElement(
          'g',
          { style: { cursor: 'pointer' } },
          points.map(function (point, index) {
            var pixel = mercator.project(_this2.props.lngLatAccessor(point));
            return _react2.default.createElement(
              'g',
              {
                key: index,
                style: { pointerEvents: 'all' },
                transform: (0, _svgTransform2.default)([{ translate: pixel }]),
                onMouseDown: _this2._onDragStart.bind(_this2, point) },
              _this2.props.renderPoint.call(_this2, point, pixel)
            );
          })
        )
      );
    }
  }]);

  return DraggablePointsOverlay;
}(_react.Component), (_applyDecoratedDescriptor(_class.prototype, '_onDragStart', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onDragStart'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onDragEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onDragEnd'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_addPoint', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_addPoint'), _class.prototype)), _class);
exports.default = DraggablePointsOverlay;


DraggablePointsOverlay.propTypes = PROP_TYPES;
DraggablePointsOverlay.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5cy9kcmFnZ2FibGUtcG9pbnRzLnJlYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzJCQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVMsSUFBVCxHQUFnQixDQUFFOztBQUVsQixTQUFTLEtBQVQsQ0FBZSxTQUFmLEVBQTBCLEtBQTFCLEVBQWlDO0FBQy9CLE1BQU0sT0FBTyxVQUFVLHFCQUFWLEVBQWI7QUFDQSxNQUFNLElBQUksTUFBTSxPQUFOLEdBQWdCLEtBQUssSUFBckIsR0FBNEIsVUFBVSxVQUFoRDtBQUNBLE1BQU0sSUFBSSxNQUFNLE9BQU4sR0FBZ0IsS0FBSyxHQUFyQixHQUEyQixVQUFVLFNBQS9DO0FBQ0EsU0FBTyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVA7QUFDRDs7QUFFRCxJQUFNLGFBQWE7QUFDakIsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBRFA7QUFFakIsVUFBUSxpQkFBVSxNQUFWLENBQWlCLFVBRlI7QUFHakIsWUFBVSxpQkFBVSxNQUFWLENBQWlCLFVBSFY7QUFJakIsYUFBVyxpQkFBVSxNQUFWLENBQWlCLFVBSlg7QUFLakIsUUFBTSxpQkFBVSxNQUFWLENBQWlCLFVBTE47QUFNakIsVUFBUSxpQkFBVSxVQUFWLENBQXFCLG9CQUFVLElBQS9CLEVBQXFDLFVBTjVCO0FBT2pCLGNBQVksaUJBQVUsSUFBVixDQUFlLFVBUFY7QUFRakIsZUFBYSxpQkFBVSxJQUFWLENBQWUsVUFSWDtBQVNqQixrQkFBZ0IsaUJBQVUsSUFBVixDQUFlLFVBVGQ7QUFVakIsY0FBWSxpQkFBVSxJQUFWLENB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QjtBQWNFO0FBQUE7QUFBQSxZQUFHLE9BQVEsRUFBQyxRQUFRLFNBQVQsRUFBWDtBQUVFLGlCQUFPLEdBQVAsQ0FBVyxVQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWtCO0FBQzNCLGdCQUFNLFFBQVEsU0FBUyxPQUFULENBQWlCLE9BQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsS0FBMUIsQ0FBakIsQ0FBZDtBQUNBLG1CQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFNLEtBRFI7QUFFRSx1QkFBUSxFQUFDLGVBQWUsS0FBaEIsRUFGVjtBQUdFLDJCQUFZLDRCQUFVLENBQUMsRUFBQyxXQUFXLEtBQVosRUFBRCxDQUFWLENBSGQ7QUFJRSw2QkFBYyxPQUFLLFlBQUwsQ0FBa0IsSUFBbEIsU0FBNkIsS0FBN0IsQ0FKaEI7QUFNSSxxQkFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixJQUF2QixTQUFrQyxLQUFsQyxFQUF5QyxLQUF6QztBQU5KLGFBREY7QUFXRCxXQWJEO0FBRkY7QUFkRixPQURGO0FBbUNEOzs7OztrQkFsRmtCLHNCOzs7QUFxRnJCLHVCQUF1QixTQUF2QixHQUFtQyxVQUFuQztBQUNBLHVCQUF1QixZQUF2QixHQUFzQyxhQUF0QyIsImZpbGUiOiJkcmFnZ2FibGUtcG9pbnRzLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzLCBDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBhdXRvYmluZCBmcm9tICdhdXRvYmluZC1kZWNvcmF0b3InO1xuXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XG5cbmltcG9ydCB0cmFuc2Zvcm0gZnJvbSAnc3ZnLXRyYW5zZm9ybSc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuZnVuY3Rpb24gbW91c2UoY29udGFpbmVyLCBldmVudCkge1xuICBjb25zdCByZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCAtIGNvbnRhaW5lci5jbGllbnRMZWZ0O1xuICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gY29udGFpbmVyLmNsaWVudFRvcDtcbiAgcmV0dXJuIFt4LCB5XTtcbn1cblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxhdGl0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxvbmdpdHVkZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB6b29tOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHBvaW50czogUHJvcFR5cGVzLmluc3RhbmNlT2YoSW1tdXRhYmxlLkxpc3QpLmlzUmVxdWlyZWQsXG4gIGlzRHJhZ2dpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGtleUFjY2Vzc29yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsbmdMYXRBY2Nlc3NvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25BZGRQb2ludDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25VcGRhdGVQb2ludDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVuZGVyUG9pbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIGtleUFjY2Vzc29yKHBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmdldCgnaWQnKTtcbiAgfSxcbiAgbG5nTGF0QWNjZXNzb3IocG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuZ2V0KCdsb2NhdGlvbicpLnRvQXJyYXkoKTtcbiAgfSxcbiAgb25BZGRQb2ludDogbm9vcCxcbiAgb25VcGRhdGVQb2ludDogbm9vcCxcbiAgcmVuZGVyUG9pbnQ6IG5vb3AsXG4gIGlzRHJhZ2dpbmc6IGZhbHNlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmFnZ2FibGVQb2ludHNPdmVybGF5IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZHJhZ2dlZFBvaW50S2V5OiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25EcmFnU3RhcnQocG9pbnQsIGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25EcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uRHJhZ0VuZCwgZmFsc2UpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdnZWRQb2ludEtleTogdGhpcy5wcm9wcy5rZXlBY2Nlc3Nvcihwb2ludCl9KTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25EcmFnKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgcGl4ZWwgPSBtb3VzZSh0aGlzLnJlZnMuY29udGFpbmVyLCBldmVudCk7XG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIGNvbnN0IGxuZ0xhdCA9IG1lcmNhdG9yLnVucHJvamVjdChwaXhlbCk7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5zdGF0ZS5kcmFnZ2VkUG9pbnRLZXk7XG4gICAgdGhpcy5wcm9wcy5vblVwZGF0ZVBvaW50KHtrZXksIGxvY2F0aW9uOiBsbmdMYXR9KTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25EcmFnRW5kKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25EcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uRHJhZ0VuZCwgZmFsc2UpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdnZWRQb2ludDogbnVsbH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9hZGRQb2ludChldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgcGl4ZWwgPSBtb3VzZSh0aGlzLnJlZnMuY29udGFpbmVyLCBldmVudCk7XG4gICAgY29uc3QgbWVyY2F0b3IgPSBWaWV3cG9ydE1lcmNhdG9yKHRoaXMucHJvcHMpO1xuICAgIHRoaXMucHJvcHMub25BZGRQb2ludChtZXJjYXRvci51bnByb2plY3QocGl4ZWwpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7cG9pbnRzLCB3aWR0aCwgaGVpZ2h0LCBpc0RyYWdnaW5nLCBzdHlsZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IG1lcmNhdG9yID0gVmlld3BvcnRNZXJjYXRvcih0aGlzLnByb3BzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2Z1xuICAgICAgICByZWY9XCJjb250YWluZXJcIlxuICAgICAgICB3aWR0aD17IHdpZHRoIH1cbiAgICAgICAgaGVpZ2h0PXsgaGVpZ2h0IH1cbiAgICAgICAgc3R5bGU9eyB7XG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ2FsbCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgY3Vyc29yOiBpc0RyYWdnaW5nID8gY29uZmlnLkNVUlNPUi5HUkFCQklORyA6IGNvbmZpZy5DVVJTT1IuR1JBQixcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9IH1cbiAgICAgICAgb25Db250ZXh0TWVudT17IHRoaXMuX2FkZFBvaW50IH0+XG5cbiAgICAgICAgPGcgc3R5bGU9eyB7Y3Vyc29yOiAncG9pbnRlcid9IH0+XG4gICAgICAgIHtcbiAgICAgICAgICBwb2ludHMubWFwKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBpeGVsID0gbWVyY2F0b3IucHJvamVjdCh0aGlzLnByb3BzLmxuZ0xhdEFjY2Vzc29yKHBvaW50KSk7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8Z1xuICAgICAgICAgICAgICAgIGtleT17IGluZGV4IH1cbiAgICAgICAgICAgICAgICBzdHlsZT17IHtwb2ludGVyRXZlbnRzOiAnYWxsJ30gfVxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17IHRyYW5zZm9ybShbe3RyYW5zbGF0ZTogcGl4ZWx9XSkgfVxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXsgdGhpcy5fb25EcmFnU3RhcnQuYmluZCh0aGlzLCBwb2ludCkgfT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnJlbmRlclBvaW50LmNhbGwodGhpcywgcG9pbnQsIHBpeGVsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH1cbn1cblxuRHJhZ2dhYmxlUG9pbnRzT3ZlcmxheS5wcm9wVHlwZXMgPSBQUk9QX1RZUEVTO1xuRHJhZ2dhYmxlUG9pbnRzT3ZlcmxheS5kZWZhdWx0UHJvcHMgPSBERUZBVUxUX1BST1BTO1xuIl19