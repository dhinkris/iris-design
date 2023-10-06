import CamerasOrthographic from "../ami-viewer/cameras/cameras.orthographic";
import HelpersLut from "../ami-viewer/helpers/helpers.lut";
import ControlsTrackball from "../ami-viewer/controls/controls.trackball";
import ShadersVertex from "../ami-viewer/shaders/shaders.data.vertex";
import HelpersStack from "../ami-viewer/helpers/helpers.stack";
import ShadersLayerUniform from "../ami-viewer/shaders/shaders.layer.uniform";
import * as THREE from "three";
import ShadersUniform from "../ami-viewer/shaders/shaders.data.uniform";
import ShadersLayerFragment from "../ami-viewer/shaders/shaders.layer.fragment";
import ShadersLayerVertex from "../ami-viewer/shaders/shaders.layer.vertex";
import HelpersLocalizer from "../ami-viewer/helpers/helpers.localizer";
import ShadersFragment from "../ami-viewer/shaders/shaders.data.fragment";
import PresetsSegmentation from "../ami-viewer/presets/presets.segmentation";
import HelpersSegmentationLut from "../ami-viewer/helpers/helpers.segmentationlut";
import ControlsOrthographic from "../ami-viewer/controls/controls.trackballortho";


export function initHelpersStack (rendererObj, stack) {
    rendererObj.stackHelper = new HelpersStack(stack);
    rendererObj.stackHelper.bbox.visible = false;
    rendererObj.stackHelper.borderColor = rendererObj.sliceColor;
    rendererObj.stackHelper.slice.canvasWidth =
        rendererObj.domElement.clientWidth;
    rendererObj.stackHelper.slice.canvasHeight =
        rendererObj.domElement.clientHeight;
    
    
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
    //
    // init and zoom
    let canvas = {
        width: rendererObj.domElement.clientWidth,
        height: rendererObj.domElement.clientHeight,
    };

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
export function initHelpersStackRerender (rendererObj, stack, stack2) {
    if (stack2){
        rendererObj.stack2 = stack2
        rendererObj.textures2 = [];
        for (let m = 0; m < rendererObj.stack2._rawData.length; m++) {
            let tex = new THREE.DataTexture(
                rendererObj.stack2.rawData[m],
                rendererObj.stack2.textureSize,
                rendererObj.stack2.textureSize,
                rendererObj.stack2.textureType,
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
        
        
        // create material && mesh then add it to sceneLayer1
        rendererObj.uniformsLayer1 = ShadersUniform.uniforms();
        rendererObj.uniformsLayer1.uTextureSize.value = rendererObj.stack2.textureSize;
        rendererObj.uniformsLayer1.uTextureContainer.value = rendererObj.textures2;
        rendererObj.uniformsLayer1.uWorldToData.value = rendererObj.stack2.lps2IJK;
        rendererObj.uniformsLayer1.uNumberOfChannels.value = rendererObj.stack2.numberOfChannels;
        rendererObj.uniformsLayer1.uBitsAllocated.value = rendererObj.stack2.bitsAllocated;
        rendererObj.uniformsLayer1.uPackedPerPixel.value = rendererObj.stack2.packedPerPixel;
        rendererObj.uniformsLayer1.uWindowCenterWidth.value = [rendererObj.stack2.windowCenter, rendererObj.stack2.windowWidth];
        rendererObj.uniformsLayer1.uRescaleSlopeIntercept.value = [rendererObj.stack2.rescaleSlope, rendererObj.stack2.rescaleIntercept];
        rendererObj.uniformsLayer1.uOpacity.value = 0.8
        rendererObj.uniformsLayer1.uInterpolation.value=0
        rendererObj.uniformsLayer1.uDataDimensions.value = [
            rendererObj.stack2.dimensionsIJK.x,
            rendererObj.stack2.dimensionsIJK.y,
            rendererObj.stack2.dimensionsIJK.z,
        ];
        rendererObj.uniformsLayer1.uLowerUpperThreshold.value = [...rendererObj.stack2.minMax];
        
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
        rendererObj.materialLayerMix = new THREE.ShaderMaterial ({
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
    }

}

export function initHelpersLocalizer (rendererObj, stack, referencePlane, localizers)  {
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

export function initRenderView3D (renderObj) {
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
    // renderObj.domElement.appendChild(stats.domElement);
}

export function initRenderView2D (rendererObj) {
    //render, camera, control, scene

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


    // canvas 2D
    rendererObj.canvasDiv = document.getElementById(rendererObj.domId+'canvas');
    rendererObj.canvas = document.createElement('canvas');
    rendererObj.canvas.setAttribute('width', rendererObj.canvasDiv.clientWidth);
    rendererObj.canvas.setAttribute('height', rendererObj.canvasDiv.clientHeight);
    rendererObj.canvas.setAttribute('id', 'canvas');
    rendererObj.canvasDiv.appendChild(rendererObj.canvas);
    rendererObj.context = rendererObj.canvas.getContext('2d');

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

