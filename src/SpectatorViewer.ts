import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from "three";

export class SpectatorViewer extends GaussianSplats3D.Viewer
{
    //private _scene: THREE.Scene;
    private _camera: THREE.Camera;
    private _renderer: THREE.WebGLRenderer;

    private isDragging = false;
    private previousMousePosition = { x: 0, y: 0 };

    //private _debugSphere = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0xff2200 }));

    private constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera, imgBitmap: ImageBitmap)
    {
        super({
            'halfPrecisionCovariancesOnGPU': true,
            'threeScene': scene,
            'selfDrivenMode': false,
            'renderer': renderer,
            'camera': camera,
            'focalAdjustment': 4.0,
            'webXRMode': GaussianSplats3D.WebXRMode.AR,
            'webXRSessionInit': {
                requiredFeatures: ['image-tracking'],
                trackedImages: [
                    {
                        image: imgBitmap,
                        widthInMeters: 0.1
                    }
                ]
            }
        });

        this._renderer = renderer;
        //this._scene = scene;
        this._camera = camera;
        //this._debugSphere.position.set(1, 1, 1)
        //this._debugSphere.matrixAutoUpdate = false;
        //scene.add(this._debugSphere)
        this._camera.position.set(0, 0.25, 0.5)
        console.log("debug", this.splatMesh.rotation)

        // Set up event listeners
        renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        renderer.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        renderer.domElement.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    private onMouseDown(event: MouseEvent)
    {
        this.isDragging = !this.isDragging;
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    private onMouseMove(event: MouseEvent)
    {
        if (this.isDragging)
        {
            const deltaX = event.clientX - this.previousMousePosition.x;

            // Rotate model based on drag distance
            this.splatMesh.rotation.y += deltaX * 0.01; // Adjust the multiplier for rotation speed

            this.previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    }

    private onMouseUp(_: MouseEvent)
    {
        this.isDragging = false;
    }

    private onTouchStart(event: TouchEvent)
    {
        this.isDragging = true;
        this.previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }

    private onTouchMove(event: TouchEvent)
    {
        if (this.isDragging)
        {
            const deltaX = event.touches[0].clientX - this.previousMousePosition.x;

            // Rotate model based on drag distance
            this.splatMesh.rotation.y += deltaX * 0.01; // Adjust the multiplier for rotation speed

            this.previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
    }

    private onTouchEnd(_: TouchEvent)
    {
        this.isDragging = false;
    }

    public static async createSpectatorViewer(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera)
    {
        const img = document.getElementById('marker')! as HTMLImageElement;
        // Ensure the image is loaded and ready for use
        const imgBitmap = await createImageBitmap(img);

        return new SpectatorViewer(scene, renderer, camera, imgBitmap);

    }

    public updateLoop(_: number, frame: XRFrame)
    {
        /*if (this._renderer.xr.getSession())
        {
            const scores = await (this._renderer.xr.getSession()! as any).getTrackedImageScores();
            let trackableImages = 0;
            for (let index = 0; index < scores.length; ++index)
            {
                if (scores[index] == 'untrackable')
                {
                    console.log("untrackable iamge")
                } else
                {
                    ++trackableImages;
                }
            }
            if (trackableImages == 0)
            {
                //WarnUser("No trackable images");
            }
        }*/

        if (frame)
        {
            const results = (frame as any).getImageTrackingResults();
            for (const result of results)
            {
                // The result's index is the image's position in the trackedImages array specified at session creation
                //const imageIndex = result.index;

                // Get the pose of the image relative to a reference space.

                const state = result.trackingState;

                if (state === "tracked" || state === "emulated")
                {
                    const referenceSpace = this._renderer.xr.getReferenceSpace();
                    if (referenceSpace)
                    {
                        const pose = frame.getPose(result.imageSpace, referenceSpace);
                        if (pose)
                        {
                            this.splatMesh.position.set(pose.transform.position.x, pose.transform.position.y, pose.transform.position.z);
                            this.splatMesh.quaternion.set(pose.transform.orientation.x, pose.transform.orientation.y, pose.transform.orientation.z, pose.transform.orientation.w);
                            this.splatMesh.visible = true;
                        }
                    }
                }
                else
                {
                    this.splatMesh.visible = false;
                }

            }
        }
        //const deltaTime = (time - this.previous_time) * 0.001; // Convert to seconds
        //console.log("deltaTime", deltaTime * 0.5, this.splatMesh.rotation._y)
        //this.splatMesh.rotateY(deltaTime * 0.5);
        this.update();
        this.render();
    }
}