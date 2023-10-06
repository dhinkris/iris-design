import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import Stats from 'stats-js';
import CamerasOrthographic from '../ami/src/cameras/cameras.orthographic';
import ControlsOrthographic from '../ami/src/controls/controls.trackballortho';
import CoreUtils from '../ami/src/core/core.utils';
import HelpersBoundingBox from '../ami/src/helpers/helpers.boundingbox';
import HelpersContour from '../ami/src/helpers/helpers.contour';
import HelpersLocalizer from '../ami/src/helpers/helpers.localizer';
import HelpersStack from '../ami/src/helpers/helpers.stack';
import ControlsTrackball from '../ami/src/controls/controls.trackball';
import LoadersVolume from '../ami/src/loaders/loaders.volume';

import ShadersFragment from "../ami/src/shaders/shaders.data.fragment";
import ShadersUniform from "../ami/src/shaders/shaders.data.uniform";
import ShadersVertex from "../ami/src/shaders/shaders.data.vertex";
import ShadersLayerUniform from "../ami/src/shaders/shaders.layer.uniform";
import PresetsSegmentation from "../ami/src/presets/presets.segmentation";
import HelpersSegmentationLut from "../ami/src/helpers/helpers.segmentationlut";

import HelpersLut from "../ami/src/helpers/helpers.lut.js";

// Layer
import ShadersLayerUniforms from "../ami/src/shaders/shaders.layer.uniform.js";
import ShadersLayerFragment from "../ami/src/shaders/shaders.layer.fragment.js";
import ShadersLayerVertex from "../ami/src/shaders/shaders.layer.vertex.js";
import WidgetsVoxelProbe from '../ami/src/widgets/widgets.voxelProbe';
import WidgetsFreehand from '../ami/src/widgets/widgets.freehand';

import * as AllActions from "../../../actions";
import nifti from 'nifti-reader-js';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Button, Card, Input } from 'antd';

// import FreeSurferLoader from './FreeSurferLoader';
import dat from 'dat.gui';
import {withStyles} from "@material-ui/core/styles";
import { CloseCircleOutlined } from '@ant-design/icons';

// From: https://github.com/freesurfer/freesurfer
// // utils/mrisurf.c
// // the magic number is 3 bytes although this has it listed as 4.
// // FreeSurferLoader.QUAD_FILE_MAGIC_NUMBER = -1 & 0x00ffffff;
// // FreeSurferLoader.TRIANGLE_FILE_MAGIC_NUMBER = -2 & 0x00ffffff;
// // FreeSurferLoader.NEW_QUAD_FILE_MAGIC_NUMBER = -3 & 0x00ffffff;
// // standard global variables



let InputGroup = Input.Group



let stats;
let ready = false;
let controls;
let camera;
let scene;

let redContourHelper = null;
let redTextureTarget = null;
let redContourScene = null;
let widgets = [];

let intersects;
let coordsList = [];

const widgetsAvailable = [
    'Handle',
    'Freehand',
]
const guiObjects = {
    type: 'Freehand',
};
let layer1 = {
    opacity: 0.5,
    lut: null,
    interpolation: 1,
};

let layerMix = {
    opacity0: 1.0,
    opacity1: 1.0,
    type0: 0,
    type1: 1,
    trackMouse: true,
};
// 3d renderer
const r0 = {
    domId: 'view3d',
    domElement: null,
    renderer: null,
    color: 0x212121,
    targetID: 0,
    camera: null,
    controls: null,
    scene: null,
    light: null,
};

// 2d axial renderer
const r1 = {
    domId: 'view1',
    domElement: null,
    renderer: null,
    color: 0x121212,
    sliceOrientation: 'axial',
    sliceColor: 0xFF1744,
    targetID: 1,
    camera: null,
    controls: null,
    scene: null,
    light: null,
    stackHelper: null,
    localizerHelper: null,
    localizerScene: null,
};

// 2d sagittal renderer
const r2 = {
    domId: 'view2',
    domElement: null,
    renderer: null,
    color: 0x121212,
    sliceOrientation: 'sagittal',
    sliceColor: 0xFFEA00,
    targetID: 2,
    camera: null,
    controls: null,
    scene: null,
    light: null,
    stackHelper: null,
    localizerHelper: null,
    localizerScene: null,
};


// 2d coronal renderer
const r3 = {
    domId: 'view3',
    domElement: null,
    renderer: null,
    color: 0x121212,
    sliceOrientation: 'coronal',
    sliceColor: 0x76FF03,
    targetID: 3,
    camera: null,
    controls: null,
    scene: null,
    light: null,
    stackHelper: null,
    localizerHelper: null,
    localizerScene: null,
};
let dataInfo = [
    [
        'adi1',
        {
            label: 'Left',
            loaded: false,
            material: null,
            materialFront: null,
            materialBack: null,
            mesh: null,
            meshFront: null,
            meshBack: null,
            color: 0xe91e63,
            opacity: 0.8,
        },
    ],
    [
        'adi2',
        {
            label: 'Right',
            loaded: false,
            material: null,
            materialFront: null,
            materialBack: null,
            mesh: null,
            meshFront: null,
            meshBack: null,
            color: 0x03a9f4,
            opacity: 1,
        },
    ],
];
let data = new Map(dataInfo);

