import * as THREE from "three";

export function updateLayer1 (rendererObj) {
    // update layer1 geometry...
    if (rendererObj.meshLayer1) {
        rendererObj.meshLayer1.geometry.dispose();
        rendererObj.meshLayer1.geometry = rendererObj.stackHelper.slice.geometry;
        rendererObj.meshLayer1.geometry.verticesNeedUpdate = true;
    }
}

export function updateLayerMix (rendererObj) {
    // update layer1 geometry...
    if (rendererObj.meshLayerMix) {
        rendererObj.sceneLayerMix.remove(rendererObj.meshLayerMix);
        rendererObj.meshLayerMix.material.dispose();
        rendererObj.meshLayerMix.material = null;
        rendererObj.meshLayerMix.geometry.dispose();
        rendererObj.meshLayerMix.geometry = null;

        // add mesh in this scene with right shaders...
        rendererObj.meshLayerMix = new THREE.Mesh(rendererObj.stackHelper.slice.geometry, rendererObj.materialLayerMix);
        // go the LPS space
        rendererObj.meshLayerMix.applyMatrix(rendererObj.stackHelper.stack._ijk2LPS);

        rendererObj.sceneLayerMix.add(rendererObj.meshLayerMix);
    }
}

export function updateLocalizer (refObj, targetLocalizersHelpers) {
    let refHelper = refObj.stackHelper;
    let localizerHelper = refObj.localizerHelper;
    let plane = refHelper.slice.cartesianEquation();
    localizerHelper.referencePlane = plane;

    // bit of a hack... works fine for this application
    for (let i = 0; i < targetLocalizersHelpers.length; i++) {
        for (let j = 0; j < 3; j++) {
            let targetPlane = targetLocalizersHelpers[i]['plane' + (j + 1)];
            if (targetPlane &&
                plane.x.toFixed(6) === targetPlane.x.toFixed(6) &&
                plane.y.toFixed(6) === targetPlane.y.toFixed(6) &&
                plane.z.toFixed(6) === targetPlane.z.toFixed(6)) {
                targetLocalizersHelpers[i]['plane' + (j + 1)] = plane;
            }
        }
    }

    // update the geometry will create a new mesh
    localizerHelper.geometry = refHelper.slice.geometry;
}

export function updateClipPlane (refObj, clipPlane) {
    const stackHelper = refObj.stackHelper;
    const camera = refObj.camera;
    let vertices = stackHelper.slice.geometry.vertices;
    let p1 = new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z)
        .applyMatrix4(stackHelper._stack.ijk2LPS);
    let p2 = new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z)
        .applyMatrix4(stackHelper._stack.ijk2LPS);
    let p3 = new THREE.Vector3(vertices[2].x, vertices[2].y, vertices[2].z)
        .applyMatrix4(stackHelper._stack.ijk2LPS);

    clipPlane.setFromCoplanarPoints(p1, p2, p3);

    let cameraDirection = new THREE.Vector3(1, 1, 1);
    cameraDirection.applyQuaternion(camera.quaternion);

    if (cameraDirection.dot(clipPlane.normal) > 0) {
        clipPlane.negate();
    }
}

export function onYellowChanged(opacity){
    if (opacity){
        this.r1.uniformsLayer1.uOpacity.value = opacity
    }
    this.updateLocalizer(this.r2, [this.r1.localizerHelper, this.r3.localizerHelper]);
    this.updateClipPlane(this.r2, this.clipPlane2);
    this.updateLayer1(this.r2)
    this.updateLayerMix(this.r2)
}
export function onRedChanged(opacity){
    if (opacity){
        this.r2.uniformsLayer1.uOpacity.value = opacity
    }
    this.updateLocalizer(this.r1, [this.r2.localizerHelper, this.r3.localizerHelper]);
    this.updateClipPlane(this.r1, this.clipPlane1);
    if (this.redContourHelper) {
        this.redContourHelper.geometry = this.r1.stackHelper.slice.geometry;
    }
    this.updateLayer1(this.r1)
    this.updateLayerMix(this.r1)
}
export function onGreenChanged(opacity){
    if (opacity){
        this.r3.uniformsLayer1.uOpacity.value = opacity
    }
    this.updateLocalizer(this.r3, [this.r1.localizerHelper, this.r2.localizerHelper]);
    this.updateClipPlane(this.r3, this.clipPlane3);
    this.updateLayer1(this.r3)
    this.updateLayerMix(this.r3)
}