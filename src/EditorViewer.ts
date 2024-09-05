import { Vector3 } from "three";
//@ts-ignore
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';


export class EditorViewer extends GaussianSplats3D.Viewer
{

    private _points: Vector3[] = [];

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera)
    {
        super({
            'halfPrecisionCovariancesOnGPU': true,
            'scene': scene,
            'selfDrivenMode': false,
            'renderer': renderer,
            'camera': camera,
            //'useBuiltInControls': false,
        })

        // listen to key events for movements

        /*window.addEventListener('keydown', (event) =>
        {
            switch (event.key)
            {
                case 'w':
                    this.camera.translateZ(-0.1);
                    break;
                case 's':
                    this.camera.translateZ(0.1);
                    break;
                case 'a':
                    this.camera.translateX(-0.1);
                    break;
                case 'd':
                    this.camera.translateX(0.1);
                    break;
                case 'q':
                    this.camera.translateY(-0.1);
                    break;
                case 'e':
                    this.camera.translateY(0.1);
                    break;
                case 'ArrowUp':
                    this.camera.rotateX(0.1);
                    break;
                case 'ArrowDown':
                    this.camera.rotateX(-0.1);
                    break;
                case 'ArrowLeft':
                    this.camera.rotateY(0.1);
                    break;
                case 'ArrowRight':
                    this.camera.rotateY(-0.1);
                    break;
                default:
                    break;
            };
        });

        // listen to mouse events for movements

        let mouseDown = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        
        window.addEventListener('mousedown', (event) =>
        {
            mouseDown = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        });

        window.addEventListener('mouseup', (_) =>
        {
            mouseDown = false;
        });

        window.addEventListener('mousemove', (event) =>
        {
            if (mouseDown)
            {
                this.camera.rotateX((event.clientY - lastMouseY) / 100);
                this.camera.rotateY((event.clientX - lastMouseX) / 100);
                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }
        });*/


        // add button to save points
        const savePointsButton = document.createElement('button');
        savePointsButton.innerHTML = 'Save points';
        savePointsButton.style.position = 'absolute';
        savePointsButton.style.top = '0px';
        savePointsButton.style.left = '0px';
        savePointsButton.style.zIndex = '100';
        savePointsButton.style.width = '100px';
        savePointsButton.style.height = '30px';
        savePointsButton.style.backgroundColor = 'red';
        savePointsButton.style.color = 'white';
        savePointsButton.style.border = 'none';
        savePointsButton.style.outline = 'none';
        savePointsButton.style.cursor = 'pointer';
        savePointsButton.addEventListener('click', () =>
        {
            this.savePointsAndSaveAsKsplat(this._points);
        });
        document.body.appendChild(savePointsButton);

    }

    public updateLoop(_: number): void
    {
        requestAnimationFrame(this.updateLoop.bind(this));
        (this as any).update();
        (this as any).render();
    }

    public start(): void
    {
        this.updateLoop(0);
    }

    public savePointsAndSaveAsKsplat(points: THREE.Vector3[])
    {
        const pointsJSON = JSON.stringify(points);
        const blob = new Blob([pointsJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'points.json';
        link.href = url;
        link.click();

        const compressionLevel = 1;
        const splatAlphaRemovalThreshold = 5; // out of 255
        const plyLoader = new GaussianSplats3D.PlyLoader();

        const onprogress = (event: ProgressEvent) =>
        {
            console.log('progress', event.loaded, event.total);
        }
        plyLoader.loadFromURL('public/cadre.ply', onprogress, compressionLevel, splatAlphaRemovalThreshold, 125, 255)
            .then((splatBuffer: any) =>
            {
                console.log('downloaded');
                new GaussianSplats3D.SplatLoader(splatBuffer).downloadFile('cadre.ksplat');
                console.log('done');
            });
    }
}