// extra variables to show mesh plane intersections in 2D renderers
// extra variables to show mesh plane intersections in 2D renderers
let sceneClip = new THREE.Scene();
let clipPlane1 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
let clipPlane2 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
let clipPlane3 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);


function initRenderer3D(renderObj) {
    // renderer
    renderObj.domElement = document.getElementById(renderObj.domId);
    renderObj.renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderObj.renderer.setSize(renderObj.domElement.clientWidth, renderObj.domElement.clientHeight);
    renderObj.renderer.setClearColor(renderObj.color, 1);
    renderObj.renderer.domElement.id = renderObj.targetID;
    renderObj.domElement.appendChild(renderObj.renderer.domElement);

    // camera
    renderObj.camera = new THREE.PerspectiveCamera(
        45,
        renderObj.domElement.clientWidth / renderObj.domElement.clientHeight,
        0.1,
        100000
    );
    renderObj.camera.position.x = 250;
    renderObj.camera.position.y = 250;
    renderObj.camera.position.z = 250;

    // controls
    renderObj.controls = new ControlsTrackball(renderObj.camera, renderObj.domElement);
    renderObj.controls.rotateSpeed = 5.5;
    renderObj.controls.zoomSpeed = 1.2;
    renderObj.controls.panSpeed = 0.8;
    renderObj.controls.staticMoving = true;
    renderObj.controls.dynamicDampingFactor = 0.3;

    // scene
    renderObj.scene = new THREE.Scene();

    // light
    renderObj.light = new THREE.DirectionalLight(0xffffff, 1);
    renderObj.light.position.copy(renderObj.camera.position);
    renderObj.scene.add(renderObj.light);

    // stats
    stats = new Stats();
    renderObj.domElement.appendChild(stats.domElement);
}

function initRenderer2D(rendererObj) {
    // renderer
    rendererObj.domElement = document.getElementById(rendererObj.domId);
    rendererObj.renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    rendererObj.renderer.autoClear = false;
    rendererObj.renderer.localClippingEnabled = true;
    rendererObj.renderer.setSize(
        rendererObj.domElement.clientWidth,
        rendererObj.domElement.clientHeight
    );
    rendererObj.renderer.setClearColor(0x000000, 1);
    rendererObj.renderer.domElement.id = rendererObj.targetID;
    rendererObj.domElement.appendChild(rendererObj.renderer.domElement);

    // // scene
    rendererObj.sceneLayer0 = new THREE.Scene();
    rendererObj.sceneLayer1 = new THREE.Scene();
    rendererObj.sceneLayerMix = new THREE.Scene();
    // render to texture!!!!
    rendererObj.sceneLayer0TextureTarget = new THREE.WebGLRenderTarget(rendererObj.domElement.clientWidth, rendererObj.domElement.clientHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
    });

    rendererObj.sceneLayer1TextureTarget = new THREE.WebGLRenderTarget(rendererObj.domElement.clientWidth, rendererObj.domElement.clientHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
    });


    // camera
    rendererObj.camera = new CamerasOrthographic(
        rendererObj.domElement.clientWidth / -2,
        rendererObj.domElement.clientWidth / 2,
        rendererObj.domElement.clientHeight / 2,
        rendererObj.domElement.clientHeight / -2,
        1,
        1000
    );

    // controls
    rendererObj.controls = new ControlsOrthographic(rendererObj.camera, rendererObj.domElement);
    rendererObj.controls.staticMoving = true;
    rendererObj.controls.noRotate = true;
    // rendererObj.controls.enabled = false;
    rendererObj.camera.controls = rendererObj.controls;

    // scene
    rendererObj.scene = new THREE.Scene();
}
function updateLayer1(rendererObj) {
    // update layer1 geometry...
    if (rendererObj.meshLayer1) {
        rendererObj.meshLayer1.geometry.dispose();
        rendererObj.meshLayer1.geometry = rendererObj.stackHelper.slice.geometry;
        rendererObj.meshLayer1.geometry.verticesNeedUpdate = true;
    }
}

