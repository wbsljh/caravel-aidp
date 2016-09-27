'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _desc, _value, _class2; // Copyright (c) 2015 Uber Technologies, Inc.

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

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

var _map = require('./map.react');

var _map2 = _interopRequireDefault(_map);

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

var PUBLIC_MAP_STATE_DEFAULTS = {
  latitude: 0,
  longitude: 0,
  zoom: 11,
  pitch: 0,
  bearing: 0,
  altitude: 1.5
};

function compareProps(refObject, newObject) {
  for (var field in refObject) {
    if (!(field in newObject) || refObject[field] !== newObject[field]) {
      return false;
    }
  }
  return true;
}

var PROP_TYPES = {
  /**
    * `onChangeViewport` callback is fired when the user interacted with the
    * map. The object passed to the callback contains `latitude`,
    * `longitude`, `zoom` and additional information.
    */
  onChangeViewport: _react.PropTypes.func
};

var DEFAULT_PROPS = {
  onChangeViewport: noop
};

var StatefulMapGL = (0, _pureRenderDecorator2.default)(_class = (_class2 = function (_Component) {
  _inherits(StatefulMapGL, _Component);

  function StatefulMapGL(props) {
    _classCallCheck(this, StatefulMapGL);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StatefulMapGL).call(this, props));

    _this.state = _this._getInternalMapState(props);
    return _this;
  }

  // Extract all public map state fields from an object


  _createClass(StatefulMapGL, [{
    key: '_getPublicMapState',
    value: function _getPublicMapState(props) {
      return _extends({}, PUBLIC_MAP_STATE_DEFAULTS, {
        latitude: props.latitude,
        longitude: props.longitude,
        zoom: props.zoom,
        pitch: props.pitch,
        bearing: props.bearing,
        altitude: props.altitude
      });
    }

    // Extract all non-public map state fields from an object

  }, {
    key: '_getInternalMapState',
    value: function _getInternalMapState(props) {
      return {
        isDragging: props.isDragging || false,
        startDragLngLat: props.startDragLngLat || null,
        startBearing: props.startBearing || null,
        startPitch: props.startPitch || null
      };
    }

    // Save internal props to state
    // Call apps onChangeViewport with public props only
    // Only call app if public props have changed.

  }, {
    key: '_onChangeViewport',
    value: function _onChangeViewport(mapState) {
      // Update state (triggering map redraw) only if internal props changed
      var internalMapState = this._getInternalMapState(mapState);
      if (!compareProps(internalMapState, this.state)) {
        this.setState(internalMapState);
      }

      // Update app (presumably triggering redraw) only if map changed vs props
      var publicMapState = this._getPublicMapState(mapState);
      if (!compareProps(publicMapState, this.props)) {
        this.props.onChangeViewport(publicMapState);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_map2.default, _extends({}, this.props, this.state, {
        onChangeViewport: this._onChangeViewport }));
    }
  }]);

  return StatefulMapGL;
}(_react.Component), (_applyDecoratedDescriptor(_class2.prototype, '_onChangeViewport', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onChangeViewport'), _class2.prototype)), _class2)) || _class;

exports.default = StatefulMapGL;


StatefulMapGL.propTypes = PROP_TYPES;
StatefulMapGL.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGF0ZWZ1bC1tYXAucmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7b0NBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVMsSUFBVCxHQUFnQixDQUFFOztBQUVsQixJQUFNLDRCQUE0QjtBQUNoQyxZQUFVLENBRHNCO0FBRWhDLGFBQVcsQ0FGcUI7QUFHaEMsUUFBTSxFQUgwQjtBQUloQyxTQUFPLENBSnlCO0FBS2hDLFdBQVMsQ0FMdUI7QUFNaEMsWUFBVTtBQU5zQixDQUFsQzs7QUFTQSxTQUFTLFlBQVQsQ0FBc0IsU0FBdEIsRUFBaUMsU0FBakMsRUFBNEM7QUFDMUMsT0FBSyxJQUFNLEtBQVgsSUFBb0IsU0FBcEIsRUFBK0I7QUFDN0IsUUFBSSxFQUFFLFNBQVMsU0FBWCxLQUF5QixVQUFVLEtBQVYsTUFBcUIsVUFBVSxLQUFWLENBQWxELEVBQW9FO0FBQ2xFLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLElBQVA7QUFDRDs7QUFFRCxJQUFNLGFBQWE7QUFDakI7Ozs7O0FBS0Esb0JBQWtCLGlCQUFVO0FBTlgsQ0FBbkI7O0FBU0EsSUFBTSxnQkFBZ0I7QUFDcEIsb0JBQWtCO0FBREUsQ0FBdEI7O0lBS3FCLGE7OztBQUVuQix5QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsaUdBQ1gsS0FEVzs7QUFFakIsVUFBSyxLQUFMLEdBQWEsTUFBSyxvQkFBTCxDQUEwQixLQUExQixDQUFiO0FBRmlCO0FBR2xCOztBQUVEOzs7Ozt1Q0FDbUIsSyxFQUFPO0FBQ3hCLDBCQUNLLHlCQURMO0FBRUUsa0JBQVUsTUFBTSxRQUZsQjtBQUdFLG1CQUFXLE1BQU0sU0FIbkI7QUFJRSxjQUFNLE1BQU0sSUFKZDtBQUtFLGVBQU8sTUFBTSxLQUxmO0FBTUUsaUJBQVMsTUFBTSxPQU5qQjtBQU9FLGtCQUFVLE1BQU07QUFQbEI7QUFTRDs7QUFFRDs7Ozt5Q0FDcUIsSyxFQUFPO0FBQzFCLGFBQU87QUFDTCxvQkFBWSxNQUFNLFVBQU4sSUFBb0IsS0FEM0I7QUFFTCx5QkFBaUIsTUFBTSxlQUFOLElBQXlCLElBRnJDO0FBR0wsc0JBQWMsTUFBTSxZQUFOLElBQXNCLElBSC9CO0FBSUwsb0JBQVksTUFBTSxVQUFOLElBQW9CO0FBSjNCLE9BQVA7QUFNRDs7QUFFRDtBQUNBO0FBQ0E7Ozs7c0NBQzRCLFEsRUFBVTtBQUNwQztBQUNBLFVBQU0sbUJBQW1CLEtBQUssb0JBQUwsQ0FBMEIsUUFBMUIsQ0FBekI7QUFDQSxVQUFJLENBQUMsYUFBYSxnQkFBYixFQUErQixLQUFLLEtBQXBDLENBQUwsRUFBaUQ7QUFDL0MsYUFBSyxRQUFMLENBQWMsZ0JBQWQ7QUFDRDs7QUFFRDtBQUNBLFVBQU0saUJBQWlCLEtBQUssa0JBQUwsQ0FBd0IsUUFBeEIsQ0FBdkI7QUFDQSxVQUFJLENBQUMsYUFBYSxjQUFiLEVBQTZCLEtBQUssS0FBbEMsQ0FBTCxFQUErQztBQUM3QyxhQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0QixjQUE1QjtBQUNEO0FBQ0Y7Ozs2QkFFUTtBQUNQLGFBQ0UsMERBQ08sS0FBSyxLQURaLEVBRU8sS0FBSyxLQUZaO0FBR0UsMEJBQW1CLEtBQUssaUJBSDFCLElBREY7QUFNRDs7Ozs7O2tCQXREa0IsYTs7O0FBeURyQixjQUFjLFNBQWQsR0FBMEIsVUFBMUI7QUFDQSxjQUFjLFlBQWQsR0FBNkIsYUFBN0IiLCJmaWxlIjoic3RhdGVmdWwtbWFwLnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG5cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCBwdXJlUmVuZGVyIGZyb20gJ3B1cmUtcmVuZGVyLWRlY29yYXRvcic7XG5pbXBvcnQgTWFwR0wgZnJvbSAnLi9tYXAucmVhY3QnO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuY29uc3QgUFVCTElDX01BUF9TVEFURV9ERUZBVUxUUyA9IHtcbiAgbGF0aXR1ZGU6IDAsXG4gIGxvbmdpdHVkZTogMCxcbiAgem9vbTogMTEsXG4gIHBpdGNoOiAwLFxuICBiZWFyaW5nOiAwLFxuICBhbHRpdHVkZTogMS41XG59O1xuXG5mdW5jdGlvbiBjb21wYXJlUHJvcHMocmVmT2JqZWN0LCBuZXdPYmplY3QpIHtcbiAgZm9yIChjb25zdCBmaWVsZCBpbiByZWZPYmplY3QpIHtcbiAgICBpZiAoIShmaWVsZCBpbiBuZXdPYmplY3QpIHx8IHJlZk9iamVjdFtmaWVsZF0gIT09IG5ld09iamVjdFtmaWVsZF0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIC8qKlxuICAgICogYG9uQ2hhbmdlVmlld3BvcnRgIGNhbGxiYWNrIGlzIGZpcmVkIHdoZW4gdGhlIHVzZXIgaW50ZXJhY3RlZCB3aXRoIHRoZVxuICAgICogbWFwLiBUaGUgb2JqZWN0IHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgY29udGFpbnMgYGxhdGl0dWRlYCxcbiAgICAqIGBsb25naXR1ZGVgLCBgem9vbWAgYW5kIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAgKi9cbiAgb25DaGFuZ2VWaWV3cG9ydDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IERFRkFVTFRfUFJPUFMgPSB7XG4gIG9uQ2hhbmdlVmlld3BvcnQ6IG5vb3Bcbn07XG5cbkBwdXJlUmVuZGVyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZWZ1bE1hcEdMIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5fZ2V0SW50ZXJuYWxNYXBTdGF0ZShwcm9wcyk7XG4gIH1cblxuICAvLyBFeHRyYWN0IGFsbCBwdWJsaWMgbWFwIHN0YXRlIGZpZWxkcyBmcm9tIGFuIG9iamVjdFxuICBfZ2V0UHVibGljTWFwU3RhdGUocHJvcHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uUFVCTElDX01BUF9TVEFURV9ERUZBVUxUUyxcbiAgICAgIGxhdGl0dWRlOiBwcm9wcy5sYXRpdHVkZSxcbiAgICAgIGxvbmdpdHVkZTogcHJvcHMubG9uZ2l0dWRlLFxuICAgICAgem9vbTogcHJvcHMuem9vbSxcbiAgICAgIHBpdGNoOiBwcm9wcy5waXRjaCxcbiAgICAgIGJlYXJpbmc6IHByb3BzLmJlYXJpbmcsXG4gICAgICBhbHRpdHVkZTogcHJvcHMuYWx0aXR1ZGVcbiAgICB9O1xuICB9XG5cbiAgLy8gRXh0cmFjdCBhbGwgbm9uLXB1YmxpYyBtYXAgc3RhdGUgZmllbGRzIGZyb20gYW4gb2JqZWN0XG4gIF9nZXRJbnRlcm5hbE1hcFN0YXRlKHByb3BzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHByb3BzLmlzRHJhZ2dpbmcgfHwgZmFsc2UsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IHByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCB8fCBudWxsLFxuICAgICAgc3RhcnRCZWFyaW5nOiBwcm9wcy5zdGFydEJlYXJpbmcgfHwgbnVsbCxcbiAgICAgIHN0YXJ0UGl0Y2g6IHByb3BzLnN0YXJ0UGl0Y2ggfHwgbnVsbFxuICAgIH07XG4gIH1cblxuICAvLyBTYXZlIGludGVybmFsIHByb3BzIHRvIHN0YXRlXG4gIC8vIENhbGwgYXBwcyBvbkNoYW5nZVZpZXdwb3J0IHdpdGggcHVibGljIHByb3BzIG9ubHlcbiAgLy8gT25seSBjYWxsIGFwcCBpZiBwdWJsaWMgcHJvcHMgaGF2ZSBjaGFuZ2VkLlxuICBAYXV0b2JpbmQgX29uQ2hhbmdlVmlld3BvcnQobWFwU3RhdGUpIHtcbiAgICAvLyBVcGRhdGUgc3RhdGUgKHRyaWdnZXJpbmcgbWFwIHJlZHJhdykgb25seSBpZiBpbnRlcm5hbCBwcm9wcyBjaGFuZ2VkXG4gICAgY29uc3QgaW50ZXJuYWxNYXBTdGF0ZSA9IHRoaXMuX2dldEludGVybmFsTWFwU3RhdGUobWFwU3RhdGUpO1xuICAgIGlmICghY29tcGFyZVByb3BzKGludGVybmFsTWFwU3RhdGUsIHRoaXMuc3RhdGUpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKGludGVybmFsTWFwU3RhdGUpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBhcHAgKHByZXN1bWFibHkgdHJpZ2dlcmluZyByZWRyYXcpIG9ubHkgaWYgbWFwIGNoYW5nZWQgdnMgcHJvcHNcbiAgICBjb25zdCBwdWJsaWNNYXBTdGF0ZSA9IHRoaXMuX2dldFB1YmxpY01hcFN0YXRlKG1hcFN0YXRlKTtcbiAgICBpZiAoIWNvbXBhcmVQcm9wcyhwdWJsaWNNYXBTdGF0ZSwgdGhpcy5wcm9wcykpIHtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydChwdWJsaWNNYXBTdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8TWFwR0xcbiAgICAgICAgeyAuLi50aGlzLnByb3BzIH1cbiAgICAgICAgeyAuLi50aGlzLnN0YXRlIH1cbiAgICAgICAgb25DaGFuZ2VWaWV3cG9ydD17IHRoaXMuX29uQ2hhbmdlVmlld3BvcnQgfS8+XG4gICAgKTtcbiAgfVxufVxuXG5TdGF0ZWZ1bE1hcEdMLnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG5TdGF0ZWZ1bE1hcEdMLmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=