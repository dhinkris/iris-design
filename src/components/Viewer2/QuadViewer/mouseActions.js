import CoreUtils from "../ami-viewer/core/core.utils";
import WidgetsRuler from "../ami-viewer/widgets/widgets.ruler";
import * as THREE from "three";
import WidgetsHandle from "../ami-viewer/widgets/widgets.handle";
import WidgetsVoxelProbe from "../ami-viewer/widgets/widgets.voxelProbe";
import WidgetsAnnotation from "../ami-viewer/widgets/widgets.annotation";
import WidgetsRectangle from "../ami-viewer/widgets/widgets.rectangle";
import WidgetsFreehand from "../ami-viewer/widgets/widgets.freehand";

import WidgetsAngle from '../ami-viewer/widgets/widgets.angle';
import WidgetsBiRuler from '../ami-viewer/widgets/widgets.biruler';
import WidgetsCrossRuler from '../ami-viewer/widgets/widgets.crossRuler';
import WidgetsEllipse from '../ami-viewer/widgets/widgets.ellipse';
import WidgetsPolygon from '../ami-viewer/widgets/widgets.polygon';


class MouseActions{
    constructor(){
        this.mouse = null;
        this.camera = null;
        this.stackHelper = null;
        this.scene = null;
        this.controls = null;
        this.threeD = null;
        this._voxels = [];
        this.widget = null;
        this.intersects = null;
        this.coords=null;
        this.ijk = null;
        this.voxel = 0;
        this._mouseX = 0;
        this._mouseY = 0;
        // this[this.id].context = null;
        this.isDrawing = true;
        this.cursor = {
            color: '#d9d9d9',
            value: 10,
            size: 15,
            shape: 'round',
            segment: 'erase',
        };
    }

    mouseLocation(event) {
        const canvas = event.target.parentElement;
        var box = canvas.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;


        this.mouse = {
            x: ((event.clientX - Math.round(left)) / canvas.clientWidth) * 2 - 1,
            y: - ((event.clientY - Math.round(top)) / canvas.clientHeight) * 2 + 1,
            screenX: event.clientX - Math.round(left),
            screenY: event.clientY - Math.round(top)
        };

        // this.mouse = {
        //     x: ((event.clientX - Math.round(left)) / canvas.clientWidth) * 2 - 1,
        //     y: - ((event.clientY - Math.round(top)) / canvas.clientHeight) * 2 + 1,
        //     screenX: event.clientX ,
        //     screenY: event.clientY
        // };

    }

    drawCircle(x, y) {
        this[this.id].context.beginPath();
        this[this.id].context.arc(x, y, this.cursor.size, false, Math.PI * 2, false);
        this[this.id].context.closePath();
        this[this.id].context.fill();
        this[this.id].context.stroke();
    }

    getVoxel(dataCoordinates){
        this.dataCoordinates = dataCoordinates

        // update value
        this.value = CoreUtils.getPixelData(this.stackHelper.stack, this.dataCoordinates);

        this.voxel =
            this.value === null || this.stackHelper.stack.numberOfChannels > 1
                ? 'NA' // coordinates outside the image or RGB
                : CoreUtils.rescaleSlopeIntercept(
                this.value,
                this.stackHelper.stack.rescaleSlope,
                this.stackHelper.stack.rescaleIntercept
                ).toFixed();
    }

    updateRaycaster(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (this.intersects.length > 0) {
            this.ijk =
                CoreUtils.worldToData(this.stackHelper.stack.lps2IJK, this.intersects[0].point);
            this.r1.stackHelper.index =
                this.ijk.getComponent((this.r1.stackHelper.orientation + 2) % 3);
            this.r2.stackHelper.index =
                this.ijk.getComponent((this.r2.stackHelper.orientation + 2) % 3);
            this.r3.stackHelper.index =
                this.ijk.getComponent((this.r3.stackHelper.orientation + 2) % 3);
            this.getVoxel(this.ijk)
        }
    }