function updateLayerMix(rendererObj) {
    // update layer1 geometry...
    if (rendererObj.meshLayerMix) {
        rendererObj.sceneLayerMix.remove(rendererObj.meshLayerMix);
        rendererObj.meshLayerMix.material.dispose();
        // meshLayerMix.material = null;
        rendererObj.meshLayerMix.geometry.dispose();
        // meshLayerMix.geometry = null;

        // add mesh in this scene with right shaders...
        rendererObj.meshLayerMix = new THREE.Mesh(rendererObj.stackHelper.slice.geometry, rendererObj.materialLayerMix);
        // go the LPS space
        rendererObj.meshLayerMix.applyMatrix(rendererObj.stackHelper.stack._ijk2LPS);

        rendererObj.sceneLayerMix.add(rendererObj.meshLayerMix);
    }
}
function initHelpersStack(rendererObj, stack, stack2) {
    rendererObj.stackHelper = new HelpersStack(stack);
    rendererObj.stackHelper.bbox.visible = false;
    rendererObj.stackHelper.borderColor = rendererObj.sliceColor;
    rendererObj.stackHelper.slice.canvasWidth =
        rendererObj.domElement.clientWidth;
    rendererObj.stackHelper.slice.canvasHeight =
        rendererObj.domElement.clientHeight;

    rendererObj.textures2 = [];
    for (let m = 0; m < stack2._rawData.length; m++) {
        let tex = new THREE.DataTexture(
            stack2.rawData[m],
            stack2.textureSize,
            stack2.textureSize,
            stack2.textureType,
            THREE.UnsignedByteType,
            THREE.UVMapping,
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping,
            THREE.NearestFilter,
            THREE.NearestFilter
        );
        tex.needsUpdate = true;
        tex.flipY = true;
        rendererObj.textures2.push(tex);
    }

    //
    // create material && mesh then add it to sceneLayer1
    rendererObj.uniformsLayer1 = ShadersUniform.uniforms();
    rendererObj.uniformsLayer1.uTextureSize.value = stack2.textureSize;
    rendererObj.uniformsLayer1.uTextureContainer.value = rendererObj.textures2;
    rendererObj.uniformsLayer1.uWorldToData.value = stack2.lps2IJK;
    rendererObj.uniformsLayer1.uNumberOfChannels.value = stack2.numberOfChannels;
    rendererObj.uniformsLayer1.uBitsAllocated.value = stack2.bitsAllocated;
    rendererObj.uniformsLayer1.uPackedPerPixel.value = stack2.packedPerPixel;
    rendererObj.uniformsLayer1.uWindowCenterWidth.value = [stack2.windowCenter, stack2.windowWidth];
    rendererObj.uniformsLayer1.uRescaleSlopeIntercept.value = [stack2.rescaleSlope, stack2.rescaleIntercept];
    rendererObj.uniformsLayer1.uOpacity.value = 0.5
    rendererObj.uniformsLayer1.uInterpolation.value=0
    rendererObj.uniformsLayer1.uDataDimensions.value = [
        stack2.dimensionsIJK.x,
        stack2.dimensionsIJK.y,
        stack2.dimensionsIJK.z,
    ];
    rendererObj.uniformsLayer1.uLowerUpperThreshold.value = [...stack2.minMax];

    // generate shaders on-demand!
    let fs = new ShadersFragment(rendererObj.uniformsLayer1);
    let vs = new ShadersVertex();
    rendererObj.materialLayer1 = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: rendererObj.uniformsLayer1,
        vertexShader: vs.compute(),
        fragmentShader: fs.compute(),
    });

    // add mesh in this scene with right shaders...
    rendererObj.meshLayer1 = new THREE.Mesh(rendererObj.stackHelper.slice.geometry, rendererObj.materialLayer1);
    // go the LPS space
    rendererObj.meshLayer1.applyMatrix(stack._ijk2LPS);
    rendererObj.sceneLayer1.add(rendererObj.meshLayer1);

    //
    // Create the Mix layer
    rendererObj.uniformsLayerMix = ShadersLayerUniform.uniforms();
    rendererObj.uniformsLayerMix.uTextureBackTest0.value = rendererObj.sceneLayer0TextureTarget.texture;
    rendererObj.uniformsLayerMix.uTextureBackTest1.value = rendererObj.sceneLayer1TextureTarget.texture;
    rendererObj.uniformsLayerMix.uTrackMouse.value = 0;
    rendererObj.uniformsLayerMix.uMouse.value = new THREE.Vector2(0, 0);
    // generate shaders on-demand!
    let fls = new ShadersLayerFragment(rendererObj.uniformsLayerMix);
    let vls = new ShadersLayerVertex();
    rendererObj.materialLayerMix = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: rendererObj.uniformsLayerMix,
        vertexShader: vls.compute(),
        fragmentShader: fls.compute(),
        transparent: true,
    });

    // add mesh in this scene with right shaders...
    rendererObj.meshLayerMix = new THREE.Mesh(rendererObj.stackHelper.slice.geometry, rendererObj.materialLayerMix);
    // go the LPS space
    rendererObj.meshLayerMix.applyMatrix(stack._ijk2LPS);
    rendererObj.sceneLayerMix.add(rendererObj.meshLayerMix);

    // set camera
    let worldbb = stack.worldBoundingBox();
    let lpsDims = new THREE.Vector3(
        (worldbb[1] - worldbb[0])/2,
        (worldbb[3] - worldbb[2])/2,
        (worldbb[5] - worldbb[4])/2
    );

    // box: {halfDimensions, center}
    let box = {
        center: stack.worldCenter().clone(),
        halfDimensions:
            new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10),
    };

    // init and zoom
    let canvas = {
        width: rendererObj.domElement.clientWidth,
        height: rendererObj.domElement.clientHeight,
    };
    // CREATE LUT
    rendererObj.lutLayer0 = new HelpersLut(
        'my-lut-canvases-l1',
        'default',
        'linear',
        [[0, 0, 0, 0], [1, 1, 1, 1]],
        [[0, 1], [1, 1]]
    );
    rendererObj.lutLayer0.luts = HelpersLut.presetLuts();

    rendererObj.lutLayer1 = new HelpersSegmentationLut(
        "my-lut-canvases-l0",
    );
    var presetsSegmentation = new PresetsSegmentation('Freesurfer');
    rendererObj.lutLayer1.segmentation = presetsSegmentation.preset;

    rendererObj.uniformsLayer1.uLutSegmentation.value = 1;
    rendererObj.uniformsLayer1.uTextureLUTSegmentation.value = rendererObj.lutLayer1.texture;

    rendererObj.camera.directions =
        [stack.xCosine, stack.yCosine, stack.zCosine];
    rendererObj.camera.box = box;
    rendererObj.camera.canvas = canvas;
    rendererObj.camera.orientation = rendererObj.sliceOrientation;
    rendererObj.camera.update();
    rendererObj.camera.fitBox(2, 1);

    rendererObj.stackHelper.orientation = rendererObj.camera.stackOrientation;
    rendererObj.stackHelper.index =
        Math.floor(rendererObj.stackHelper.orientationMaxIndex/2);
    rendererObj.scene.add(rendererObj.stackHelper);
}

