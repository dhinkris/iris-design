"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var widgets_css_1 = require("./widgets.css");
var core_colors_1 = require("../core/core.colors");
var core_utils_1 = require("../core/core.utils");
// interface WidgetParameter {
//   calibrationFactor: number;
//   frameIndex: number;
//   hideMesh: boolean;
//   hideHandleMesh: boolean;
//   ijk2LPS: THREE.Matrix4;
//   lps2IJK: THREE.Matrix4;
//   pixelSpacing: number;
//   stack: {};
//   ultrasoundRegions: Array<{}>;
//   worldPosition: THREE.Vector3;
// }
//
// interface USRegion {
//   x0: number;
//   x1: number;
//   y0: number;
//   y1: number;
//   axisX: number;
//   axisY: number;
//   deltaX: number;
//   deltaY: number;
// }
/**
 * @module Abstract Widget
 */
// tslint:disable-next-line
var widgetsBase = function (three) {
    if (three === void 0) { three = window.THREE; }
    if (three === undefined || three.Object3D === undefined) {
        return null;
    }
    var Constructor = three.Object3D;
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(targetMesh, controls, params) {
            var _this = _super.call(this) || this;
            _this._widgetType = 'Base';
            _this._params = params;
            if (params.hideMesh === true) {
                _this.visible = false;
            }
            var elementStyle = document.getElementById('ami-widgets');
            if (elementStyle === null) {
                var styleEl = document.createElement('style');
                styleEl.id = 'ami-widgets';
                styleEl.innerHTML = widgets_css_1["default"].code;
                document.head.appendChild(styleEl);
            }
            _this._enabled = true;
            _this._selected = false;
            _this._hovered = true;
            _this._active = true;
            _this._colors = {
                "default": core_colors_1.COLORS.blue,
                active: core_colors_1.COLORS.yellow,
                hover: core_colors_1.COLORS.red,
                select: core_colors_1.COLORS.green,
                text: core_colors_1.COLORS.white,
                error: core_colors_1.COLORS.lightRed
            };
            _this._color = _this._colors["default"];
            _this._dragged = false;
            // can not call it visible because it conflicts with THREE.Object3D
            _this._displayed = true;
            _this._targetMesh = targetMesh;
            _this._controls = controls;
            _this._camera = controls.object;
            _this._container = controls.domElement;
            _this._worldPosition = new three.Vector3(); // LPS position
            if (params.worldPosition) {
                _this._worldPosition.copy(params.worldPosition);
            }
            else if (_this._targetMesh !== null) {
                _this._worldPosition.copy(_this._targetMesh.position);
            }
            return _this;
        }
        class_1.prototype.initOffsets = function () {
            var box = this._container.getBoundingClientRect();
            var body = document.body;
            var docEl = document.documentElement;
            var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
            var clientTop = docEl.clientTop || body.clientTop || 0;
            var clientLeft = docEl.clientLeft || body.clientLeft || 0;
            this._offsets = {
                top: Math.round(box.top + scrollTop - clientTop),
                left: Math.round(box.left + scrollLeft - clientLeft)
            };
        };
        class_1.prototype.getMouseOffsets = function (event, container) {
            return {
                x: ((event.clientX - this._offsets.left) / container.offsetWidth) * 2 - 1,
                y: -((event.clientY - this._offsets.top) / container.offsetHeight) * 2 + 1,
                screenX: event.clientX - this._offsets.left,
                screenY: event.clientY - this._offsets.top
            };
        };
        /**
         * Get area of polygon.
         *
         * @param {Array} points Ordered vertices' coordinates
         *
         * @returns {Number}
         */
        class_1.prototype.getArea = function (points) {
            var area = 0;
            var j = points.length - 1; // the last vertex is the 'previous' one to the first
            for (var i = 0; i < points.length; i++) {
                area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
                j = i; // j is the previous vertex to i
            }
            return Math.abs(area / 2);
        };
        /**
         * Get index of ultrasound region by data coordinates.
         *
         * @param {Array}   regions US regions
         * @param {Vector3} point   Data coordinates
         *
         * @returns {Number|null}
         */
        class_1.prototype.getRegionByXY = function (regions, point) {
            var result = null;
            regions.some(function (region, ind) {
                if (point.x >= region.x0 &&
                    point.x <= region.x1 &&
                    point.y >= region.y0 &&
                    point.y <= region.y1) {
                    result = ind;
                    return true;
                }
            });
            return result;
        };
        /**
         * Get point inside ultrasound region by data coordinates.
         *
         * @param {Object}  region US region data
         * @param {Vector3} point  Data coordinates
         *
         * @returns {Vector2|null}
         */
        class_1.prototype.getPointInRegion = function (region, point) {
            if (!region) {
                return null;
            }
            return new three.Vector2((point.x - region.x0 - (region.axisX || 0)) * region.deltaX, (point.y - region.y0 - (region.axisY || 0)) * region.deltaY);
        };
        /**
         * Get point's ultrasound coordinates by data coordinates.
         *
         * @param {Array}   regions US regions
         * @param {Vector3} point   Data coordinates
         *
         * @returns {Vector2|null}
         */
        class_1.prototype.getUsPoint = function (regions, point) {
            return this.getPointInRegion(regions[this.getRegionByXY(regions, point)], point);
        };
        /**
         * Get distance between points inside ultrasound region.
         *
         * @param {Vector3} pointA Begin data coordinates
         * @param {Vector3} pointB End data coordinates
         *
         * @returns {Number|null}
         */
        class_1.prototype.getUsDistance = function (pointA, pointB) {
            var regions = this._params.ultrasoundRegions || [];
            if (regions.length < 1) {
                return null;
            }
            var regionA = this.getRegionByXY(regions, pointA);
            var regionB = this.getRegionByXY(regions, pointB);
            if (regionA === null ||
                regionB === null ||
                regionA !== regionB ||
                regions[regionA].unitsX !== 'cm' ||
                regions[regionA].unitsY !== 'cm') {
                return null;
            }
            return this.getPointInRegion(regions[regionA], pointA).distanceTo(this.getPointInRegion(regions[regionA], pointB));
        };
        /**
         * Get distance between points
         *
         * @param {Vector3} pointA Begin world coordinates
         * @param {Vector3} pointB End world coordinates
         * @param {number}  cf     Calibration factor
         *
         * @returns {Object}
         */
        class_1.prototype.getDistanceData = function (pointA, pointB, calibrationFactor) {
            var distance = null;
            var units = null;
            if (calibrationFactor) {
                distance = pointA.distanceTo(pointB) * calibrationFactor;
            }
            else if (this._params.ultrasoundRegions && this._params.lps2IJK) {
                var usDistance = this.getUsDistance(core_utils_1["default"].worldToData(this._params.lps2IJK, pointA), core_utils_1["default"].worldToData(this._params.lps2IJK, pointB));
                if (usDistance !== null) {
                    distance = usDistance * 10;
                    units = 'mm';
                }
                else {
                    distance = pointA.distanceTo(pointB);
                    units = this._params.pixelSpacing ? 'mm' : 'units';
                }
            }
            else {
                distance = pointA.distanceTo(pointB);
            }
            return {
                distance: distance,
                units: units
            };
        };
        class_1.prototype.getLineData = function (pointA, pointB) {
            var line = pointB.clone().sub(pointA);
            var center = pointB
                .clone()
                .add(pointA)
                .multiplyScalar(0.5);
            var length = line.length();
            var angle = line.angleTo(new three.Vector3(1, 0, 0));
            return {
                line: line,
                length: length,
                transformX: center.x - length / 2,
                transformY: center.y - this._container.offsetHeight,
                transformAngle: pointA.y < pointB.y ? angle : -angle,
                center: center
            };
        };
        class_1.prototype.getRectData = function (pointA, pointB) {
            var line = pointB.clone().sub(pointA);
            var vertical = line.clone().projectOnVector(new three.Vector3(0, 1, 0));
            var min = pointA.clone().min(pointB); // coordinates of the top left corner
            return {
                width: line
                    .clone()
                    .projectOnVector(new three.Vector3(1, 0, 0))
                    .length(),
                height: vertical.length(),
                transformX: min.x,
                transformY: min.y - this._container.offsetHeight,
                paddingVector: vertical.clone().normalize()
            };
        };
        /**
         * @param {HTMLElement} label
         * @param {Vector3}     point  label's center coordinates (default)
         * @param {Boolean}     corner if true, then point is the label's top left corner coordinates
         */
        class_1.prototype.adjustLabelTransform = function (label, point, corner) {
            var x = Math.round(point.x - (corner ? 0 : label.offsetWidth / 2));
            var y = Math.round(point.y - (corner ? 0 : label.offsetHeight / 2)) - this._container.offsetHeight;
            if (x < 0) {
                x = x > -label.offsetWidth ? 0 : x + label.offsetWidth;
            }
            else if (x > this._container.offsetWidth - label.offsetWidth) {
                x =
                    x < this._container.offsetWidth
                        ? this._container.offsetWidth - label.offsetWidth
                        : x - label.offsetWidth;
            }
            if (y < -this._container.offsetHeight) {
                y =
                    y > -this._container.offsetHeight - label.offsetHeight
                        ? -this._container.offsetHeight
                        : y + label.offsetHeight;
            }
            else if (y > -label.offsetHeight) {
                y = y < 0 ? -label.offsetHeight : y - label.offsetHeight;
            }
            return new three.Vector2(x, y);
        };
        class_1.prototype.worldToScreen = function (worldCoordinate) {
            var screenCoordinates = worldCoordinate.clone();
            screenCoordinates.project(this._camera);
            screenCoordinates.x = Math.round(((screenCoordinates.x + 1) * this._container.offsetWidth) / 2);
            screenCoordinates.y = Math.round(((-screenCoordinates.y + 1) * this._container.offsetHeight) / 2);
            screenCoordinates.z = 0;
            return screenCoordinates;
        };
        class_1.prototype.update = function () {
            // to be overloaded
            window.console.log('update() should be overloaded!');
        };
        class_1.prototype.updateColor = function () {
            if (this._active) {
                this._color = this._colors.active;
            }
            else if (this._hovered) {
                this._color = this._colors.hover;
            }
            else if (this._selected) {
                this._color = this._colors.select;
            }
            else {
                this._color = this._colors["default"];
            }
        };
        // tslint:disable-next-line
        class_1.prototype.setDefaultColor = function (color) {
            this._colors["default"] = color;
            if (this._handles) {
                this._handles.forEach(function (elem) { return (elem._colors["default"] = color); });
            }
            this.update();
        };
        class_1.prototype.show = function () {
            this.showDOM();
            this.showMesh();
            this.update();
            this._displayed = true;
        };
        class_1.prototype.hide = function () {
            this.hideDOM();
            this.hideMesh();
            this._displayed = false;
        };
        class_1.prototype.hideDOM = function () {
            // to be overloaded
            window.console.log('hideDOM() should be overloaded!');
        };
        class_1.prototype.showDOM = function () {
            // to be overloaded
            window.console.log('showDOM() should be overloaded!');
        };
        class_1.prototype.hideMesh = function () {
            this.visible = false;
        };
        class_1.prototype.showMesh = function () {
            if (this._params.hideMesh === true) {
                return;
            }
            this.visible = true;
        };
        class_1.prototype.free = function () {
            this._camera = null;
            this._container = null;
            this._controls = null;
            this._params = null;
            this._targetMesh = null;
        };
        Object.defineProperty(class_1.prototype, "widgetType", {
            get: function () {
                return this._widgetType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "targetMesh", {
            get: function () {
                return this._targetMesh;
            },
            set: function (targetMesh) {
                this._targetMesh = targetMesh;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "worldPosition", {
            get: function () {
                return this._worldPosition;
            },
            set: function (worldPosition) {
                this._worldPosition.copy(worldPosition);
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (enabled) {
                this._enabled = enabled;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (selected) {
                this._selected = selected;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "hovered", {
            get: function () {
                return this._hovered;
            },
            set: function (hovered) {
                this._hovered = hovered;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "dragged", {
            get: function () {
                return this._dragged;
            },
            set: function (dragged) {
                this._dragged = dragged;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "displayed", {
            get: function () {
                return this._displayed;
            },
            set: function (displayed) {
                this._displayed = displayed;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "active", {
            get: function () {
                return this._active;
            },
            set: function (active) {
                this._active = active;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "color", {
            get: function () {
                return this._color;
            },
            // tslint:disable-next-line
            set: function (color) {
                this._color = color;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(Constructor));
};
exports.widgetsBase = widgetsBase;
exports["default"] = widgetsBase();