    getStack(event){
        const id = event.target.id;
        
        switch (id) {
            case '0':
                this.id='r0'
                this.camera = this.r0.camera;
                this.stackHelper = this.r0.stackHelper;
                this.scene = this.r0.scene;
                this.controls = this.r0.controls;
                this.threeD = this.r0.domElement;
                this._voxels = this.r0._voxels;
                this.canvas = this.r0.canvas;
                // this.textures2 = this.r0.textures2;
                break;
            case '1':
                this.id='r1'
                this.camera = this.r1.camera;
                this.stackHelper = this.r1.stackHelper;
                this.scene = this.r1.scene;
                this.controls = this.r1.controls;
                this.threeD = this.r1.domElement;
                this._voxels = this.r1._voxels;
                this.canvas = this.r1.canvas;
                // this.textures2 = this.r1.textures2;
                break;
            case '2':
                this.id='r2'
                this.camera = this.r2.camera;
                this.stackHelper = this.r2.stackHelper;
                this.scene = this.r2.scene;
                this.controls = this.r2.controls;
                this.threeD = this.r2.domElement;
                this._voxels = this.r2._voxels;
                this.canvas = this.r2.canvas;
                // this.textures2 = this.r2.textures2;
                break;
            case '3':
                this.id='r3'
                this.camera = this.r3.camera;
                this.stackHelper = this.r3.stackHelper;
                this.scene = this.r3.scene;
                this.controls = this.r3.controls;
                this.threeD = this.r3.domElement;
                this._voxels = this.r3._voxels;
                this.canvas = this.r3.canvas;
                // this.textures2 = this.r3.textures2;
                break;
        }
    }

    onMouseMove(event) {
        const id = event.target.id;
        this.mouseLocation(event)
        this.updateRaycaster()
        if (this.intersects.length>0){
            this.setState(
                {
                    coords: this.intersects,
                    ijk: this.ijk,
                    intensity: this.voxel
                })
        }
        this.onGreenChanged();
        this.onRedChanged();
        this.onYellowChanged();

    }

    onMouseMoveWindow(event){
        const id = event.target.id;
        this.mouseLocation(event)

        if (this._mouseX>this.mouse.screenX) {
            this.r1.stackHelper.slice.windowWidth-=this.mouse.screenX
            this.r2.stackHelper.slice.windowWidth-=this.mouse.screenX
            this.r3.stackHelper.slice.windowWidth-=this.mouse.screenX
        } else if (this._mouseX<this.mouse.screenX){
            this.r1.stackHelper.slice.windowWidth+=this.mouse.screenX
            this.r2.stackHelper.slice.windowWidth+=this.mouse.screenX
            this.r3.stackHelper.slice.windowWidth+=this.mouse.screenX
        } 
        else if (this._mouseY>this.mouse.screenY){
            this.r1.stackHelper.slice.windowCenter-=this.mouse.screenY
            this.r2.stackHelper.slice.windowCenter-=this.mouse.screenY
            this.r3.stackHelper.slice.windowCenter-=this.mouse.screenY
        }else {
            this.r1.stackHelper.slice.windowCenter+=this.mouse.screenY
            this.r2.stackHelper.slice.windowCenter+=this.mouse.screenY
            this.r3.stackHelper.slice.windowCenter+=this.mouse.screenY
        }
        

        this.setState({
            r1: {
                width:this.r1.stackHelper.slice.windowWidth,
                center:this.r1.stackHelper.slice.windowCenter,
                l_thr:this.r1.stackHelper.slice.lowerThreshold,
                u_thr:this.r1.stackHelper.slice.upperThreshold,
                direction: this.r1.camera.directionsLabel

            },
            r2: {
                width:this.r2.stackHelper.slice.windowWidth,
                center:this.r2.stackHelper.slice.windowCenter,
                l_thr:this.r2.stackHelper.slice.lowerThreshold,
                u_thr:this.r2.stackHelper.slice.upperThreshold,
                direction: this.r2.camera.directionsLabel

            },
            r3: {
                width:this.r3.stackHelper.slice.windowWidth,
                center:this.r3.stackHelper.slice.windowCenter,
                l_thr:this.r3.stackHelper.slice.lowerThreshold,
                u_thr:this.r3.stackHelper.slice.upperThreshold,
                direction: this.r3.camera.directionsLabel

            }
        })
        this._mouseX=this.mouse.screenX
        this._mouseY=this.mouse.screenY
    }

