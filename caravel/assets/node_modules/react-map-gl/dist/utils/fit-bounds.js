'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fitBounds;

var _transform = require('./transform');

var _transform2 = _interopRequireDefault(_transform);

var _mapboxGl = require('mapbox-gl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns map settings {latitude, longitude, zoom}
 * that will contain the provided corners within the provided
 * width.
 * @param {Number} width - viewport width
 * @param {Number} height - viewport height
 * @param {Array} bounds - [[lat,lon], [lat,lon]]
 * @param {Number} options.padding - viewport width
 * @returns {Object} - latitude, longitude and zoom
 */
// Copyright (c) 2015 Uber Technologies, Inc.

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

// NOTE: Transform is not a public API so we should be careful to always lock
// down mapbox-gl to a specific major, minor, and patch version.
function fitBounds(width, height, bounds) {
  var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var _ref$padding = _ref.padding;
  var padding = _ref$padding === undefined ? 0 : _ref$padding;

  var _bounds = new _mapboxGl.LngLatBounds([bounds[0].reverse(), bounds[1].reverse()]);
  var offset = _mapboxGl.Point.convert([0, 0]);
  var tr = new _transform2.default();
  tr.width = width;
  tr.height = height;
  var nw = tr.project(_bounds.getNorthWest());
  var se = tr.project(_bounds.getSouthEast());
  var size = se.sub(nw);
  var scaleX = (tr.width - padding * 2 - Math.abs(offset.x) * 2) / size.x;
  var scaleY = (tr.height - padding * 2 - Math.abs(offset.y) * 2) / size.y;

  var center = tr.unproject(nw.add(se).div(2));
  var zoom = tr.scaleZoom(tr.scale * Math.min(scaleX, scaleY));
  return {
    latitude: center.lat,
    longitude: center.lng,
    zoom: zoom
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maXQtYm91bmRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQW1Dd0IsUzs7QUFieEI7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7O0FBekJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFjZSxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsTUFBMUIsRUFBa0MsTUFBbEMsRUFFUDtBQUFBLG1FQUFKLEVBQUk7O0FBQUEsMEJBRE4sT0FDTTtBQUFBLE1BRE4sT0FDTSxnQ0FESSxDQUNKOztBQUNOLE1BQU0sVUFBVSwyQkFBaUIsQ0FDL0IsT0FBTyxDQUFQLEVBQVUsT0FBVixFQUQrQixFQUUvQixPQUFPLENBQVAsRUFBVSxPQUFWLEVBRitCLENBQWpCLENBQWhCO0FBSUEsTUFBTSxTQUFTLGdCQUFNLE9BQU4sQ0FBYyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWQsQ0FBZjtBQUNBLE1BQU0sS0FBSyx5QkFBWDtBQUNBLEtBQUcsS0FBSCxHQUFXLEtBQVg7QUFDQSxLQUFHLE1BQUgsR0FBWSxNQUFaO0FBQ0EsTUFBTSxLQUFLLEdBQUcsT0FBSCxDQUFXLFFBQVEsWUFBUixFQUFYLENBQVg7QUFDQSxNQUFNLEtBQUssR0FBRyxPQUFILENBQVcsUUFBUSxZQUFSLEVBQVgsQ0FBWDtBQUNBLE1BQU0sT0FBTyxHQUFHLEdBQUgsQ0FBTyxFQUFQLENBQWI7QUFDQSxNQUFNLFNBQVMsQ0FBQyxHQUFHLEtBQUgsR0FBVyxVQUFVLENBQXJCLEdBQXlCLEtBQUssR0FBTCxDQUFTLE9BQU8sQ0FBaEIsSUFBcUIsQ0FBL0MsSUFBb0QsS0FBSyxDQUF4RTtBQUNBLE1BQU0sU0FBUyxDQUFDLEdBQUcsTUFBSCxHQUFZLFVBQVUsQ0FBdEIsR0FBMEIsS0FBSyxHQUFMLENBQVMsT0FBTyxDQUFoQixJQUFxQixDQUFoRCxJQUFxRCxLQUFLLENBQXpFOztBQUVBLE1BQU0sU0FBUyxHQUFHLFNBQUgsQ0FBYSxHQUFHLEdBQUgsQ0FBTyxFQUFQLEVBQVcsR0FBWCxDQUFlLENBQWYsQ0FBYixDQUFmO0FBQ0EsTUFBTSxPQUFPLEdBQUcsU0FBSCxDQUFhLEdBQUcsS0FBSCxHQUFXLEtBQUssR0FBTCxDQUFTLE1BQVQsRUFBaUIsTUFBakIsQ0FBeEIsQ0FBYjtBQUNBLFNBQU87QUFDTCxjQUFVLE9BQU8sR0FEWjtBQUVMLGVBQVcsT0FBTyxHQUZiO0FBR0w7QUFISyxHQUFQO0FBS0QiLCJmaWxlIjoiZml0LWJvdW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIE5PVEU6IFRyYW5zZm9ybSBpcyBub3QgYSBwdWJsaWMgQVBJIHNvIHdlIHNob3VsZCBiZSBjYXJlZnVsIHRvIGFsd2F5cyBsb2NrXG4vLyBkb3duIG1hcGJveC1nbCB0byBhIHNwZWNpZmljIG1ham9yLCBtaW5vciwgYW5kIHBhdGNoIHZlcnNpb24uXG5pbXBvcnQgVHJhbnNmb3JtIGZyb20gJy4vdHJhbnNmb3JtJztcbmltcG9ydCB7TG5nTGF0Qm91bmRzLCBQb2ludH0gZnJvbSAnbWFwYm94LWdsJztcblxuLyoqXG4gKiBSZXR1cm5zIG1hcCBzZXR0aW5ncyB7bGF0aXR1ZGUsIGxvbmdpdHVkZSwgem9vbX1cbiAqIHRoYXQgd2lsbCBjb250YWluIHRoZSBwcm92aWRlZCBjb3JuZXJzIHdpdGhpbiB0aGUgcHJvdmlkZWRcbiAqIHdpZHRoLlxuICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gdmlld3BvcnQgd2lkdGhcbiAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSB2aWV3cG9ydCBoZWlnaHRcbiAqIEBwYXJhbSB7QXJyYXl9IGJvdW5kcyAtIFtbbGF0LGxvbl0sIFtsYXQsbG9uXV1cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnBhZGRpbmcgLSB2aWV3cG9ydCB3aWR0aFxuICogQHJldHVybnMge09iamVjdH0gLSBsYXRpdHVkZSwgbG9uZ2l0dWRlIGFuZCB6b29tXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpdEJvdW5kcyh3aWR0aCwgaGVpZ2h0LCBib3VuZHMsIHtcbiAgcGFkZGluZyA9IDBcbn0gPSB7fSkge1xuICBjb25zdCBfYm91bmRzID0gbmV3IExuZ0xhdEJvdW5kcyhbXG4gICAgYm91bmRzWzBdLnJldmVyc2UoKSxcbiAgICBib3VuZHNbMV0ucmV2ZXJzZSgpXG4gIF0pO1xuICBjb25zdCBvZmZzZXQgPSBQb2ludC5jb252ZXJ0KFswLCAwXSk7XG4gIGNvbnN0IHRyID0gbmV3IFRyYW5zZm9ybSgpO1xuICB0ci53aWR0aCA9IHdpZHRoO1xuICB0ci5oZWlnaHQgPSBoZWlnaHQ7XG4gIGNvbnN0IG53ID0gdHIucHJvamVjdChfYm91bmRzLmdldE5vcnRoV2VzdCgpKTtcbiAgY29uc3Qgc2UgPSB0ci5wcm9qZWN0KF9ib3VuZHMuZ2V0U291dGhFYXN0KCkpO1xuICBjb25zdCBzaXplID0gc2Uuc3ViKG53KTtcbiAgY29uc3Qgc2NhbGVYID0gKHRyLndpZHRoIC0gcGFkZGluZyAqIDIgLSBNYXRoLmFicyhvZmZzZXQueCkgKiAyKSAvIHNpemUueDtcbiAgY29uc3Qgc2NhbGVZID0gKHRyLmhlaWdodCAtIHBhZGRpbmcgKiAyIC0gTWF0aC5hYnMob2Zmc2V0LnkpICogMikgLyBzaXplLnk7XG5cbiAgY29uc3QgY2VudGVyID0gdHIudW5wcm9qZWN0KG53LmFkZChzZSkuZGl2KDIpKTtcbiAgY29uc3Qgem9vbSA9IHRyLnNjYWxlWm9vbSh0ci5zY2FsZSAqIE1hdGgubWluKHNjYWxlWCwgc2NhbGVZKSk7XG4gIHJldHVybiB7XG4gICAgbGF0aXR1ZGU6IGNlbnRlci5sYXQsXG4gICAgbG9uZ2l0dWRlOiBjZW50ZXIubG5nLFxuICAgIHpvb21cbiAgfTtcbn1cbiJdfQ==