'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _mapboxGl = require('mapbox-gl');

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

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

var ua = typeof _window2.default.navigator !== 'undefined' ? _window2.default.navigator.userAgent.toLowerCase() : '';
var firefox = ua.indexOf('firefox') !== -1;

function mousePos(el, event) {
  var rect = el.getBoundingClientRect();
  event = event.touches ? event.touches[0] : event;
  return new _mapboxGl.Point(event.clientX - rect.left - el.clientLeft, event.clientY - rect.top - el.clientTop);
}

/* eslint-disable max-len */
// Portions of the code below originally from:
// https://github.com/mapbox/mapbox-gl-js/blob/master/js/ui/handler/scroll_zoom.js
/* eslint-enable max-len */

var PROP_TYPES = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  onMouseDown: _react.PropTypes.func,
  onMouseDrag: _react.PropTypes.func,
  onMouseRotate: _react.PropTypes.func,
  onMouseUp: _react.PropTypes.func,
  onMouseMove: _react.PropTypes.func,
  onZoom: _react.PropTypes.func,
  onZoomEnd: _react.PropTypes.func
};

var DEFAULT_PROPS = {
  onMouseDown: noop,
  onMouseDrag: noop,
  onMouseRotate: noop,
  onMouseUp: noop,
  onMouseMove: noop,
  onZoom: noop,
  onZoomEnd: noop
};

