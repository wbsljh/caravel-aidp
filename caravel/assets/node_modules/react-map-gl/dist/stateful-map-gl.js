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

var _mapGl = require('./map-gl.js');

var _mapGl2 = _interopRequireDefault(_mapGl);

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

var StatefulMapGL = (0, _pureRenderDecorator2.default)(_class = (_class2 = function (_Component) {
  _inherits(StatefulMapGL, _Component);

  function StatefulMapGL(props) {
    _classCallCheck(this, StatefulMapGL);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StatefulMapGL).call(this, props));

    _this.state = _this._geInternalMapState(props);
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
      return _react2.default.createElement(_mapGl2.default, _extends({}, this.props, this.state, {
        onChangeViewport: this._onChangeViewport }));
    }
  }]);

  return StatefulMapGL;
}(_react.Component), (_applyDecoratedDescriptor(_class2.prototype, '_onChangeViewport', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class2.prototype, '_onChangeViewport'), _class2.prototype)), _class2)) || _class;

exports.default = StatefulMapGL;


StatefulMapGL.propTypes = PROP_TYPES;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGF0ZWZ1bC1tYXAtZ2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7b0NBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sNEJBQTRCO0FBQ2hDLFlBQVUsQ0FEc0I7QUFFaEMsYUFBVyxDQUZxQjtBQUdoQyxRQUFNLEVBSDBCO0FBSWhDLFNBQU8sQ0FKeUI7QUFLaEMsV0FBUyxDQUx1QjtBQU1oQyxZQUFVO0FBTnNCLENBQWxDOztBQVNBLFNBQVMsWUFBVCxDQUFzQixTQUF0QixFQUFpQyxTQUFqQyxFQUE0QztBQUMxQyxPQUFLLElBQU0sS0FBWCxJQUFvQixTQUFwQixFQUErQjtBQUM3QixRQUFJLEVBQUUsU0FBUyxTQUFYLEtBQXlCLFVBQVUsS0FBVixNQUFxQixVQUFVLEtBQVYsQ0FBbEQsRUFBb0U7QUFDbEUsYUFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sSUFBUDtBQUNEOztBQUVELElBQU0sYUFBYTtBQUNqQjs7Ozs7QUFLQSxvQkFBa0IsaUJBQVU7QUFOWCxDQUFuQjs7SUFVcUIsYTs7O0FBRW5CLHlCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxpR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYSxNQUFLLG1CQUFMLENBQXlCLEtBQXpCLENBQWI7QUFGaUI7QUFHbEI7O0FBRUQ7Ozs7O3VDQUNtQixLLEVBQU87QUFDeEIsMEJBQ0sseUJBREw7QUFFRSxrQkFBVSxNQUFNLFFBRmxCO0FBR0UsbUJBQVcsTUFBTSxTQUhuQjtBQUlFLGNBQU0sTUFBTSxJQUpkO0FBS0UsZUFBTyxNQUFNLEtBTGY7QUFNRSxpQkFBUyxNQUFNLE9BTmpCO0FBT0Usa0JBQVUsTUFBTTtBQVBsQjtBQVNEOztBQUVEOzs7O3lDQUNxQixLLEVBQU87QUFDMUIsYUFBTztBQUNMLG9CQUFZLE1BQU0sVUFBTixJQUFvQixLQUQzQjtBQUVMLHlCQUFpQixNQUFNLGVBQU4sSUFBeUIsSUFGckM7QUFHTCxzQkFBYyxNQUFNLFlBQU4sSUFBc0IsSUFIL0I7QUFJTCxvQkFBWSxNQUFNLFVBQU4sSUFBb0I7QUFKM0IsT0FBUDtBQU1EOztBQUVEO0FBQ0E7QUFDQTs7OztzQ0FDNEIsUSxFQUFVO0FBQ3BDO0FBQ0EsVUFBTSxtQkFBbUIsS0FBSyxvQkFBTCxDQUEwQixRQUExQixDQUF6QjtBQUNBLFVBQUksQ0FBQyxhQUFhLGdCQUFiLEVBQStCLEtBQUssS0FBcEMsQ0FBTCxFQUFpRDtBQUMvQyxhQUFLLFFBQUwsQ0FBYyxnQkFBZDtBQUNEOztBQUVEO0FBQ0EsVUFBTSxpQkFBaUIsS0FBSyxrQkFBTCxDQUF3QixRQUF4QixDQUF2QjtBQUNBLFVBQUksQ0FBQyxhQUFhLGNBQWIsRUFBNkIsS0FBSyxLQUFsQyxDQUFMLEVBQStDO0FBQzdDLGFBQUssS0FBTCxDQUFXLGdCQUFYLENBQTRCLGNBQTVCO0FBQ0Q7QUFDRjs7OzZCQUVRO0FBQ1AsYUFDRSw0REFDTyxLQUFLLEtBRFosRUFFTyxLQUFLLEtBRlo7QUFHRSwwQkFBbUIsS0FBSyxpQkFIMUIsSUFERjtBQU1EOzs7Ozs7a0JBdERrQixhOzs7QUF5RHJCLGNBQWMsU0FBZCxHQUEwQixVQUExQiIsImZpbGUiOiJzdGF0ZWZ1bC1tYXAtZ2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzLCBDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBhdXRvYmluZCBmcm9tICdhdXRvYmluZC1kZWNvcmF0b3InO1xuaW1wb3J0IHB1cmVSZW5kZXIgZnJvbSAncHVyZS1yZW5kZXItZGVjb3JhdG9yJztcbmltcG9ydCBNYXBHTCBmcm9tICcuL21hcC1nbC5qcyc7XG5cbmNvbnN0IFBVQkxJQ19NQVBfU1RBVEVfREVGQVVMVFMgPSB7XG4gIGxhdGl0dWRlOiAwLFxuICBsb25naXR1ZGU6IDAsXG4gIHpvb206IDExLFxuICBwaXRjaDogMCxcbiAgYmVhcmluZzogMCxcbiAgYWx0aXR1ZGU6IDEuNVxufTtcblxuZnVuY3Rpb24gY29tcGFyZVByb3BzKHJlZk9iamVjdCwgbmV3T2JqZWN0KSB7XG4gIGZvciAoY29uc3QgZmllbGQgaW4gcmVmT2JqZWN0KSB7XG4gICAgaWYgKCEoZmllbGQgaW4gbmV3T2JqZWN0KSB8fCByZWZPYmplY3RbZmllbGRdICE9PSBuZXdPYmplY3RbZmllbGRdKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5jb25zdCBQUk9QX1RZUEVTID0ge1xuICAvKipcbiAgICAqIGBvbkNoYW5nZVZpZXdwb3J0YCBjYWxsYmFjayBpcyBmaXJlZCB3aGVuIHRoZSB1c2VyIGludGVyYWN0ZWQgd2l0aCB0aGVcbiAgICAqIG1hcC4gVGhlIG9iamVjdCBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGNvbnRhaW5zIGBsYXRpdHVkZWAsXG4gICAgKiBgbG9uZ2l0dWRlYCwgYHpvb21gIGFuZCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgICovXG4gIG9uQ2hhbmdlVmlld3BvcnQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5AcHVyZVJlbmRlclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdGVmdWxNYXBHTCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuX2dlSW50ZXJuYWxNYXBTdGF0ZShwcm9wcyk7XG4gIH1cblxuICAvLyBFeHRyYWN0IGFsbCBwdWJsaWMgbWFwIHN0YXRlIGZpZWxkcyBmcm9tIGFuIG9iamVjdFxuICBfZ2V0UHVibGljTWFwU3RhdGUocHJvcHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uUFVCTElDX01BUF9TVEFURV9ERUZBVUxUUyxcbiAgICAgIGxhdGl0dWRlOiBwcm9wcy5sYXRpdHVkZSxcbiAgICAgIGxvbmdpdHVkZTogcHJvcHMubG9uZ2l0dWRlLFxuICAgICAgem9vbTogcHJvcHMuem9vbSxcbiAgICAgIHBpdGNoOiBwcm9wcy5waXRjaCxcbiAgICAgIGJlYXJpbmc6IHByb3BzLmJlYXJpbmcsXG4gICAgICBhbHRpdHVkZTogcHJvcHMuYWx0aXR1ZGVcbiAgICB9O1xuICB9XG5cbiAgLy8gRXh0cmFjdCBhbGwgbm9uLXB1YmxpYyBtYXAgc3RhdGUgZmllbGRzIGZyb20gYW4gb2JqZWN0XG4gIF9nZXRJbnRlcm5hbE1hcFN0YXRlKHByb3BzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzRHJhZ2dpbmc6IHByb3BzLmlzRHJhZ2dpbmcgfHwgZmFsc2UsXG4gICAgICBzdGFydERyYWdMbmdMYXQ6IHByb3BzLnN0YXJ0RHJhZ0xuZ0xhdCB8fCBudWxsLFxuICAgICAgc3RhcnRCZWFyaW5nOiBwcm9wcy5zdGFydEJlYXJpbmcgfHwgbnVsbCxcbiAgICAgIHN0YXJ0UGl0Y2g6IHByb3BzLnN0YXJ0UGl0Y2ggfHwgbnVsbFxuICAgIH07XG4gIH1cblxuICAvLyBTYXZlIGludGVybmFsIHByb3BzIHRvIHN0YXRlXG4gIC8vIENhbGwgYXBwcyBvbkNoYW5nZVZpZXdwb3J0IHdpdGggcHVibGljIHByb3BzIG9ubHlcbiAgLy8gT25seSBjYWxsIGFwcCBpZiBwdWJsaWMgcHJvcHMgaGF2ZSBjaGFuZ2VkLlxuICBAYXV0b2JpbmQgX29uQ2hhbmdlVmlld3BvcnQobWFwU3RhdGUpIHtcbiAgICAvLyBVcGRhdGUgc3RhdGUgKHRyaWdnZXJpbmcgbWFwIHJlZHJhdykgb25seSBpZiBpbnRlcm5hbCBwcm9wcyBjaGFuZ2VkXG4gICAgY29uc3QgaW50ZXJuYWxNYXBTdGF0ZSA9IHRoaXMuX2dldEludGVybmFsTWFwU3RhdGUobWFwU3RhdGUpO1xuICAgIGlmICghY29tcGFyZVByb3BzKGludGVybmFsTWFwU3RhdGUsIHRoaXMuc3RhdGUpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKGludGVybmFsTWFwU3RhdGUpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBhcHAgKHByZXN1bWFibHkgdHJpZ2dlcmluZyByZWRyYXcpIG9ubHkgaWYgbWFwIGNoYW5nZWQgdnMgcHJvcHNcbiAgICBjb25zdCBwdWJsaWNNYXBTdGF0ZSA9IHRoaXMuX2dldFB1YmxpY01hcFN0YXRlKG1hcFN0YXRlKTtcbiAgICBpZiAoIWNvbXBhcmVQcm9wcyhwdWJsaWNNYXBTdGF0ZSwgdGhpcy5wcm9wcykpIHtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VWaWV3cG9ydChwdWJsaWNNYXBTdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8TWFwR0xcbiAgICAgICAgeyAuLi50aGlzLnByb3BzIH1cbiAgICAgICAgeyAuLi50aGlzLnN0YXRlIH1cbiAgICAgICAgb25DaGFuZ2VWaWV3cG9ydD17IHRoaXMuX29uQ2hhbmdlVmlld3BvcnQgfS8+XG4gICAgKTtcbiAgfVxufVxuXG5TdGF0ZWZ1bE1hcEdMLnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG4iXX0=