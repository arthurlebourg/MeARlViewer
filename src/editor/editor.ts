import * as THREE from "three";

import { EditorViewer } from "../EditorViewer.js";

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

const renderer = new THREE.WebGLRenderer({
    antialias: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
rootElement.appendChild(renderer.domElement);

window.addEventListener('resize', () =>
{
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(new THREE.Vector3().fromArray([1, 4, -6]));
camera.up = new THREE.Vector3().fromArray([0, -1, 0]).normalize();
camera.lookAt(new THREE.Vector3().fromArray([10, 4, 10]));

const scene = new THREE.Scene();

const viewer = new EditorViewer(scene, renderer, camera);

(viewer as any).addSplatScenes([{
    'path': '../public/cadre_trimmed.splat',
    'splatAlphaRemovalThreshold': 5,
    'showLoadingSpinner': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5]
}]).then(() =>
{
    viewer.start();
});