function initHelpersLocalizer(rendererObj, stack, referencePlane, localizers) {
    rendererObj.localizerHelper = new HelpersLocalizer(
        stack,
        rendererObj.stackHelper.slice.geometry,
        referencePlane
    );

    for (let i = 0; i < localizers.length; i++) {
        rendererObj.localizerHelper['plane' + (i + 1)] = localizers[i].plane;
        rendererObj.localizerHelper['color' + (i + 1)] = localizers[i].color;
    }

    rendererObj.localizerHelper.canvasWidth = rendererObj.domElement.clientWidth;
    rendererObj.localizerHelper.canvasHeight = rendererObj.domElement.clientHeight;

    rendererObj.localizerScene = new THREE.Scene();
    rendererObj.localizerScene.add(rendererObj.localizerHelper);
}

function render() {
    // we are ready when both meshes have been loaded
    if (ready) {
        r0.controls.update();
        r1.controls.update();
        r2.controls.update();
        r3.controls.update();

        r0.light.position.copy(r0.camera.position);
        // r0.renderer.render(r0.sceneLayer0, r0.camera, r0.sceneLayer0TextureTarget, true);
        // render second layer offscreen
        // r0.renderer.render(r0.sceneLayer1, r0.camera, r0.sceneLayer1TextureTarget, true);

        // r0.renderer.render(r0.sceneLayerMix, r0.camera);
        r0.renderer.render(r0.scene, r0.camera);

        // r1
        r1.renderer.clear();
        // render first layer offscreen
        // r1.renderer.render(r1.sceneLayer0, r1.camera, r1.sceneLayer0TextureTarget, true);
        r1.renderer.render(r1.scene, r1.camera);
        // render second layer offscreen
        r1.renderer.render(r1.sceneLayer1, r1.camera, r1.sceneLayer1TextureTarget, true);
        r1.renderer.render(r1.sceneLayerMix, r1.camera);
        r1.renderer.clearDepth();
        r1.renderer.render(r1.localizerScene, r1.camera);
        r1.renderer.clearDepth();

        // r2
        r2.renderer.clear();
        // render first layer offscreen
        // r1.renderer.render(r1.sceneLayer0, r1.camera, r1.sceneLayer0TextureTarget, true);
        r2.renderer.render(r2.scene, r2.camera);
        // render second layer offscreen
        r2.renderer.render(r2.sceneLayer1, r2.camera, r2.sceneLayer1TextureTarget, true);
        r2.renderer.render(r2.sceneLayerMix, r2.camera);
        r2.renderer.clearDepth();
        r2.renderer.render(r2.localizerScene, r2.camera);
        r2.renderer.clearDepth();

        // r3
        r3.renderer.clear();
        // render first layer offscreen
        // r1.renderer.render(r1.sceneLayer0, r1.camera, r1.sceneLayer0TextureTarget, true);
        r3.renderer.render(r3.scene, r3.camera);
        // render second layer offscreen
        r3.renderer.render(r3.sceneLayer1, r3.camera, r3.sceneLayer1TextureTarget, true);
        r3.renderer.render(r3.sceneLayerMix, r3.camera);
        r3.renderer.clearDepth();
        r3.renderer.render(r3.localizerScene, r3.camera);
        r3.renderer.clearDepth();
    }

    // stats.update();
}

/**
 * Init the quadview
 */
function init() {
    /**
     * Called on each animation frame
     */
    function animate() {
        render();

        // request new frame
        requestAnimationFrame(function() {
            animate();
        });
    }

    // renderers
    initRenderer3D(r0);
    initRenderer2D(r1);
    initRenderer2D(r2);
    initRenderer2D(r3);

    // start rendering loop
    animate();
}

