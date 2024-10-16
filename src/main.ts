import * as THREE from "three";

import { SpectatorViewer } from "./SpectatorViewer.js";
// @ts-ignore
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

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
            'rotation': [0, 1, 0, 1],
            'scale': [2, 2, 2]
        }).then((obj: any) =>
        {
            console.log("obj?", obj);
            console.log("viewer?", viewer);
            console.log("splatmesh?", viewer.splatMesh.getScene(0));
            const center = new THREE.Vector3();
            viewer.splatMesh.getSplatCenter(0, center)
            console.log("getSplatCenter?", center);

            viewer.splatMesh.getScene(0).applyMatrix4(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

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
