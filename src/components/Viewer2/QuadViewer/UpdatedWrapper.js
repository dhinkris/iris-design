import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import dat from 'dat.gui';
import nifti from 'nifti-reader-js';

import {bindActionCreators} from "redux";
import * as AllActions from "../../../actions";
import {connect} from "react-redux";

import { Row, Col, Button, Card, Input, Spin } from 'antd';

import HelpersBoundingBox from '../ami-viewer/helpers/helpers.boundingbox';
import HelpersContour from '../ami-viewer/helpers/helpers.contour';


import LoadersVolume from "../ami-viewer/loaders/loaders.volume";

import html2canvas from 'html2canvas';

import { Layout, Menu, Drawer, Switch, Popover, Affix, Divider, Radio, Tooltip } from 'antd';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UserOutlined,
    UploadOutlined,
    VideoCameraOutlined,
    PieChartOutlined,
    DesktopOutlined,
    FileOutlined,
    ScissorOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    FullscreenOutlined,
    PlusOutlined,
    AimOutlined,
    EyeOutlined,
    ArrowsAltOutlined,
    BorderOuterOutlined,
    EditOutlined,
    FontColorsOutlined,
    VerticalRightOutlined,
    EnterOutlined,
    RadiusBottomleftOutlined,
    Loading3QuartersOutlined,
    DeploymentUnitOutlined,
    HighlightOutlined,
    CameraOutlined

} from '@ant-design/icons';

//svg imports
import { brightness } from '../resources/images/Icon material-brightness-4.svg';

//custom imports
import { initHelpersStack, initHelpersStackRerender, initHelpersLocalizer, initRenderView3D, initRenderView2D } from './initLayers'
import { updateLayer1, updateLayerMix, updateLocalizer, updateClipPlane, onRedChanged, onYellowChanged, onGreenChanged } from './updateLayers';
import { MouseActions } from './mouseActions';
import ColorPicker from './ColorPicker';
import Slider from './Slider'

const { Header, Footer, Sider, Content } = Layout;

const { SubMenu } = Menu;


OBJLoader(THREE)