class LoadNifti extends React.Component{
    state = {
        coords: [],
        ijk: {
            x: null
        },
        world: {
            x: null
        }
    }
    async componentDidMount(){
        init();

        let segname =  this.props.segmentation
        let t2name =  this.props.filename
        await this.props.actions.fetchNiftiHeader(t2name)
        let t2 = nifti.Utils.toArrayBuffer(this.props.getFile.header.body.raw_data.data)


        await this.props.actions.fetchNiftiHeader(segname)
        let segmentation = nifti.Utils.toArrayBuffer(this.props.getFile.header.body.raw_data.data)


        // let t2 = [
        //     this.props.image,
        // ];

        // let files = t2.map(function(v) {
        // return 'https://cdn.rawgit.com/FNNDSC/data/master/nifti/fetalatlas_brain/t2/template_T2.nii.gz';
        // });

        // load sequence for each file
        // instantiate the loader
        // it loads and parses the dicom image

        let loader1 = new LoadersVolume();
        let stack2;
        await loader1.loadData(segmentation, 'https://cdn.rawgit.com/FNNDSC/data/master/nifti/fetalatlas_brain/t2/template_T2.nii.gz')
            .then(async function() {
                let series2 = await loader1.data[0].mergeSeries(loader1.data)[0];
                loader1.free();
                loader1 = null;
                // get first stack from series
                stack2 = series2.stack[0];
                stack2.prepare();
                stack2.pack()
            })

        let loader = new LoadersVolume();

        await loader.loadData(t2, 'https://cdn.rawgit.com/FNNDSC/data/master/nifti/fetalatlas_brain/t2/template_T2.nii.gz')
        .then(function() {
            let series = loader.data[0].mergeSeries(loader.data)[0];
            loader.free();
            loader = null;
            // get first stack from series
            let stack = series.stack[0];
            stack.prepare();
            // center 3d camera/control on the stack
            let centerLPS = stack.worldCenter();
            r0.camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
            r0.camera.updateProjectionMatrix();
            r0.controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);

            // bouding box
            let boxHelper = new HelpersBoundingBox(stack);
            r0.scene.add(boxHelper);

            // red slice
            initHelpersStack(r1, stack, stack2);
            r0.scene.add(r1.scene);

            redTextureTarget = new THREE.WebGLRenderTarget(
                r1.domElement.clientWidth,
                r1.domElement.clientHeight,
                {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.NearestFilter,
                    format: THREE.RGBAFormat,
                }
            );

            redContourHelper = new HelpersContour(stack, r1.stackHelper.slice.geometry);
            redContourHelper.canvasWidth = redTextureTarget.width;
            redContourHelper.canvasHeight = redTextureTarget.height;
            redContourHelper.textureToFilter = redTextureTarget.texture;
            redContourScene = new THREE.Scene();
            redContourScene.add(redContourHelper);

            // yellow slice
            initHelpersStack(r2, stack, stack2);
            r0.scene.add(r2.scene);

            // green slice
            initHelpersStack(r3, stack, stack2);
            r0.scene.add(r3.scene);

            // create new mesh with Localizer shaders
            let plane1 = r1.stackHelper.slice.cartesianEquation();
            let plane2 = r2.stackHelper.slice.cartesianEquation();
            let plane3 = r3.stackHelper.slice.cartesianEquation();

            // localizer red slice
            initHelpersLocalizer(r1, stack, plane1, [
                {plane: plane2,
                    color: new THREE.Color(r2.stackHelper.borderColor),
                },
                {plane: plane3,
                    color: new THREE.Color(r3.stackHelper.borderColor),
                },
            ]);

            // localizer yellow slice
            initHelpersLocalizer(r2, stack, plane2, [
                {plane: plane1,
                    color: new THREE.Color(r1.stackHelper.borderColor),
                },
                {plane: plane3,
                    color: new THREE.Color(r3.stackHelper.borderColor),
                },
            ]);

            // localizer green slice
            initHelpersLocalizer(r3, stack, plane3, [
                {plane: plane1,
                    color: new THREE.Color(r1.stackHelper.borderColor),
                },
                {plane: plane2,
                    color: new THREE.Color(r2.stackHelper.borderColor),
                },
            ]);

            let gui = new dat.GUI({
                autoPlace: false,
                open: true
            });

            let customContainer = document.getElementById('gui-container');
            customContainer.appendChild(gui.domElement);

            // Red
            let stackFolder1 = gui.addFolder('Axial (Red)');
            let redChanged = stackFolder1
                .add( r1.stackHelper, 'index', 0, r1.stackHelper.orientationMaxIndex)
                .step(1)
                .listen();
            stackFolder1
                .add(r1.stackHelper.slice, 'interpolation', 0, 1)
                .step(1)
                .listen();
            stackFolder1
                .add(r1.stackHelper.slice, 'windowWidth',1, r1.stackHelper.stack.minMax[1] - r1.stackHelper.stack.minMax[0]+1)
                .step(1)
                .listen();
            stackFolder1
                .add(r1.stackHelper.slice, 'windowCenter', r1.stackHelper.stack.minMax[0]+1, r1.stackHelper.stack.minMax[1])
                .step(1)
                .listen();
            stackFolder1
                .add(r1.stackHelper.slice, 'intensityAuto')
                .listen();
            stackFolder1.open();


            // Yellow
            let stackFolder2 = gui.addFolder('Sagittal (yellow)');
            let yellowChanged = stackFolder2.add(
                r2.stackHelper,
                'index', 0, r2.stackHelper.orientationMaxIndex).step(1).listen();
            stackFolder2.add(
                r2.stackHelper.slice, 'interpolation', 0, 1).step(1).listen();
            stackFolder2
                .add(r2.stackHelper.slice, 'windowWidth',1, r2.stackHelper.stack.minMax[1] - r2.stackHelper.stack.minMax[0]+1)
                .step(1)
                .listen();
            stackFolder2
                .add(r2.stackHelper.slice, 'windowCenter', r2.stackHelper.stack.minMax[0]+1, r2.stackHelper.stack.minMax[1])
                .step(1)
                .listen();

            stackFolder2.open();

            // Green
            let stackFolder3 = gui.addFolder('Coronal (green)');
            let greenChanged = stackFolder3.add(
                r3.stackHelper,
                'index', 0, r3.stackHelper.orientationMaxIndex).step(1).listen();
            stackFolder3.add(
                r3.stackHelper.slice, 'interpolation', 0, 1).step(1).listen();
            stackFolder3
                .add(r3.stackHelper.slice, 'windowWidth',1, r3.stackHelper.stack.minMax[1] - r3.stackHelper.stack.minMax[0]+1)
                .step(1)
                .listen();
            stackFolder3
                .add(r3.stackHelper.slice, 'windowCenter', r3.stackHelper.stack.minMax[0]+1, r3.stackHelper.stack.minMax[1])
                .step(1)
                .listen();
            stackFolder3.open()

            let opacityFolder = gui.addFolder('Opacity');

            let opacityLayerMix = opacityFolder
                .add(layerMix, 'opacity1', 0, 1)
                .step(0.01)
                .listen();
            opacityLayerMix.onChange(function(value){
                onGreenChanged(value)
                onYellowChanged(value)
                onRedChanged(value)
            });
            opacityFolder.open();

            /**
             * Update Layer Mix
             */
            function updateLocalizer(refObj, targetLocalizersHelpers) {
                let refHelper = refObj.stackHelper;
                let localizerHelper = refObj.localizerHelper;
                let plane = refHelper.slice.cartesianEquation();
                localizerHelper.referencePlane = plane;

                // bit of a hack... works fine for this application
                for (let i = 0; i < targetLocalizersHelpers.length; i++) {
                    for (let j = 0; j < 3; j++) {
                        let targetPlane = targetLocalizersHelpers[i]['plane' + (j + 1)];
                        if (
                            targetPlane &&
                            plane.x.toFixed(6) === targetPlane.x.toFixed(6) &&
                            plane.y.toFixed(6) === targetPlane.y.toFixed(6) &&
                            plane.z.toFixed(6) === targetPlane.z.toFixed(6)
                        ) {
                            targetLocalizersHelpers[i]['plane' + (j + 1)] = plane;
                        }
                    }
                }

                // update the geometry will create a new mesh
                localizerHelper.geometry = refHelper.slice.geometry;
            }

            function updateClipPlane(refObj, clipPlane) {
                const stackHelper = refObj.stackHelper;
                const camera = refObj.camera;
                let vertices = stackHelper.slice.geometry.vertices;
                let p1 = new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z).applyMatrix4(
                    stackHelper._stack.ijk2LPS
                );
                let p2 = new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z).applyMatrix4(
                    stackHelper._stack.ijk2LPS
                );
                let p3 = new THREE.Vector3(vertices[2].x, vertices[2].y, vertices[2].z).applyMatrix4(
                    stackHelper._stack.ijk2LPS
                );

                clipPlane.setFromCoplanarPoints(p1, p2, p3);

                let cameraDirection = new THREE.Vector3(1, 1, 1);
                cameraDirection.applyQuaternion(camera.quaternion);

                if (cameraDirection.dot(clipPlane.normal) > 0) {
                    clipPlane.negate();
                }
            }