    onMouseMoveWidget(event) {
        let cursor = 'default';
        for (let widget of this.widgets) {
            widget.onMove(event);
            if (widget.hovered) {
                cursor = 'pointer';
            }
        }
        this.threeD.style.cursor = cursor;
    }

    onMouseDownWidget(event) {
        // this.updateRaycaster()
    }

    onMouseUpWidget() {
        for (let widget of this.widgets) {
            if (widget.active) {
                widget.onEnd();
                return;
            }
        }
    }

    distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    updateIJKBBox() {
        this.ijkBBox = [this[this.id].stackHelper._stack._columns, 0, this[this.id].stackHelper._stack._rows, 0, this[this.id].stackHelper._stack.frame.length, 0];
        // IJK BBox of the plane
        let slice = this[this.id].stackHelper._slice;
        let vertices = slice._geometry.vertices;
        // to LPS
        for (let i = 0; i < vertices.length; i++) {
            let wc = new THREE.Vector3(vertices[i].x, vertices[i].y, vertices[i].z).applyMatrix4(
                this[this.id].stackHelper.stack._ijk2LPS
            );
            let dc = wc.applyMatrix4(this[this.id].stackHelper._stack._lps2IJK);
            dc.x = Math.round(dc.x * 10) / 10;
            dc.y = Math.round(dc.y * 10) / 10;
            dc.z = Math.round(dc.z * 10) / 10;

            if (dc.x < this.ijkBBox[0]) {
                this.ijkBBox[0] = dc.x;
            }
            if (dc.x > this.ijkBBox[1]) {
                this.ijkBBox[1] = dc.x;
            }

            // Y
            if (dc.y < this.ijkBBox[2]) {
                this.ijkBBox[2] = dc.y;
            }
            if (dc.y > this.ijkBBox[3]) {
                this.ijkBBox[3] = dc.y;
            }

            // Z
            if (dc.z < this.ijkBBox[4]) {
                this.ijkBBox[4] = dc.z;
            }
            if (dc.z > this.ijkBBox[5]) {
                this.ijkBBox[5] = dc.z;
            }
        }

        // round min up and max down
        this.ijkBBox[0] = Math.ceil(this.ijkBBox[0]);
        this.ijkBBox[2] = Math.ceil(this.ijkBBox[2]);
        this.ijkBBox[4] = Math.ceil(this.ijkBBox[4]);
        this.ijkBBox[1] = Math.floor(this.ijkBBox[1]);
        this.ijkBBox[3] = Math.floor(this.ijkBBox[3]);
        this.ijkBBox[5] = Math.floor(this.ijkBBox[5]);
    }

