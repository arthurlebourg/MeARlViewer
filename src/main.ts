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

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const scene = new THREE.Scene();
SpectatorViewer.createSpectatorViewer(scene, renderer, camera).then((viewer: any) =>
{
    //const img = document.getElementById('assiette')! as HTMLImageElement;
    // Ensure the image is loaded and ready for use
    //createImageBitmap(img).then(imgBitmap =>
    {
        //viewer.addSplatScene('public/cadre_trimmed.splat').then((_: any) =>
        viewer.addSplatScene('public/amogus_red.splat').then((_: any) =>
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