            function onYellowChanged(opacity) {
                if (opacity){
                    r2.uniformsLayer1.uOpacity.value = opacity
                }
                updateLocalizer(r2, [r1.localizerHelper, r3.localizerHelper]);
                updateClipPlane(r2, clipPlane2);
                updateLayer1(r2)
                updateLayerMix(r2)
            }

            yellowChanged.onChange(onYellowChanged);

            function onRedChanged(opacity) {
                if (opacity){
                    r1.uniformsLayer1.uOpacity.value = opacity
                }
                updateLocalizer(r1, [r2.localizerHelper, r3.localizerHelper]);
                updateClipPlane(r1, clipPlane1);

                if (redContourHelper) {
                    redContourHelper.geometry = r1.stackHelper.slice.geometry;
                }
                updateLayer1(r1)
                updateLayerMix(r1)
            }

            redChanged.onChange(onRedChanged);

            function onGreenChanged(opacity) {
                if (opacity){
                    r3.uniformsLayer1.uOpacity.value = opacity
                }
                updateLocalizer(r3, [r1.localizerHelper, r2.localizerHelper]);
                updateClipPlane(r3, clipPlane3);
                updateLayer1(r3)
                updateLayerMix(r3)
            }

            greenChanged.onChange(onGreenChanged);

            function mouseHelper(event){
                const canvas = event.target.parentElement;

                var box = canvas.getBoundingClientRect();

                var body = document.body;
                var docEl = document.documentElement;

                var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
                var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                var clientTop = docEl.clientTop || body.clientTop || 0;
                var clientLeft = docEl.clientLeft || body.clientLeft || 0;

                var top = box.top + scrollTop - clientTop;
                var left = box.left + scrollLeft - clientLeft;

                const mouse = {
                    x: (((window.pageXOffset+event.clientX) - Math.round(left)) / canvas.clientWidth) * 2 - 1,
                    y: -(((window.pageYOffset+event.clientY) - Math.round(top)-20) / canvas.clientHeight) * 2 + 1,
                    screenX: (window.pageXOffset+event.clientX) - Math.round(left),
                    screenY: (window.pageYOffset+event.clientY) - Math.round(top)-20
                }

                return mouse
            }
            function updateMouseHelper(mouse, camera, scene, stackHelper) {
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, camera);