    mapCanvasToData() {
        for (let i = this.ijkBBox[0]; i < this.ijkBBox[1] + 1; i++) {
            for (let j = this.ijkBBox[2]; j < this.ijkBBox[3] + 1; j++) {
                for (let k = this.ijkBBox[4]; k < this.ijkBBox[5] + 1; k++) {
                    // ijk to world
                    // center of voxel
                    let worldCoordinate = new THREE.Vector3(i, j, k).applyMatrix4(this[this.id].stack2._ijk2LPS);
                    // world to screen coordinate
                    let screenCoordinates = worldCoordinate.clone();
                    screenCoordinates.project(this.camera);

                    screenCoordinates.x = Math.round(((screenCoordinates.x + 1) * this.canvas.offsetWidth) / 2);
                    screenCoordinates.y = Math.round(((-screenCoordinates.y + 1) * this.canvas.offsetHeight) / 2);
                    screenCoordinates.z = 0;

                    let pixel = this[this.id].context.getImageData(screenCoordinates.x, screenCoordinates.y, 1, 1).data;
                    if (pixel[3] > 0 && i >= 0 && j >= 0 && k >= 0) {
                        // find index and texture
                        // let voxelIndex = i + j * this[this.id].stack2._columns + k * this[this.id].stack2._rows * this[this.id].stack2._columns;
                        let voxelIndex = i
                            + j * this[this.id].stack2._columns
                            + k * this[this.id].stack2._rows * this[this.id].stack2._columns;
                        voxelIndex *= 4;

                        let textureSize = this[this.id].uniformsLayer1.uTextureSize.value;
                        let textureDimension = textureSize * textureSize;

                        let rawDataIndex = ~~(voxelIndex / textureDimension);
                        let inRawDataIndex = voxelIndex % textureDimension;

                        // update value...
                        let rawData=this[this.id].stack2._rawData
                        let oldValue =
                            (this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex + 3] << 24) |
                            (this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex + 2] << 16) |
                            (this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex + 1] << 8) |
                            (this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex]);

                        let newValue = this.cursor.value;
                        if (oldValue != newValue) {
                            // update raw data NEW
                            this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex] =  (newValue) & 0x000000FF;
                            this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex+1] = (newValue >>> 8) & 0x000000FF;
                            this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex+2] = (newValue >>> 16) & 0x000000FF;
                            this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex+3] = (newValue >>> 24) & 0x000000FF;
                            //update raw data OLD
                            //stack2.rawData[rawDataIndex][inRawDataIndex] = newValue;
                            // update texture that is passed to shader
                            this[this.id].textures2[rawDataIndex].image.data = this[this.id].stack2._rawData[rawDataIndex];// tex;
                            this[this.id].textures2[rawDataIndex].needsUpdate = true;

                            // // update raw data
                            // this[this.id].stack2._rawData[rawDataIndex][inRawDataIndex] = (newValue) & 0x000000FF;
                            // // update texture that is passed to shader
                            // this[this.id].textures2[rawDataIndex].image.data = this[this.id].stack2._rawData[rawDataIndex]; // tex;
                            // this[this.id].textures2[rawDataIndex].needsUpdate = true;

                            // update stats
                            // editorStats[oldValue] -= 1;
                            // editorStats[newValue] += 1;
                        }
                    }
                }
            }
        }
        this.onRedChanged();
        this.onYellowChanged();
        this.onGreenChanged();
    }

    initEditorStats() {
        let nbVoxels = this.stack2._columns * this.stack2._rows * this.stack2._frame.length;
        let textureSize = 4096;
        let textureDimension = textureSize * textureSize;

        for (let i = 0; i < nbVoxels; i++) {
            let rawDataIndex = ~~(i / textureDimension);
            let inRawDataIndex = i % textureDimension;
            let value = this.stack2.rawData[rawDataIndex][inRawDataIndex];
            this.editorStats[value] += 1;
        }

        // updateEditorStatsDom();
    }

    onMouseDownBrush(e) {
        if (!this.isEditing) return;

        this.isDrawing = true;
        this.mouseLocation(e)
        this.lastPoint = this.mouse
    }

    onMouseMoveBrush(e) {
        if (!this.isEditing) return;
        this.mouseLocation(e)
        this.currentPoint = this.mouse
        this[this.id].context.strokeStyle = this.cursor.color;
        this[this.id].context.globalCompositeOperation = 'xor';
        this[this.id].context.globalAlpha = 0.5;
        this[this.id].context.fillStyle = this.cursor.color;

        if (this.isDrawing) {
            let dist = this.distanceBetween(this.lastPoint, this.currentPoint);
            let angle = this.angleBetween(this.lastPoint, this.currentPoint);

            for (let i = 0; i < dist; i += 5) {
                let x = this.lastPoint.screenX + Math.sin(angle) * i;
                let y = this.lastPoint.screenY+ Math.cos(angle) * i;
                this.drawCircle(x, y);
            }

            this.lastPoint = this.currentPoint;
        } else {
            this.clearCanvas();
            return
        }

        // draw under the cursor
        this[this.id].context.globalCompositeOperation = 'source-over';
        this[this.id].context.globalAlpha = 1;
        this[this.id].context.fillStyle = 'rgba(0, 0, 0, 0)';
        this.drawCircle(this.currentPoint.x, this.currentPoint.y);
    }

    onMouseUpBrush(e) {
        if (!this.isEditing) return;

        this.isDrawing = true;

        this.mapCanvasToData();
        this.clearCanvas();
        // this.updateEditorStatsDom();
        // draw cursor under mouse
        this.isEditing = false;
        this.onMouseMoveBrush(e);
    }


    // updateDOM() {
    //     // lets events go through or not for scrolling, padding, zooming, etc.
    //     if (isEditing) {
    //         canvasDiv.className = 'editing';
    //         document.getElementById('help').style.display = 'none';
    //     } else {
    //         canvasDiv.className = 'exploring';
    //         document.getElementById('help').style.display = 'block';
    //     }
    // }

    onKeyDown(e) {
        if (e.keyCode === 17) {
            this.isEditing = true;
            this.isDrawing = false;
            this.updateDOM();
        }
    }

    onKeyUp(e) {
        if (e.keyCode === 17) {
            this.isEditing = false;
            this.isDrawing = false;
            this.clearCanvas();
            this.updateDOM();
        }
    }

    disableRightClick(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    clearCanvas() {
        this[this.id].context.clearRect(0, 0, this[this.id].context.canvas.width, this[this.id].context.canvas.height);
    }
    // add events listeners
    // window.addEventListener('keydown', onKeyDown, false);
    // window.addEventListener('keyup', onKeyUp, false);
    // canvasDiv.addEventListener('contextmenu', disableRightClick, false);

    onMouseDown (event) {
        for (let widget of this.widgets) {
            if (widget.hovered) {
                widget.onStart(event);
                return;
            }
        }

        this.mouseLocation(event)
        this.getStack(event)
        this.raycaster = new THREE.Raycaster();
        this.lastPoint = this.mouse;
        this.ijkBBox = [99999999, 0, 9999999, 0, 999999999, 0];
        // this.updateRaycaster()
        this.updateIJKBox()

        switch (this.state.selected) {
            case 'MouseProbe':
                this.onMouseUp = (event)=> {
                    this.threeD.removeEventListener('mousemove', this.onMouseMove)
                    this.threeD.removeEventListener('mouseup', this.onMouseUp)
                }

                this.threeD.addEventListener('mousemove', this.onMouseMove);
                this.threeD.addEventListener('mouseup', this.onMouseUp);
                break;
            case 'Handle':
                this.updateRaycaster()
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);

                this.widget = new WidgetsHandle(this.stackHelper.slice.mesh, this.controls, {
                    worldPosition: this.intersects[0].point,
                });
                break;
            case 'PaintBrush':
                this.isEditing = true;
                this.isDrawing = true;
                this.cursor = {
                    color: this.state.pickedColor,
                    value: 20,
                    size: this.state.brushsize,
                    shape: 'round',
                    segment: 'erase',
                };
                this.threeD.addEventListener('mousedown', this.onMouseDownBrush, false);
                this.threeD.addEventListener('mousemove', this.onMouseMoveBrush, false);
                this.threeD.addEventListener('mouseup', this.onMouseUpBrush, false);
                break;
            case 'Eraser':
                break;
            case 'VoxelProbe':
                this.updateRaycaster()
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);

                this.widget = new WidgetsVoxelProbe(this.stackHelper.slice.mesh, this.controls, {
                    stack: this.stackHelper.stack,
                    worldPosition: this.intersects[0].point,
                });
                break;

            case 'Ruler':
                this.updateRaycaster()
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);

                this.widget = new WidgetsRuler(this.stackHelper.slice.mesh, this.controls, {
                    lps2IJK: this.stackHelper.stack.lps2IJK,
                    pixelSpacing: this.stackHelper.stack.frame[this.stackHelper.index].pixelSpacing,
                    ultrasoundRegions: this.stackHelper.stack.frame[this.stackHelper.index].ultrasoundRegions,
                    worldPosition: this.intersects[0].point,
                });
                break;

            case 'Window':
                this.onMouseUpWindow = (event)=> {
                    this.threeD.removeEventListener('mousemove', this.onMouseMoveWindow)
                    this.threeD.removeEventListener('mouseup', this.onMouseUpWindow)
                }

                this.threeD.addEventListener('mousemove', this.onMouseMoveWindow);
                this.threeD.addEventListener('mouseup', this.onMouseUpWindow);
                break;

            case 'Annotation':
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);

                this.widget = new WidgetsAnnotation(this.stackHelper.slice.mesh, this.controls, {
                    worldPosition: this.intersects[0].point,
                });
                break;

            case 'Rectangle':
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);

                this.widget = new WidgetsRectangle(this.stackHelper.slice.mesh, this.controls, {
                    frameIndex: this.stackHelper.index,
                    stack: this.stackHelper.stack,
                    worldPosition: this.intersects[0].point,
                });
                break;

            case 'Freehand':
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);

                this.widget = new WidgetsFreehand(this.stackHelper.slice.mesh, this.controls, {
                    frameIndex: this.stackHelper.index,
                    stack: this.stackHelper.stack,
                    worldPosition: this.intersects[0].point,
                });
                break;

            case 'WidgetsAngle':
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);

                this.widget = new WidgetsAngle(this.stackHelper.slice.mesh, this.controls, {
                    worldPosition: this.intersects[0].point,
                });
                break;

            case 'WidgetsBiRuler':
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);

                this.widget = new WidgetsBiRuler(this.stackHelper.slice.mesh, this.controls, {
                    lps2IJK: this.stackHelper.stack.lps2IJK,
                    pixelSpacing: this.stackHelper.stack.frame[this.stackHelper.index].pixelSpacing,
                    ultrasoundRegions: this.stackHelper.stack.frame[this.stackHelper.index].ultrasoundRegions,
                    worldPosition: this.intersects[0].point,
                });
                break;

            case 'WidgetsCrossRuler':
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);
                this.widget = new WidgetsCrossRuler(this.stackHelper.slice.mesh, this.controls, {
                    lps2IJK: this.stackHelper.stack.lps2IJK,
                    pixelSpacing: this.stackHelper.stack.frame[this.stackHelper.index].pixelSpacing,
                    ultrasoundRegions: this.stackHelper.stack.frame[this.stackHelper.index].ultrasoundRegions,
                });
                break;

            case 'WidgetsEllipse':
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);
                this.widget = new WidgetsEllipse(this.stackHelper.slice.mesh, this.controls, {
                    frameIndex: this.stackHelper.index,
                    stack: this.stackHelper.stack,
                    worldPosition: this.intersects[0].point,
                });
                break;

            case 'WidgetsPolygon':
                this.threeD.addEventListener('mouseup', this.onMouseUpWidget);
                this.threeD.addEventListener('mousemove', this.onMouseMoveWidget);
                this.threeD.addEventListener('mousemove', this.onMouseDownWidget);
                this.widget = new WidgetsPolygon(this.stackHelper.slice.mesh, this.controls, {
                    frameIndex: this.stackHelper.index,
                    stack: this.stackHelper.stack,
                    worldPosition: this.intersects[0].point,
                });
                break;

        }

        if (this.widget){
            this.widgets.push(this.widget);
            this.setState({
                widget: this.widgets
            })
            this.scene.add(this.widget);
        }

        this.onGreenChanged();
        this.onRedChanged();
        this.onYellowChanged();
    }

    onScroll(event) {
        this.getStack(event)

        if (event.delta > 0) {
            if (this.stackHelper.index >= this.stackHelper.orientationMaxIndex - 1) {
                return false;
            }
            this.stackHelper.index += 1;
        } else {
            if (this.stackHelper.index <= 0) {
                return false;
            }
            this.stackHelper.index -= 1;
        }

        this.onGreenChanged();
        this.onRedChanged();
        this.onYellowChanged();
    }

    onPanZoom(event) {
        this[this.id].camera.canvas = {
            width: this[this.id].domElement.clientWidth,
            height: this[this.id].domElement.clientHeight,
        };
        this[this.id].camera.fitBox(2, 1);
        this[this.id].renderer.setSize(
            this[this.id].domElement.clientWidth,
            this[this.id].domElement.clientHeight);

        // update info to draw borders properly
        this[this.id].stackHelper.slice.canvasWidth =
            this[this.id].domElement.clientWidth;
        this[this.id].stackHelper.slice.canvasHeight =
            this[this.id].domElement.clientHeight;
        this[this.id].localizerHelper.canvasWidth =
            this[this.id].domElement.clientWidth;
        this[this.id].localizerHelper.canvasHeight =
            this[this.id].domElement.clientHeight;
    }
}

export {MouseActions}
// export default MouseActions();




