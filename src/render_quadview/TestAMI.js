import * as THREE from 'three';
import React from 'react';
import Vector3 from '../ami/src/geometries/geometries';
import VJS from '../ami/src/geometries/geometries';

class TestAMI extends React.Component{
    render(){
//         let halfDimensions = new THREE.Vector(123, 45, 67);
//         let center = new Vector3(0, 0, 0);
//         let orientation = new Vector3(
//             new Vector3(1, 0, 0),
//             new Vector3(0, 1, 0),
//             new Vector3(0, 0, 1)
//         );
//
// // Define slice plane
//         let position = center.clone();
//         let direction = new Vector3(-0.2, 0.5, 0.3);
//
// // Create the slice geometry & materials
//         let sliceGeometry = new VJS.geometries.slice(halfDimensions, center, orientation, position, direction);
//         let sliceMaterial = new THREE.MeshBasicMaterial({
//             'side': THREE.DoubleSide,
//             'color': 0xFF5722
//         });
//
// // Create mesh and add it to the scene
//         let slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
//         // scene.add(slice);
        console.log('Test')
        return(
            <div></div>
        )
    }
}