var MapInteractions = (_class = function (_Component) {
  _inherits(MapInteractions, _Component);

  function MapInteractions(props) {
    _classCallCheck(this, MapInteractions);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapInteractions).call(this, props));

    _this.state = {
      startPos: null,
      pos: null,
      mouseWheelPos: null
    };
    return _this;
  }

  _createClass(MapInteractions, [{
    key: '_getMousePos',
    value: function _getMousePos(event) {
      var el = this.refs.container;
      return mousePos(el, event);
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(event) {
      var pos = this._getMousePos(event);
      this.setState({
        startPos: pos,
        pos: pos,
        metaKey: Boolean(event.metaKey)
      });
      this.props.onMouseDown({ pos: pos });
      _document2.default.addEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.addEventListener('mouseup', this._onMouseUp, false);
    }
  }, {
    key: '_onMouseDrag',
    value: function _onMouseDrag(event) {
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      if (this.state.metaKey) {
        var startPos = this.state.startPos;

        this.props.onMouseRotate({ pos: pos, startPos: startPos });
      } else {
        this.props.onMouseDrag({ pos: pos });
      }
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(event) {
      _document2.default.removeEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.removeEventListener('mouseup', this._onMouseUp, false);
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      this.props.onMouseUp({ pos: pos });
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(event) {
      var pos = this._getMousePos(event);
      this.props.onMouseMove({ pos: pos });
    }

    /* eslint-disable complexity, max-statements */

  }, {
    key: '_onWheel',
    value: function _onWheel(event) {
      event.stopPropagation();
      event.preventDefault();
      var value = event.deltaY;
      // Firefox doubles the values on retina screens...
      if (firefox && event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_PIXEL) {
        value /= _window2.default.devicePixelRatio;
      }
      if (event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_LINE) {
        value *= 40;
      }

      var type = this.state.mouseWheelType;
      var timeout = this.state.mouseWheelTimeout;
      var lastValue = this.state.mouseWheelLastValue;
      var time = this.state.mouseWheelTime;

      var now = (_window2.default.performance || Date).now();
      var timeDelta = now - (time || 0);

      var pos = this._getMousePos(event);
      time = now;

      if (value !== 0 && value % 4.000244140625 === 0) {
        // This one is definitely a mouse wheel event.
        type = 'wheel';
        // Normalize this value to match trackpad.
        value = Math.floor(value / 4);
      } else if (value !== 0 && Math.abs(value) < 4) {
        // This one is definitely a trackpad event because it is so small.
        type = 'trackpad';
      } else if (timeDelta > 400) {
        // This is likely a new scroll action.
        type = null;
        lastValue = value;

        // Start a timeout in case this was a singular event, and delay it by up
        // to 40ms.
        timeout = _window2.default.setTimeout(function setTimeout() {
          var _type = 'wheel';
          this._zoom(-this.state.mouseWheelLastValue, this.state.mouseWheelPos);
          this.setState({ mouseWheelType: _type });
        }.bind(this), 40);
      } else if (!this._type) {
        // This is a repeating event, but we don't know the type of event just
        // yet.
        // If the delta per time is small, we assume it's a fast trackpad;
        // otherwise we switch into wheel mode.
        type = Math.abs(timeDelta * value) < 200 ? 'trackpad' : 'wheel';

        // Make sure our delayed event isn't fired again, because we accumulate
        // the previous event (which was less than 40ms ago) into this event.
        if (timeout) {
          _window2.default.clearTimeout(timeout);
          timeout = null;
          value += lastValue;
        }
      }

      // Slow down zoom if shift key is held for more precise zooming
      if (event.shiftKey && value) {
        value = value / 4;
      }

      // Only fire the callback if we actually know what type of scrolling device
      // the user uses.
      if (type) {
        this._zoom(-value, pos);
      }

      this.setState({
        mouseWheelTime: time,
        mouseWheelPos: pos,
        mouseWheelType: type,
        mouseWheelTimeout: timeout,
        mouseWheelLastValue: lastValue
      });
    }
    /* eslint-enable complexity, max-statements */

  }, {
    key: '_zoom',
    value: function _zoom(delta, pos) {

      // Scale by sigmoid of scroll wheel delta.
      var scale = 2 / (1 + Math.exp(-Math.abs(delta / 100)));
      if (delta < 0 && scale !== 0) {
        scale = 1 / scale;
      }
      this.props.onZoom({ pos: pos, scale: scale });
      _window2.default.clearTimeout(this._zoomEndTimeout);
      this._zoomEndTimeout = _window2.default.setTimeout(function _setTimeout() {
        this.props.onZoomEnd();
      }.bind(this), 200);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          ref: 'container',
          onMouseMove: this._onMouseMove,
          onMouseDown: this._onMouseDown,
          onContextMenu: this._onMouseDown,
          onWheel: this._onWheel,
          style: {
            width: this.props.width,
            height: this.props.height,
            position: 'relative'
          } },
        this.props.children
      );
    }
  }]);

  return MapInteractions;
}(_react.Component), (_applyDecoratedDescriptor(_class.prototype, '_onMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDown'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseUp'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onWheel', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onWheel'), _class.prototype)), _class);
exports.default = MapInteractions;


MapInteractions.propTypes = PROP_TYPES;
MapInteractions.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAtaW50ZXJhY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzsyQkFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxTQUFTLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEIsSUFBTSxLQUFLLE9BQU8saUJBQU8sU0FBZCxLQUE0QixXQUE1QixHQUNULGlCQUFPLFNBQVAsQ0FBaUIsU0FBakIsQ0FBMkIsV0FBM0IsRUFEUyxHQUNrQyxFQUQ3QztBQUVBLElBQU0sVUFBVSxHQUFHLE9BQUgsQ0FBVyxTQUFYLE1BQTBCLENBQUMsQ0FBM0M7O0FBRUEsU0FBUyxRQUFULENBQWtCLEVBQWxCLEVBQXNCLEtBQXRCLEVBQTZCO0FBQzNCLE1BQU0sT0FBTyxHQUFHLHFCQUFILEVBQWI7QUFDQSxVQUFRLE1BQU0sT0FBTixHQUFnQixNQUFNLE9BQU4sQ0FBYyxDQUFkLENBQWhCLEdBQW1DLEtBQTNDO0FBQ0EsU0FBTyxvQkFDTCxNQUFNLE9BQU4sR0FBZ0IsS0FBSyxJQUFyQixHQUE0QixHQUFHLFVBRDFCLEVBRUwsTUFBTSxPQUFOLEdBQWdCLEtBQUssR0FBckIsR0FBMkIsR0FBRyxTQUZ6QixDQUFQO0FBSUQ7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBTSxhQUFhO0FBQ2pCLFNBQU8saUJBQVUsTUFBVixDQUFpQixVQURQO0FBRWpCLFVBQVEsaUJBQVUsTUFBVixDQUFpQixVQUZSO0FBR2pCLGVBQWEsaUJBQVUsSUFITjtBQUlqQixlQUFhLGlCQUFVLElBSk47QUFLakIsaUJBQWUsaUJBQVUsSUFMUjtBQU1qQixhQUFXLGlCQUFVLElBTko7QUFPakIsZUFBYSxpQkFBVSxJQVBO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USxLQUFLLEtBQUwsQ0FBVyxNQUZiO0FBR04sc0JBQVU7QUFISixXQU5WO0FBWUksYUFBSyxLQUFMLENBQVc7QUFaZixPQURGO0FBaUJEOzs7OztrQkExS2tCLGU7OztBQTZLckIsZ0JBQWdCLFNBQWhCLEdBQTRCLFVBQTVCO0FBQ0EsZ0JBQWdCLFlBQWhCLEdBQStCLGFBQS9CIiwiZmlsZSI6Im1hcC1pbnRlcmFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXMsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5pbXBvcnQge1BvaW50fSBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuY29uc3QgdWEgPSB0eXBlb2Ygd2luZG93Lm5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgP1xuICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpIDogJyc7XG5jb25zdCBmaXJlZm94ID0gdWEuaW5kZXhPZignZmlyZWZveCcpICE9PSAtMTtcblxuZnVuY3Rpb24gbW91c2VQb3MoZWwsIGV2ZW50KSB7XG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgZXZlbnQgPSBldmVudC50b3VjaGVzID8gZXZlbnQudG91Y2hlc1swXSA6IGV2ZW50O1xuICByZXR1cm4gbmV3IFBvaW50KFxuICAgIGV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSBlbC5jbGllbnRMZWZ0LFxuICAgIGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCAtIGVsLmNsaWVudFRvcFxuICApO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4vLyBQb3J0aW9ucyBvZiB0aGUgY29kZSBiZWxvdyBvcmlnaW5hbGx5IGZyb206XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9ibG9iL21hc3Rlci9qcy91aS9oYW5kbGVyL3Njcm9sbF96b29tLmpzXG4vKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIG9uTW91c2VEb3duOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZURyYWc6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlUm90YXRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZVVwOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZU1vdmU6IFByb3BUeXBlcy5mdW5jLFxuICBvblpvb206IFByb3BUeXBlcy5mdW5jLFxuICBvblpvb21FbmQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBvbk1vdXNlRG93bjogbm9vcCxcbiAgb25Nb3VzZURyYWc6IG5vb3AsXG4gIG9uTW91c2VSb3RhdGU6IG5vb3AsXG4gIG9uTW91c2VVcDogbm9vcCxcbiAgb25Nb3VzZU1vdmU6IG5vb3AsXG4gIG9uWm9vbTogbm9vcCxcbiAgb25ab29tRW5kOiBub29wXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBJbnRlcmFjdGlvbnMgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzdGFydFBvczogbnVsbCxcbiAgICAgIHBvczogbnVsbCxcbiAgICAgIG1vdXNlV2hlZWxQb3M6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgX2dldE1vdXNlUG9zKGV2ZW50KSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLnJlZnMuY29udGFpbmVyO1xuICAgIHJldHVybiBtb3VzZVBvcyhlbCwgZXZlbnQpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlRG93bihldmVudCkge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXJ0UG9zOiBwb3MsXG4gICAgICBwb3MsXG4gICAgICBtZXRhS2V5OiBCb29sZWFuKGV2ZW50Lm1ldGFLZXkpXG4gICAgfSk7XG4gICAgdGhpcy5wcm9wcy5vbk1vdXNlRG93bih7cG9zfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZURyYWcsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwLCBmYWxzZSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VEcmFnKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Bvc30pO1xuICAgIGlmICh0aGlzLnN0YXRlLm1ldGFLZXkpIHtcbiAgICAgIGNvbnN0IHtzdGFydFBvc30gPSB0aGlzLnN0YXRlO1xuICAgICAgdGhpcy5wcm9wcy5vbk1vdXNlUm90YXRlKHtwb3MsIHN0YXJ0UG9zfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMub25Nb3VzZURyYWcoe3Bvc30pO1xuICAgIH1cbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZVVwKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZURyYWcsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Bvc30pO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZVVwKHtwb3N9KTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5wcm9wcy5vbk1vdXNlTW92ZSh7cG9zfSk7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5LCBtYXgtc3RhdGVtZW50cyAqL1xuICBAYXV0b2JpbmRcbiAgX29uV2hlZWwoZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCB2YWx1ZSA9IGV2ZW50LmRlbHRhWTtcbiAgICAvLyBGaXJlZm94IGRvdWJsZXMgdGhlIHZhbHVlcyBvbiByZXRpbmEgc2NyZWVucy4uLlxuICAgIGlmIChmaXJlZm94ICYmIGV2ZW50LmRlbHRhTW9kZSA9PT0gd2luZG93LldoZWVsRXZlbnQuRE9NX0RFTFRBX1BJWEVMKSB7XG4gICAgICB2YWx1ZSAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB9XG4gICAgaWYgKGV2ZW50LmRlbHRhTW9kZSA9PT0gd2luZG93LldoZWVsRXZlbnQuRE9NX0RFTFRBX0xJTkUpIHtcbiAgICAgIHZhbHVlICo9IDQwO1xuICAgIH1cblxuICAgIGxldCB0eXBlID0gdGhpcy5zdGF0ZS5tb3VzZVdoZWVsVHlwZTtcbiAgICBsZXQgdGltZW91dCA9IHRoaXMuc3RhdGUubW91c2VXaGVlbFRpbWVvdXQ7XG4gICAgbGV0IGxhc3RWYWx1ZSA9IHRoaXMuc3RhdGUubW91c2VXaGVlbExhc3RWYWx1ZTtcbiAgICBsZXQgdGltZSA9IHRoaXMuc3RhdGUubW91c2VXaGVlbFRpbWU7XG5cbiAgICBjb25zdCBub3cgPSAod2luZG93LnBlcmZvcm1hbmNlIHx8IERhdGUpLm5vdygpO1xuICAgIGNvbnN0IHRpbWVEZWx0YSA9IG5vdyAtICh0aW1lIHx8IDApO1xuXG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRpbWUgPSBub3c7XG5cbiAgICBpZiAodmFsdWUgIT09IDAgJiYgdmFsdWUgJSA0LjAwMDI0NDE0MDYyNSA9PT0gMCkge1xuICAgICAgLy8gVGhpcyBvbmUgaXMgZGVmaW5pdGVseSBhIG1vdXNlIHdoZWVsIGV2ZW50LlxuICAgICAgdHlwZSA9ICd3aGVlbCc7XG4gICAgICAvLyBOb3JtYWxpemUgdGhpcyB2YWx1ZSB0byBtYXRjaCB0cmFja3BhZC5cbiAgICAgIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSAvIDQpO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgIT09IDAgJiYgTWF0aC5hYnModmFsdWUpIDwgNCkge1xuICAgICAgLy8gVGhpcyBvbmUgaXMgZGVmaW5pdGVseSBhIHRyYWNrcGFkIGV2ZW50IGJlY2F1c2UgaXQgaXMgc28gc21hbGwuXG4gICAgICB0eXBlID0gJ3RyYWNrcGFkJztcbiAgICB9IGVsc2UgaWYgKHRpbWVEZWx0YSA+IDQwMCkge1xuICAgICAgLy8gVGhpcyBpcyBsaWtlbHkgYSBuZXcgc2Nyb2xsIGFjdGlvbi5cbiAgICAgIHR5cGUgPSBudWxsO1xuICAgICAgbGFzdFZhbHVlID0gdmFsdWU7XG5cbiAgICAgIC8vIFN0YXJ0IGEgdGltZW91dCBpbiBjYXNlIHRoaXMgd2FzIGEgc2luZ3VsYXIgZXZlbnQsIGFuZCBkZWxheSBpdCBieSB1cFxuICAgICAgLy8gdG8gNDBtcy5cbiAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiBzZXRUaW1lb3V0KCkge1xuICAgICAgICBjb25zdCBfdHlwZSA9ICd3aGVlbCc7XG4gICAgICAgIHRoaXMuX3pvb20oLXRoaXMuc3RhdGUubW91c2VXaGVlbExhc3RWYWx1ZSwgdGhpcy5zdGF0ZS5tb3VzZVdoZWVsUG9zKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VXaGVlbFR5cGU6IF90eXBlfSk7XG4gICAgICB9LmJpbmQodGhpcyksIDQwKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLl90eXBlKSB7XG4gICAgICAvLyBUaGlzIGlzIGEgcmVwZWF0aW5nIGV2ZW50LCBidXQgd2UgZG9uJ3Qga25vdyB0aGUgdHlwZSBvZiBldmVudCBqdXN0XG4gICAgICAvLyB5ZXQuXG4gICAgICAvLyBJZiB0aGUgZGVsdGEgcGVyIHRpbWUgaXMgc21hbGwsIHdlIGFzc3VtZSBpdCdzIGEgZmFzdCB0cmFja3BhZDtcbiAgICAgIC8vIG90aGVyd2lzZSB3ZSBzd2l0Y2ggaW50byB3aGVlbCBtb2RlLlxuICAgICAgdHlwZSA9IE1hdGguYWJzKHRpbWVEZWx0YSAqIHZhbHVlKSA8IDIwMCA/ICd0cmFja3BhZCcgOiAnd2hlZWwnO1xuXG4gICAgICAvLyBNYWtlIHN1cmUgb3VyIGRlbGF5ZWQgZXZlbnQgaXNuJ3QgZmlyZWQgYWdhaW4sIGJlY2F1c2Ugd2UgYWNjdW11bGF0ZVxuICAgICAgLy8gdGhlIHByZXZpb3VzIGV2ZW50ICh3aGljaCB3YXMgbGVzcyB0aGFuIDQwbXMgYWdvKSBpbnRvIHRoaXMgZXZlbnQuXG4gICAgICBpZiAodGltZW91dCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgdmFsdWUgKz0gbGFzdFZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNsb3cgZG93biB6b29tIGlmIHNoaWZ0IGtleSBpcyBoZWxkIGZvciBtb3JlIHByZWNpc2Ugem9vbWluZ1xuICAgIGlmIChldmVudC5zaGlmdEtleSAmJiB2YWx1ZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZSAvIDQ7XG4gICAgfVxuXG4gICAgLy8gT25seSBmaXJlIHRoZSBjYWxsYmFjayBpZiB3ZSBhY3R1YWxseSBrbm93IHdoYXQgdHlwZSBvZiBzY3JvbGxpbmcgZGV2aWNlXG4gICAgLy8gdGhlIHVzZXIgdXNlcy5cbiAgICBpZiAodHlwZSkge1xuICAgICAgdGhpcy5fem9vbSgtdmFsdWUsIHBvcyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb3VzZVdoZWVsVGltZTogdGltZSxcbiAgICAgIG1vdXNlV2hlZWxQb3M6IHBvcyxcbiAgICAgIG1vdXNlV2hlZWxUeXBlOiB0eXBlLFxuICAgICAgbW91c2VXaGVlbFRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICBtb3VzZVdoZWVsTGFzdFZhbHVlOiBsYXN0VmFsdWVcbiAgICB9KTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHksIG1heC1zdGF0ZW1lbnRzICovXG5cbiAgX3pvb20oZGVsdGEsIHBvcykge1xuXG4gICAgLy8gU2NhbGUgYnkgc2lnbW9pZCBvZiBzY3JvbGwgd2hlZWwgZGVsdGEuXG4gICAgbGV0IHNjYWxlID0gMiAvICgxICsgTWF0aC5leHAoLU1hdGguYWJzKGRlbHRhIC8gMTAwKSkpO1xuICAgIGlmIChkZWx0YSA8IDAgJiYgc2NhbGUgIT09IDApIHtcbiAgICAgIHNjYWxlID0gMSAvIHNjYWxlO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLm9uWm9vbSh7cG9zLCBzY2FsZX0pO1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fem9vbUVuZFRpbWVvdXQpO1xuICAgIHRoaXMuX3pvb21FbmRUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gX3NldFRpbWVvdXQoKSB7XG4gICAgICB0aGlzLnByb3BzLm9uWm9vbUVuZCgpO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9XCJjb250YWluZXJcIlxuICAgICAgICBvbk1vdXNlTW92ZT17IHRoaXMuX29uTW91c2VNb3ZlIH1cbiAgICAgICAgb25Nb3VzZURvd249eyB0aGlzLl9vbk1vdXNlRG93biB9XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyB0aGlzLl9vbk1vdXNlRG93biB9XG4gICAgICAgIG9uV2hlZWw9eyB0aGlzLl9vbldoZWVsIH1cbiAgICAgICAgc3R5bGU9eyB7XG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9IH0+XG5cbiAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cblxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5NYXBJbnRlcmFjdGlvbnMucHJvcFR5cGVzID0gUFJPUF9UWVBFUztcbk1hcEludGVyYWN0aW9ucy5kZWZhdWx0UHJvcHMgPSBERUZBVUxUX1BST1BTO1xuIl19