import * as THREE from "three";

import { SpectatorViewer } from "./SpectatorViewer.js";

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
});
renderer.setClearColor(0xffffff, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
rootElement.appendChild(renderer.domElement);

window.addEventListener('resize', () =>
{
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(new THREE.Vector3().fromArray([1, 8, 5]));
camera.up = new THREE.Vector3().fromArray([0, 1, 0]).normalize();
camera.lookAt(new THREE.Vector3().fromArray([10, 4, 10]));

const scene = new THREE.Scene();
const boxColor = 0xBBBBBB;
const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ 'color': boxColor }));
boxMesh.position.set(0, 0, 0);
scene.add(boxMesh);
SpectatorViewer.createSpectatorViewer(scene, renderer, camera).then((viewer: any) =>
{
    //const img = document.getElementById('assiette')! as HTMLImageElement;
    // Ensure the image is loaded and ready for use
    //createImageBitmap(img).then(imgBitmap =>
    {
        (viewer as any).addSplatScene('public/cadre_trimmed.splat', {
            'position': [0, 0, 0],
            'rotation': [0, 1, 0, 1],
            'scale': [2, 2, 2]
        }).then((_: any) =>
        {
            const center = new THREE.Vector3();
            viewer.splatMesh.getSplatCenter(0, center)
            viewer.splatMesh.getScene(0).matrixAutoUpdate = false;
            const controller = renderer.xr.getController(0);
            console.log("controller", controller);
            controller.addEventListener('connected', (e) =>
            {
                console.log("connected", e);
            });

            //(viewer as any).start();
            viewer.renderer.setAnimationLoop(viewer.updateLoop.bind(viewer));

        });
    }//);

})