class UpdatedWrapper extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            drawerLoading: false,
            imageLoading:false,
            coords: [{
                point:{x:0, y:0, z:0}
            }],
            ijk: {
                x:0, y:0, z:0
            },
            world: {
                x:0, y:0, z:0
            },
            intensity:0,
            selected: 'MouseProbe',
            hide: true,
            visible: false,
            widget:[],
            pickedColor :  '#d9000a',
            brushsize: 2,
            radioValue:1
        }
    }

    loadDefinitions=()=>{
        this.ready=false;

        this.redTextureTarget = null;
        this.redContourScene = null;

        // 3d renderer
        // this.r0 = {
        //     domId: 'r0',
        //     domElement: null,
        //     renderer: null,
        //     color: 0x212121,
        //     targetID: 0,
        //     camera: null,
        //     controls: null,
        //     scene: null,
        //     light: null,
        //     _voxels: []
        // };

        // 2d axial renderer
        this.r1 = {
            domId: 'r1',
            domElement: null,
            renderer: null,
            color: 0x3f51b5,
            sliceOrientation: 'axial',
            sliceColor: 0x3f51b5,
            targetID: 1,
            camera: null,
            controls: null,
            scene: null,
            light: null,
            stackHelper: null,
            localizerHelper: null,
            localizerScene: null,
            localizerColor:0x38FFD8,
            _voxels: []
        };

        // 2d sagittal renderer
        this.r2 = {
            domId: 'r2',
            domElement: null,
            renderer: null,
            color: 0x3f51b5,
            sliceOrientation: 'sagittal',
            sliceColor: 0x3f51b5,
            targetID: 2,
            camera: null,
            controls: null,
            scene: null,
            light: null,
            stackHelper: null,
            localizerHelper: null,
            localizerScene: null,
            localizerColor:0x38FFD8,
            _voxels: []
        };

        // 2d coronal renderer
        this.r3 = {
            domId: 'r3',
            domElement: null,
            renderer: null,
            color: 0x3f51b5,
            sliceOrientation: 'coronal',
            sliceColor: 0x3f51b5,
            targetID: 3,
            camera: null,
            controls: null,
            scene: null,
            light: null,
            stackHelper: null,
            localizerHelper: null,
            localizerScene: null,
            localizerColor:0x38FFD8,
            _voxels: []
        };

        this.sceneClip = new THREE.Scene();
        this.clipPlane1 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
        this.clipPlane2 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
        this.clipPlane3 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
        this.widgets = [];

        this.redContourHelper = null;

        let mouseactions = new MouseActions();

        this.onMouseMove=mouseactions.onMouseMove.bind(this)
        this.onMouseDown=mouseactions.onMouseDown.bind(this)
        this.onPanZoom=mouseactions.onPanZoom.bind(this)
        this.onMouseMoveWindow=mouseactions.onMouseMoveWindow.bind(this)

        this.onMouseDownWidget=mouseactions.onMouseDownWidget.bind(this)
        this.onMouseMoveWidget=mouseactions.onMouseMoveWidget.bind(this)
        this.onMouseUpWidget=mouseactions.onMouseUpWidget.bind(this)

        this.onMouseDownBrush=mouseactions.onMouseDownBrush.bind(this)
        this.onMouseMoveBrush=mouseactions.onMouseMoveBrush.bind(this)
        this.onMouseUpBrush=mouseactions.onMouseUpBrush.bind(this)
        this.updateIJKBox=mouseactions.updateIJKBBox.bind(this)
        this.mapCanvasToData=mouseactions.mapCanvasToData.bind(this)
        this.distanceBetween=mouseactions.distanceBetween.bind(this)
        this.angleBetween=mouseactions.angleBetween.bind(this)
        this.drawCircle=mouseactions.drawCircle.bind(this)
        this.clearCanvas=mouseactions.clearCanvas.bind(this)

        this.mouseLocation=mouseactions.mouseLocation.bind(this)
        this.getStack=mouseactions.getStack.bind(this)
        this.updateRaycaster=mouseactions.updateRaycaster.bind(this)
        this.getVoxel=mouseactions.getVoxel.bind(this)
        this.onScroll=mouseactions.onScroll.bind(this)

        this.updateLayer1=updateLayer1.bind(this)
        this.updateLayerMix=updateLayerMix.bind(this)
        this.updateLocalizer=updateLocalizer.bind(this)
        this.updateClipPlane=updateClipPlane.bind(this)
        this.onRedChanged=onRedChanged.bind(this)
        this.onYellowChanged= onYellowChanged.bind(this)
        this.onGreenChanged= onGreenChanged.bind(this)

        this.stack=null
        this.stack2=null
    }

    renderObj = () => {
        // we are this.ready when both meshes have been loaded
        if (this.ready){
            // render
            // this.r0.controls.update();
            this.r1.controls.update();
            this.r2.controls.update();
            this.r3.controls.update();

            // this.r0.light.position.copy(this.r0.camera.position);
            // r0.renderer.render(r0.sceneLayer0, r0.camera, r0.sceneLayer0TextureTarget, true);
            // render second layer offscreen
            // r0.renderer.render(r0.sceneLayer1, r0.camera, r0.sceneLayer1TextureTarget, true);

            // r0.renderer.render(r0.sceneLayerMix, r0.camera);
            // this.r0.renderer.render(this.r0.scene, this.r0.camera);

            // r1
            this.r1.renderer.clear();
            // render first layer offscreen
            // r1.renderer.render(r1.sceneLayer0, r1.camera, r1.sceneLayer0TextureTarget, true);
            this.r1.renderer.render(this.r1.scene, this.r1.camera);
            // render second layer offscreen
            this.r1.renderer.render(this.r1.sceneLayer1, this.r1.camera, this.r1.sceneLayer1TextureTarget, true);
            this.r1.renderer.render(this.r1.sceneLayerMix, this.r1.camera);
            this.r1.renderer.render(this.r1.localizerScene, this.r1.camera);
            this.r1.renderer.clearDepth();

            // r2
            this.r2.renderer.clear();
            // render first layer offscreen
            // r1.renderer.render(r1.sceneLayer0, r1.camera, r1.sceneLayer0TextureTarget, true);
            this.r2.renderer.render(this.r2.scene, this.r2.camera);
            // render second layer offscreen
            this.r2.renderer.render(this.r2.sceneLayer1, this.r2.camera, this.r2.sceneLayer1TextureTarget, true);
            this.r2.renderer.render(this.r2.sceneLayerMix, this.r2.camera);
            this.r2.renderer.render(this.r2.localizerScene, this.r2.camera);
            this.r2.renderer.clearDepth();
            //
            // r3
            this.r3.renderer.clear();
            // render first layer offscreen
            // r1.renderer.render(r1.sceneLayer0, r1.camera, r1.sceneLayer0TextureTarget, true);
            this.r3.renderer.render(this.r3.scene, this.r3.camera);
            // render second layer offscreen
            this.r3.renderer.render(this.r3.sceneLayer1, this.r3.camera, this.r3.sceneLayer1TextureTarget, true);
            this.r3.renderer.render(this.r3.sceneLayerMix, this.r3.camera);
            this.r3.renderer.render(this.r3.localizerScene, this.r3.camera);
            this.r3.renderer.clearDepth();
        }
    }

    init = () => {
        /**
         * Called on each animation frame
         */
        let animate = ()=> {
            this.renderObj();

            // request new frame
            requestAnimationFrame(function() {
                animate();
            });
        }

        // renderers
        // initRenderView3D(this.r0);
        initRenderView2D(this.r1);
        initRenderView2D(this.r2);
        initRenderView2D(this.r3);

        // start rendering loop
        animate();
    }


    windowResize2D = (rendererObj) => {
        if (rendererObj!==null){
            rendererObj.camera.canvas = {
                width: rendererObj.domElement.clientWidth,
                height: rendererObj.domElement.clientHeight,
            };
            rendererObj.camera.fitBox(2, 1);
            rendererObj.renderer.setSize(
                rendererObj.domElement.clientWidth,
                rendererObj.domElement.clientHeight);
    
            // update info to draw borders properly
            rendererObj.stackHelper.slice.canvasWidth =
                rendererObj.domElement.clientWidth;
            rendererObj.stackHelper.slice.canvasHeight =
                rendererObj.domElement.clientHeight;
            rendererObj.localizerHelper.canvasWidth =
                rendererObj.domElement.clientWidth;
            rendererObj.localizerHelper.canvasHeight =
                rendererObj.domElement.clientHeight;
        }
    }

    onWindowResize = () => {
        // update 3D
        // this.r0.camera.aspect = this.r0.domElement.clientWidth / this.r0.domElement.clientHeight;
        // this.r0.camera.updateProjectionMatrix();
        // this.r0.renderer.setSize(
        //     this.r0.domElement.clientWidth, this.r0.domElement.clientHeight);

        // update 2d
        this.windowResize2D(this.r1);
        this.windowResize2D(this.r2);
        this.windowResize2D(this.r3);
    }

    async componentDidMount(){
        // let data = [
        //     'http://localhost:8000/gettestfilemain/fetus_02234_02_recon.nii.gz',
        //     'http://localhost:8000/gettestfileseg/fetus_02234_02_recon_mask.nii.gz'
        // ];
        this.setState({imageLoading: true})
        this.loadDefinitions()
        await this.props.actions.getNiftiFile(this.props.baseImage)
        const anat = nifti.Utils.toArrayBuffer(this.props.getFile.fetchedData.body.raw_data.data)

        this.init()

        let loader1 = new LoadersVolume();

        let stack = null;
        let stack2 = null;
        this.setState({imageLoading: true})
        await loader1
            .loadData(anat,'https://test.com/template_T2.nii.gz')
            .then(function() {
                let mergedSeries = loader1.data[0].mergeSeries(loader1.data)[0];
                loader1.free();
                loader1 = null;
                // get first stack from series
                stack = mergedSeries.stack[0];
                stack.prepare();
            })
        this.stack=stack
        this.renderImage(this.stack);
    }

    handleImage=(event)=> {
        this.setState({
            selected: event.key
        })
    }

    hideOverlay=(event)=> {
        if (this.state.hide==false){
            this.r1.uniformsLayer1.uOpacity.value=0
            this.r2.uniformsLayer1.uOpacity.value=0
            this.r3.uniformsLayer1.uOpacity.value=0
            this.setState({
                hide:true
            })
        }else {
            this.r1.uniformsLayer1.uOpacity.value=0.8
            this.r2.uniformsLayer1.uOpacity.value=0.8
            this.r3.uniformsLayer1.uOpacity.value=0.8
            this.setState({
                hide:false
            })
        }


    }

    listAnnotations=(event) => {
        this.setState({
            visible:true,
            drawerContent: event
        })
    }

    handleWidgets=(event, annotation) => {
        if (event){
            annotation.showDOM()
            annotation.visible=true
        } else {
            annotation.hideDOM()
            annotation.visible=false
        }
    }

    handleClose = () => {
        this.ready=false
        this.props.handleClose()
        // this.r0=null
        this.r1.stackHelper.dispose()
        this.r1=null
        this.r2.stackHelper.dispose()
        this.r2=null
        this.r3.stackHelper.dispose()
        this.r3=null
        
    };
    handleDrawerClose = () => {
        this.setState({
            visible: false
        })
    }
    onChange = async e => {
        this.setState({
            imageLoading: true,
            selectedSegmentation: e.target.value,
            drawerLoading: true
        });
        await this.props.actions.getNiftiFile(e.target.value)
        const seg = nifti.Utils.toArrayBuffer(this.props.getFile.fetchedData.body.raw_data.data)
        // this.init()
        let stack2=null
        let loader2 = new LoadersVolume();
        await loader2
            .loadData(seg,'https://test.com/template_T2.nii.gz')
            .then(function() {
                let mergedSeries = loader2.data[0].mergeSeries(loader2.data)[0];
                loader2.free();
                loader2 = null;
                // get first stack from series
                stack2 = mergedSeries.stack[0];
                stack2.prepare();
                // stack2 = mergedSeries[0].stack[0];
                // stack2.prepare();
                stack2.pack();
            })
        
        this.stack2=stack2
        this.renderImage(this.stack, this.stack2)
        this.setState({ imageLoading: false, drawerLoading: false });
    };

    handleReset = () => {
        this.state.widget.map((widget)=>{
            this.handleWidgets(false, widget)
        })
        this.setState({
            widget:[]
        })
        this.renderObj();
    }

    handleScreenShot = () => {
        // var d = new Date();
        // var n = d.toISOString();

        // html2canvas(document.getElementById(id))
        //     .then((canvas) => {
        //     if (window.navigator.msSaveBlob){
        //         window.navigator.msSaveBlob(canvas.toDataURL("image/jpeg").msToBlob(),"canvas-image.png")
        //     }else{
        //         const a = document.createElement("a");
        //         document.body.appendChild(a)
        //         a.href= canvas.toDataURL("image/jpeg");
        //         a.download= "Screenshot-test-"+d+".png"
        //         a.click()
        //         document.body.removeChild(a)
        //     }
        // })
        let screenshotElt = document.getElementById("screenshot");
        screenshotElt.addEventListener('click', function() {
            // this.r1.controls.update();

            // // if (this.ready) {
            //     this.r1.renderer.render(this.r1.scene, this.r1.camera);
            // // }
            console.log(this)
            let screenshot = this.r1.renderer.domElement.toDataURL();
            screenshotElt.download = 'IRIS-' + Date.now() + '.png';
            screenshotElt.href = screenshot;
        });
    }

    handleColor = (color) => {
        this.setState({
            pickedColor : color.hex
        })
    }

    handleBrushSize = (size) => {
        this.setState({
            brushsize: size
        })
    }
    
    renderImage(stack, stack2) {
        let centerLPS = stack.worldCenter();
        // this.r0.camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
        // this.r0.camera.updateProjectionMatrix();
        // this.r0.controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);

        // bouding box
        // let boxHelper = new HelpersBoundingBox(stack);
        // this.r0.scene.add(boxHelper);

        // red slice
        if (!stack2){
            console.log('Not stack2')
            initHelpersStack(this.r1, stack);
        }else{
            console.log('stack2')
            initHelpersStackRerender(this.r1, stack, stack2);
        }
        // this.r0.scene.add(this.r1.scene);

        this.redTextureTarget = new THREE.WebGLRenderTarget(
            this.r1.domElement.clientWidth,
            this.r1.domElement.clientHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat,
            }
        );

        this.redContourHelper = new HelpersContour(stack, this.r1.stackHelper.slice.geometry);
        this.redContourHelper.canvasWidth = this.redTextureTarget.width;
        this.redContourHelper.canvasHeight = this.redTextureTarget.height;
        this.redContourHelper.textureToFilter = this.redTextureTarget.texture;
        this.redContourScene = new THREE.Scene();
        this.redContourScene.add(this.redContourHelper);

        // yellow slice
        initHelpersStack(this.r2, stack, stack2);
        // this.r0.scene.add(this.r2.scene);

        // green slice
        initHelpersStack(this.r3, stack, stack2);
        // this.r0.scene.add(this.r3.scene);

        // create new mesh with Localizer shaders
        let plane1 = this.r1.stackHelper.slice.cartesianEquation();
        let plane2 = this.r2.stackHelper.slice.cartesianEquation();
        let plane3 = this.r3.stackHelper.slice.cartesianEquation();

        // localizer red slice
        initHelpersLocalizer(this.r1, stack, plane1, [
            {
                plane: plane2,
                color: new THREE.Color(this.r2.localizerColor),
            },
            {
                plane: plane3,
                color: new THREE.Color(this.r3.localizerColor),
            },
        ]);

        // localizer yellow slice
        initHelpersLocalizer(this.r2, stack, plane2, [
            {
                plane: plane1,
                color: new THREE.Color(this.r1.localizerColor),
            },
            {
                plane: plane3,
                color: new THREE.Color(this.r3.localizerColor),
            },
        ]);

        // localizer green slice
        initHelpersLocalizer(this.r3, stack, plane3, [
            {
                plane: plane1,
                color: new THREE.Color(this.r1.localizerColor),
            },
            {
                plane: plane2,
                color: new THREE.Color(this.r2.localizerColor),
            },
        ]);

        // let gui = new dat.GUI({
        //     autoPlace: false,
        //     open: true
        // });


        // this.r0.domElement.addEventListener('mousemove', this.onMouseDown);
        this.r1.domElement.addEventListener('mousedown', this.onMouseDown);
        this.r2.domElement.addEventListener('mousedown', this.onMouseDown);
        this.r3.domElement.addEventListener('mousedown', this.onMouseDown);


        // event listeners
        this.r1.controls.addEventListener('OnScroll', this.onScroll);
        this.r2.controls.addEventListener('OnScroll', this.onScroll);
        this.r3.controls.addEventListener('OnScroll', this.onScroll);

        // this.r0.domElement.addEventListener('mouseup', this.onMouseUp);
        // this.r1.domElement.addEventListener('mouseup', this.onMouseUp);
        // this.r2.domElement.addEventListener('mouseup', this.onMouseUp);
        // this.r3.domElement.addEventListener('mouseup', this.onMouseUp);
        //
        //
        // this.r0.domElement.addEventListener('mousemove', this.onMouseMove);
        // this.r1.domElement.addEventListener('mousemove', this.onMouseMove);
        // this.r2.domElement.addEventListener('mousemove', this.onMouseMove);
        // this.r3.domElement.addEventListener('mousemove', this.onMouseMove);
        // this.r1.domElement.addEventListener('contextmenu', this.onPanZoom, false);

        this.onGreenChanged();
        this.onRedChanged();
        this.onYellowChanged();

        this.ready = true;
        // force 1st render
        this.renderObj();
        this.setState({
            r1: {
               width: this.r1.stackHelper.slice.windowWidth,
                center: this.r1.stackHelper.slice.windowCenter,
                l_thr: this.r1.stackHelper.slice.lowerThreshold,
                u_thr: this.r1.stackHelper.slice.upperThreshold,
                direction: this.r1.camera.directionsLabel
            },
            r2: {
               width: this.r2.stackHelper.slice.windowWidth,
                center: this.r2.stackHelper.slice.windowCenter,
                l_thr: this.r2.stackHelper.slice.lowerThreshold,
                u_thr: this.r2.stackHelper.slice.upperThreshold,
                direction: this.r2.camera.directionsLabel
            },
            r3: {
               width: this.r3.stackHelper.slice.windowWidth,
                center: this.r3.stackHelper.slice.windowCenter,
                l_thr: this.r3.stackHelper.slice.lowerThreshold,
                u_thr: this.r3.stackHelper.slice.upperThreshold,
                direction: this.r3.camera.directionsLabel
            }
        });
        
        // notify puppeteer to take screenshot
        const puppetDiv = document.createElement('div');
        puppetDiv.setAttribute('id', 'puppeteer');
        document.body.appendChild(puppetDiv);
        this.setState({ imageLoading: false });

        //onwindowresize
        window.addEventListener('resize',this.onWindowResize)
    }

    render(){
        const { baseImage, segmentation } = this.props
        const { drawerContent, selectedSegmentation }  = this.state
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
        return(
            <div>
                <Drawer
                    title={drawerContent}
                    placement="right"
                    closable={false}
                    onClose={this.handleDrawerClose}
                    visible={this.state.visible}
                    width={700}
                >
                    {
                        (drawerContent==='annotations')? 
                                (this.state.widget.length >0)?
                                this.state.widget.map((annotation, index) => {
                                    return(
                                        <React.Fragment>
                                            <p>
                                                {annotation._widgetType+' '+index}
                                                <Switch style={{marginLeft: 10}} defaultChecked onClick={(e) => this.handleWidgets(e, annotation)}/>
                                            </p>
                                        </React.Fragment>
                                    )
                                }):null
                        : null
                    }
                    {
                            (drawerContent==='segmentations')?
                            <Spin spinning={this.state.drawerLoading}>
                                <Radio.Group onChange={this.onChange} value={selectedSegmentation}>
                                    { 
                                    
                                        segmentation.length>0?
                                        segmentation.map((seg, index)=> {
                                            return(<Radio style={radioStyle} value={seg}>{seg.split('/').slice(-1)[0]}</Radio>)
                                        }): null
                                    }
                                </Radio.Group>
                            </Spin>
                        : null
                    }
                </Drawer>
                <Layout>
                    <Sider
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            zIndex: 100
                        }}
                        collapsible collapsed='true'
                    >
                        <Menu style={{marginTop: 64}} theme="dark" defaultSelectedKeys={['1']} mode="inline">

                            <Menu.Item key="MouseProbe" onClick={this.handleImage}>
                                <PlusOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Mouse probe</span>
                            </Menu.Item>
                            <Menu.Item key="hideoverlay" onClick={this.hideOverlay}>
                                <EyeOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Hide</span>
                            </Menu.Item>

                            <Menu.Item key="PaintBrush" onClick={this.handleImage}>
                                <HighlightOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Hide</span>
                            </Menu.Item>

                            <Menu.Item key="Eraser" onClick={this.handleImage}>
                                <ScissorOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Hide</span>
                            </Menu.Item>


                            <Menu.Item key="VoxelProbe" onClick={this.handleImage}>
                                <AimOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Voxel probe</span>
                            </Menu.Item>
                            <Menu.Item key="Ruler" onClick={this.handleImage}>
                                <ArrowsAltOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Ruler</span>
                            </Menu.Item>
                            {/*<Menu.Item key="Handle" onClick={this.handleImage}>*/}
                                {/*<RotateRightOutlined style={{fontSize:20, color: '#38FFD8'}}/>*/}
                                {/*<span>Handle</span>*/}
                            {/*</Menu.Item>*/}
                            <Menu.Item key="Window" onClick={this.handleImage}>
                                <FullscreenOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Window</span>
                            </Menu.Item>
                            <Menu.Item key="Rectangle" onClick={this.handleImage}>
                                <BorderOuterOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Rectangle</span>
                            </Menu.Item>

                            <Menu.Item key="Annotation" onClick={this.handleImage}>
                                <FontColorsOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Annotation</span>
                            </Menu.Item>
                            <Menu.Item key="Freehand" onClick={this.handleImage}>
                                <EditOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Freehand</span>
                            </Menu.Item>
                            <Menu.Item key="WidgetsAngle" onClick={this.handleImage}>
                                <VerticalRightOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Angle</span>
                            </Menu.Item>
                            <Menu.Item key="WidgetsBiRuler" onClick={this.handleImage}>
                                <EnterOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>Biruler</span>
                            </Menu.Item>
                            <Menu.Item key="WidgetsCrossRuler" onClick={this.handleImage}>
                                <RadiusBottomleftOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>CrossRuler</span>
                            </Menu.Item>
                            <Menu.Item key="WidgetsEllipse" onClick={this.handleImage}>
                                <Loading3QuartersOutlined style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>WidgetsEllipse</span>
                            </Menu.Item>
                            <Menu.Item key="WidgetsPolygon" onClick={this.handleImage}>
                                <DeploymentUnitOutlined  style={{fontSize:20, color: '#38FFD8'}}/>
                                <span>WidgetsPolygon</span>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{zIndex: 100}} className="site-layout-sub-header-background">

                            <Row span={24}
                                 style={{
                                     verticalAlign: 'middle',
                                 }}
                            >

                                <Col span={6}>
                                    <h2 style={{color: '#38FFD8'}}>IRIS Visualization</h2>
                                </Col>

                                <Col span={6}>

                                </Col>

                                <Col span={12} style={{textAlign: 'right'}}>
                                    <Button style={{borderColor:'#000000', backgroundColor: '#38FFD8', color:'#000000'}} type="primary" onClick={this.handleScreenShot.bind(this)} id="screenshot"><CameraOutlined  size={30}/></Button>
                                    <Button style={{color: '#38FFD8', borderWidth: 0, marginRight: 10, fontSize: 15  }} size='small' type='link' title='3D'>3D</Button>
                                    <Button style={{color: '#38FFD8', borderWidth: 0, marginRight: 10, fontSize: 15  }} size='small' type='link' onClick={this.handleReset} title='reset'>Reset</Button>
                                    <Button style={{color: '#38FFD8', borderWidth: 0, marginRight: 10, fontSize: 15  }} size='small' type='link' title='annotations' onClick={()=>this.listAnnotations('annotations')}>All annotation</Button>
                                    <Button style={{color: '#38FFD8', borderWidth: 0, marginRight: 10, fontSize: 15  }} size='small' type='link' title='segmentations' onClick={()=>this.listAnnotations('segmentations')}>Segmentation</Button>
                                    <Button style={{color: '#38FFD8', borderWidth: 0, marginLeft: 100, fontSize: 15, align:'right' }} size='small' type='link' title='close' onClick={this.handleClose}>Close</Button>
                                </Col>
                            </Row>
                        </Header>
                        <Content style={{ backgroundColor: '#000000',
                            // marginLeft: 64,
                            // marginTop:64,
                            position: 'fixed',
                            width: "calc(100%-64)",
                            height: "100%",
                            width: "100%",
                            padding:100
                             }}>
                            <div className="site-layout-background" >
                                <Row span={24}>
                                    <Col span={8} style={{height:"100%"}}>
                                        <Row span={24}>
                                            <Col style={{ marginLeft:20, color: '#38FFD8', fontSize:10, textAlign:'left'}} span={6}>
                                                {  this.state.selected==='PaintBrush'?
                                                        <React.Fragment style={{zIndex:99, position: 'absolute'}}>
                                                            <Popover placement="right" content={<Slider handleBrushSize={this.handleBrushSize}/>}  trigger="click">
                                                                <Button>{this.state.brushsize}</Button>
                                                            </Popover>
                                                            <ColorPicker handleColor={this.handleColor}/>
                                                        </React.Fragment>:null
                                                }

                                                { this.state.r1?
                                                    Object.keys(this.state.r1).map((params)=> {
                                                        return(
                                                            <React.Fragment>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, textAlign:'left'}} >{params}: </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'left'}}>{Math.round(this.state.r1[params])}</span>
                                                                </React.Fragment>
                                                                <br/>
                                                            </React.Fragment>)

                                                    }): null
                                                }
                                            </Col>
                                                
                                            <Col span={8}>
                                                <p style={{ margin:10, color: '#38FFD8', position:'absolute', left:0, right:0, textAlign:'center'}} > Axial</p>
                                            </Col>
                                            <Col span={8}>
                                                <p style={{ color: '#fbfbfb',  textAlign:'right'}} >

                                                    {
                                                        this.state.coords && this.state.coords[0]?
                                                            <React.Fragment>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >Image - </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>X: {Math.round(this.state.ijk.x)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Y: {Math.round(this.state.ijk.y)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Z: {Math.round(this.state.ijk.z)}</span>
                                                                </React.Fragment>
                                                                <br/>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >IJKs - </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>X: {Math.round(this.state.coords[0].point.x)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Y: {Math.round(this.state.coords[0].point.y)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Z: {Math.round(this.state.coords[0].point.z)}</span>
                                                                </React.Fragment>
                                                                <br/>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >Intensity - </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>{Math.round(this.state.intensity)}</span>
                                                                </React.Fragment>
                                                            </React.Fragment>
                                                                : null
                                                    }
                                                </p>
                                            </Col>
                                        </Row>
                                        <Spin style={{marginTop: 100}} spinning={this.state.imageLoading}>
                                            <div style={{border: '2px solid green',  width: "100%", height:600, display:'block', position:'absolute'}} id='r1canvas'></div>
                                            {this.state.r1?
                                                <div style={{border: '1px solid #38FFD8', width: "100%",  height:600, position:'absolute'}} id="orientation">
                                                    <div id="top" className="direction">{this.state.r1.direction[0]}</div>
                                                    <div id="bottom" className="direction">{this.state.r1.direction[1]}</div>
                                                    <div id="left" className="direction">{this.state.r1.direction[2]}</div>
                                                    <div id="right" className="direction">{this.state.r1.direction[3]}</div>
                                                </div>:null}
                                            <div style={{border: '1px solid #38FFD8', width: "100%",  height:600, display:'block', position:'absolute'}} id='r1'></div>
                                            
                                        </Spin>
                                        <Divider type="vertical" style={{zIndex: 100, height: '5em' ,color: '#38FFD8'}}/>

                                    </Col>
                                    <Col span={8} style={{height:"100%"}}>
                                        <Row span={24}>
                                            <Col style={{ marginLeft:20, color: '#38FFD8', fontSize:10, textAlign:'left', zIndex:99}} span={6}>
                                            { this.state.r2?
                                                        Object.keys(this.state.r2).map((params)=> {
                                                            return(
                                                                <React.Fragment>
                                                                    <React.Fragment>
                                                                        <span style={{ color: '#38FFD8', fontSize:10, textAlign:'left'}} >{params}: </span>
                                                                        <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'left'}}>{Math.round(this.state.r2[params])}</span>
                                                                    </React.Fragment>
                                                                    <br/>
                                                                </React.Fragment>)

                                                        }): null
                                                    }


                                            </Col>
                                            
                                            <Col span={8}>
                                                <p style={{ margin:10, color: '#38FFD8', position:'absolute', left:0, right:0, textAlign:'center'}} > Sagittal</p>
                                            </Col>
                                            <Col span={8}>
                                                <p style={{ color: '#fbfbfb',  textAlign:'right', right:0, left:0}} >

                                                    {
                                                        this.state.coords && this.state.coords[0]?
                                                            <React.Fragment>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >Image: </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>X: {Math.round(this.state.ijk.x)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Y: {Math.round(this.state.ijk.y)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Z: {Math.round(this.state.ijk.z)}</span>
                                                                </React.Fragment>
                                                                <br/>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >IJKs: </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>X: {Math.round(this.state.coords[0].point.x)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Y: {Math.round(this.state.coords[0].point.y)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Z: {Math.round(this.state.coords[0].point.z)}</span>
                                                                </React.Fragment>
                                                                <br/>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >Intensity: </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>{Math.round(this.state.intensity)}</span>
                                                                </React.Fragment>
                                                            </React.Fragment>
                                                                : null
                                                    }
                                                </p>
                                            </Col>
                                        </Row>
                                        <Spin style={{marginTop: 100}} spinning={this.state.imageLoading}>
                                            <div style={{border: '2px solid green', width: "100%", height:600, display:'block', position:'absolute'}} id='r2canvas'></div>
                                            {this.state.r2?
                                                <div style={{border: '1px solid #38FFD8', width: "100%",  height:600, position:'absolute'}} id="orientation">
                                                    <div id="top" className="direction">{this.state.r2.direction[0]}</div>
                                                    <div id="bottom" className="direction">{this.state.r2.direction[1]}</div>
                                                    <div id="left" className="direction">{this.state.r2.direction[2]}</div>
                                                    <div id="right" className="direction">{this.state.r2.direction[3]}</div>
                                                </div>:null}
                                            <div style={{border: '1px solid #38FFD8', width: "100%", height:600, display:'block', position:'absolute'}} id='r2'></div>
                                        </Spin>
                                        
                                    </Col>
                                    <Col span={8} style={{height:"100%"}}>
                                        <Row span={24}>
                                            <Col style={{ marginLeft:20, color: '#38FFD8', fontSize:10, textAlign:'left', zIndex:99}} span={6}>
                                            { this.state.r3?
                                                        Object.keys(this.state.r3).map((params)=> {
                                                            return(
                                                                <React.Fragment>
                                                                    <React.Fragment>
                                                                        <span style={{ color: '#38FFD8', fontSize:10, textAlign:'left'}} >{params}: </span>
                                                                        <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'left'}}>{Math.round(this.state.r3[params])}</span>
                                                                    </React.Fragment>
                                                                    <br/>
                                                                </React.Fragment>)

                                                        }): null
                                                    }
                                            </Col>
                                            
                                            <Col span={8}>
                                                <p style={{ margin:10, color: '#38FFD8', position:'absolute', left:0, right:0, textAlign:'center'}} > Coronal</p>
                                            </Col>
                                            <Col span={8}>
                                                <p style={{ color: '#fbfbfb',  textAlign:'right'}} >

                                                    {
                                                        this.state.coords && this.state.coords[0]?
                                                            <React.Fragment>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >Images - </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>X: {Math.round(this.state.ijk.x)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Y: {Math.round(this.state.ijk.y)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Z: {Math.round(this.state.ijk.z)}</span>
                                                                </React.Fragment>
                                                                <br/>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >IJKs - </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>X: {Math.round(this.state.coords[0].point.x)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Y: {Math.round(this.state.coords[0].point.y)}</span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}> Z: {Math.round(this.state.coords[0].point.z)}</span>
                                                                </React.Fragment>
                                                                <br/>
                                                                <React.Fragment>
                                                                    <span style={{ color: '#38FFD8', fontSize:10}} >Intensity - </span>
                                                                    <span style={{ color: '#38FFD8', fontSize:10, fontWeight:'bold', textAlign:'right'}}>{Math.round(this.state.intensity)}</span>
                                                                </React.Fragment>
                                                            </React.Fragment>
                                                                : null
                                                    }
                                                </p>
                                            </Col>
                                        </Row>
                                        <Spin style={{marginTop: 100}} spinning={this.state.imageLoading}>
                                            <div style={{border: '2px solid green', width: "100%", height:600, display:'block', position:'absolute'}} id='r3canvas'></div>
                                            {this.state.r3?
                                                <div style={{border: '1px solid #38FFD8', width: "100%",  height:600, position:'absolute'}} id="orientation">
                                                    <div id="top" className="direction">{this.state.r3.direction[0]}</div>
                                                    <div id="bottom" className="direction">{this.state.r3.direction[1]}</div>
                                                    <div id="left" className="direction">{this.state.r3.direction[2]}</div>
                                                    <div id="right" className="direction">{this.state.r3.direction[3]}</div>
                                                </div>:null}
                                            <div style={{border: '1px solid #38FFD8', width: "100%", height:600, display:'block', position:'absolute'}} id='r3'></div>
                                        </Spin>
                                    </Col>
                                </Row>
                                {/* <Row span={24}>
                                    <div style={{border: '2px solid green', width: "100%", height:200, display:'block', position:'relative'}} id='r0canvas'></div>
                                    <div style={{border: '1px solid #38FFD8', width: "100%", height:200, display:'block', position:'relative'}} id='r0'></div>
                                </Row> */}
                            </div>
                        </Content>

                    </Layout>
                </Layout>
                <div id='my-gui-container'></div>
                <div style={{display: 'none'}} style={{height:10 }} id='r0'></div>
                <div style={{display: 'none'}} id="my-lut-container">
                    <div><div id="my-lut-canvases-l1" className="my-lut-canvases"></div></div>
                    <div>Data LUT<div id="my-lut-canvases-l0" className="my-lut-canvases"></div></div>
                    <div id='r0Editor' className='ssrVisualizer'></div>
                    <div id='r3Editor'></div>
                </div>
            </div>
        )
    }
}

const mapStatetoProps=(state) => {
    return state
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(AllActions, dispatch)
})

export default connect(
    mapStatetoProps,
    mapDispatchToProps,
) (UpdatedWrapper)
