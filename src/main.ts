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
SpectatorViewer.createSpectatorViewer(scene, renderer, camera).then((viewer: any) =>
{
    //const img = document.getElementById('assiette')! as HTMLImageElement;
    // Ensure the image is loaded and ready for use
    //createImageBitmap(img).then(imgBitmap =>
    {
        (viewer as any).addSplatScene('public/cadre_trimmed.splat', {
            'position': [0, 0, 0],
            'rotation': [0, 0, 0, 1],
            'scale': [1, 1, 1]
        }).then((_: any) =>
        {
            //viewer.splatMesh.getScene(0).matrixAutoUpdate = false;
            const controller = renderer.xr.getController(0);
            console.log("controller", controller);
            controller.addEventListener('connected', (e) =>
            {
                console.log("connected", e);
            });

            //viewer.splatMesh.matrixAutoUpdate = false;

            console.log("viewer", viewer)
            //(viewer as any).start();
            viewer.renderer.setAnimationLoop(viewer.updateLoop.bind(viewer));

        });
    }//);

})