                intersects = raycaster.intersectObjects(scene.children, true);
                if (intersects.length > 0){
                    let ijk = CoreUtils.worldToData(stackHelper.stack.lps2IJK, intersects[0].point);

                    r1.stackHelper.index=
                        ijk.getComponent((r1.stackHelper.orientation + 2) % 3);
                    r2.stackHelper.index=
                        ijk.getComponent((r2.stackHelper.orientation + 2) % 3);
                    r3.stackHelper.index=
                        ijk.getComponent((r3.stackHelper.orientation + 2) % 3);

                    onGreenChanged();
                    onRedChanged()
                    onYellowChanged();
                }
            }
            function onMouseDown(event) {
                var mouse = mouseHelper(event)
                const id = event.target.id;

                let camera = null;
                let stackHelper = null;
                let scene = null;
                let controls = null;
                let threeD = null;
                let _voxels = null;

                switch (id) {
                    case '0':
                        camera = r0.camera;
                        stackHelper = r0.stackHelper;
                        scene = r0.scene;
                        controls = r0.controls;
                        threeD = r0.domElement;
                        _voxels = r0._voxels;
                        break;
                    case '1':
                        camera = r1.camera;
                        stackHelper = r1.stackHelper;
                        scene = r1.scene;
                        controls = r1.controls;
                        threeD = r1.domElement;
                        _voxels = r1._voxels;
                        break;
                    case '2':
                        camera = r2.camera;
                        stackHelper = r2.stackHelper;
                        scene = r2.scene;
                        controls = r2.controls;
                        threeD = r2.domElement;
                        _voxels = r2._voxels;
                        break;
                    case '3':
                        camera = r3.camera;
                        stackHelper = r3.stackHelper;
                        scene = r3.scene;
                        controls = r3.controls;
                        threeD = r3.domElement;
                        _voxels = r3._voxels;
                        break;
                }
                updateMouseHelper(mouse, camera, scene, stackHelper)

                function onMouseMove(event){
                    var mouse = mouseHelper(event)
                    updateMouseHelper(mouse, camera, scene, stackHelper)
                }
                function onMouseUp(event){
                    threeD.removeEventListener('mousemove', onMouseMove);
                    threeD.removeEventListener('mouseup', onMouseUp)
                }
                threeD.addEventListener('mousemove', onMouseMove);
                threeD.addEventListener('mouseup', onMouseUp);
            }

            r1.domElement.addEventListener('mousedown', onMouseDown);
            r2.domElement.addEventListener('mousedown', onMouseDown);
            r3.domElement.addEventListener('mousedown', onMouseDown);

            function onClick(event) {
                const canvas = event.target.parentElement;
                const id = event.target.id;
                const mouse = {
                    x: ((event.clientX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1,
                    y: -((event.clientY - canvas.offsetTop) / canvas.clientHeight) * 2 + 1,
                };
                //
                let camera = null;
                let stackHelper = null;
                let scene = null;
                switch (id) {
                    case '1':
                        camera = r1.camera;
                        stackHelper = r1.stackHelper;
                        scene = r1.scene;
                        break;
                    case '2':
                        camera = r2.camera;
                        stackHelper = r2.stackHelper;
                        scene = r2.scene;
                        break;
                    case '3':
                        camera = r3.camera;
                        stackHelper = r3.stackHelper;
                        scene = r3.scene;
                        break;
                }

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, camera);

                const intersects = raycaster.intersectObjects(scene.children, true);
                if (intersects.length > 0) {
                    if (intersects[0].object && intersects[0].object.objRef) {
                        const refObject = intersects[0].object.objRef;
                        refObject.selected = !refObject.selected;

                        let color = refObject.color;
                        if (refObject.selected) {
                            color = 0xccff00;
                        }

                        // update materials colors
                        refObject.material.color.setHex(color);
                        refObject.materialFront.color.setHex(color);
                        refObject.materialBack.color.setHex(color);
                    }
                }
            }


            function onScroll(event) {
                const id = event.target.domElement.id;
                let stackHelper = null;
                switch (id) {
                    case 'r1':
                        stackHelper = r1.stackHelper;
                        break;
                    case 'r2':
                        stackHelper = r2.stackHelper;
                        break;
                    case 'r3':
                        stackHelper = r3.stackHelper;
                        break;
                }

                if (event.delta > 0) {
                    if (stackHelper.index >= stackHelper.orientationMaxIndex - 1) {
                        return false;
                    }
                    stackHelper.index += 1;
                } else {
                    if (stackHelper.index <= 0) {
                        return false;
                    }
                    stackHelper.index -= 1;
                }

                onGreenChanged();
                onRedChanged();
                onYellowChanged();
            }

            // event listeners
            // r1.controls.addEventListener('OnScroll', onScroll);
            // r2.controls.addEventListener('OnScroll', onScroll);
            // r3.controls.addEventListener('OnScroll', onScroll);

            function windowResize2D(rendererObj) {
                rendererObj.camera.canvas = {
                    width: rendererObj.domElement.clientWidth,
                    height: rendererObj.domElement.clientHeight,
                };
                rendererObj.camera.fitBox(2, 1);
                rendererObj.renderer.setSize(
                    rendererObj.domElement.clientWidth,
                    rendererObj.domElement.clientHeight
                );

                // update info to draw borders properly
                rendererObj.stackHelper.slice.canvasWidth = rendererObj.domElement.clientWidth;
                rendererObj.stackHelper.slice.canvasHeight = rendererObj.domElement.clientHeight;
                rendererObj.localizerHelper.canvasWidth = rendererObj.domElement.clientWidth;
                rendererObj.localizerHelper.canvasHeight = rendererObj.domElement.clientHeight;
            }

            function onWindowResize() {
                // update 3D
                // r0.camera.aspect = r0.domElement.clientWidth / r0.domElement.clientHeight;
                // r0.camera.updateProjectionMatrix();
                // r0.renderer.setSize(r0.domElement.clientWidth, r0.domElement.clientHeight);

                // update 2d
                windowResize2D(r1);
                windowResize2D(r2);
                windowResize2D(r3);
            }

            window.addEventListener('resize', onWindowResize, false);

            // load meshes on the stack is all set
            let meshesLoaded = 0;

            // function loadSTLObject(object) {
            //     const stlLoader = new THREE.FreeSurferLoader();
            //     stlLoader.load(object.location, function (geometry) {
            //         geometry.computeVertexNormals();
            //         // 3D mesh
            //         object.material = new THREE.MeshLambertMaterial({
            //             opacity: object.opacity,
            //             color: object.color,
            //             clippingPlanes: [],
            //             transparent: true,
            //         });
            //         object.mesh = new THREE.Mesh(geometry, object.material);
            //         object.mesh.objRef = object;
            //         const array = r1.stackHelper.stack.lps2IJK.toArray();
            //
            //         let RASToLPS = new THREE.Matrix4();
            //         const worldCenter = r1.stackHelper.stack.worldCenter();
            //         RASToLPS.set(
            //             -1,
            //             0,
            //             0,
            //             worldCenter.x,
            //             0,
            //             -1,
            //             0,
            //             worldCenter.y,
            //             0,
            //             0,
            //             1,
            //             worldCenter.z,
            //             0,
            //             0,
            //             0,
            //             1
            //         );
            //         object.mesh.applyMatrix(RASToLPS);
            //         r0.scene.add(object.mesh);
            //
            //         object.scene = new THREE.Scene();
            //
            //         // front
            //         object.materialFront = new THREE.MeshBasicMaterial({
            //             color: object.color,
            //             side: THREE.FrontSide,
            //             depthWrite: true,
            //             opacity: 0,
            //             transparent: true,
            //             clippingPlanes: [],
            //         });
            //
            //         object.meshFront = new THREE.Mesh(geometry, object.materialFront);
            //         object.meshFront.applyMatrix(RASToLPS);
            //         object.scene.add(object.meshFront);
            //
            //         // back
            //         object.materialBack = new THREE.MeshBasicMaterial({
            //             color: object.color,
            //             side: THREE.BackSide,
            //             depthWrite: true,
            //             opacity: object.opacity,
            //             transparent: true,
            //             clippingPlanes: [],
            //         });
            //
            //         object.meshBack = new THREE.Mesh(geometry, object.materialBack);
            //         object.meshBack.applyMatrix(RASToLPS);
            //         object.scene.add(object.meshBack);
            //         sceneClip.add(object.scene);
            //
            //         meshesLoaded++;
            //
            onGreenChanged();
            onRedChanged();
            onYellowChanged();
            //
            //         // good to go
            //         if (meshesLoaded === data.size) {
            //             ready = true;
            //
            //             // force 1st render
            //             render();
            //             // notify puppeteer to take screenshot
            //             const puppetDiv = document.createElement('div');
            //             puppetDiv.setAttribute('id', 'puppeteer');
            //             document.body.appendChild(puppetDiv);
            //         }
            //     });
            // }

            // good to go
            ready = true;
            // force 1st render
            render();
            // notify puppeteer to take screenshot
            const puppetDiv = document.createElement('div');
            puppetDiv.setAttribute('id', 'puppeteer');
            document.body.appendChild(puppetDiv);
    })
    // .catch(function(error) {
    //     window.console.log('oops... something went wrong...');
    //     window.console.log(error);
    // });


    }
    handleAdd = ()=>{
        coordsList.push(intersects)
        this.setState({coords: coordsList})
    }
    handleClear = () => {
        this.setState({coords: []})
        coordsList=[]
    }

    componentWillUnmount() {
        console.log('unmounted')
    }

    render(){
        return(<div style={{ marginTop: 30 , backgroundColor: '#535353', padding: 5}}>
            <Button type="primary" onClick={this.handleAdd}>Add Coordinates</Button>
            <Card>
                {
                    this.state.coords.length!==0?
                        this.state.coords.map((coords, index)=> {
                            return <div>
                                <InputGroup large>
                                    <Input
                                        style={{ width: '30%' }}
                                        key={'point'+index}
                                        title={"point"+index}
                                        value={'x:'+coords[0].point.x} />
                                    <Input
                                        style={{ width: '30%' }}
                                        key={'point'+index}
                                        title={"point"+index}
                                        value={'y:'+coords[0].point.y} />
                                    <Input
                                        style={{ width: '30%' }}
                                        key={'point'+index}
                                        title={"point"+index}
                                        value={'z:'+coords[0].point.z} />
                                    <CloseCircleOutlined />
                                </InputGroup>
                            </div>
                        }):null
                }
                <Button type='danger' onClick={this.handleClear}>Clear</Button>
            </Card>
        </div>)
    }
}

LoadNifti.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const mapStatetoProps=(state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})

export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (LoadNifti)

