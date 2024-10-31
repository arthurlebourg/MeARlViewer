import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from "three";

export class SpectatorViewer extends GaussianSplats3D.Viewer
{
    //private _scene: THREE.Scene;
    //private _camera: THREE.Camera;
    private _renderer: THREE.WebGLRenderer;

    private _debugSphere = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0xff2200 }));

    private constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera, imgBitmap: ImageBitmap)
    {
        super({
            'halfPrecisionCovariancesOnGPU': true,
            'threeScene': scene,
            'selfDrivenMode': false,
            'renderer': renderer,
            'camera': camera,
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
        //this._camera = camera;
        this._debugSphere.position.set(1, 1, 1)
        this._debugSphere.matrixAutoUpdate = false;
        scene.add(this._debugSphere)
    }

    public static async createSpectatorViewer(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera)
    {
        const img = document.getElementById('marker')! as HTMLImageElement;
        // Ensure the image is loaded and ready for use
        const imgBitmap = await createImageBitmap(img);

        return new SpectatorViewer(scene, renderer, camera, imgBitmap);

    }

    public async updateLoop(time: number, frame: XRFrame)
    {
        frame;
        time;
        if (this._renderer.xr.getSession())
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
        }

        if (frame)
        {
            const results = (frame as any).getImageTrackingResults();
            for (const result of results)
            {
                // The result's index is the image's position in the trackedImages array specified at session creation
                //const imageIndex = result.index;

                // Get the pose of the image relative to a reference space.

                const state = result.trackingState;

                if (state === "tracked")
                {
                    const referenceSpace = this._renderer.xr.getReferenceSpace();
                    if (referenceSpace)
                    {
                        const pose = frame.getPose(result.imageSpace, referenceSpace);
                        if (pose)
                        {
                            this.splatMesh.position.set(pose.transform.position.x, pose.transform.position.y, pose.transform.position.z);
                            this.splatMesh.quaternion.set(pose.transform.orientation.x, pose.transform.orientation.y, pose.transform.orientation.z, pose.transform.orientation.w);
                            this._debugSphere.visible = true;
                            this.splatMesh.visible = true;
                        }
                    }
                }
                else
                {
                    this._debugSphere.visible = false;
                    this.splatMesh.visible = false;
                }
                /*else if (state == "emulated")
                {
                    //console.log("emulated image")
                }*/

            }
        }
        //console.log("hello");
        //(this as any).splatMesh.getScene(0).rotateX(time / 1000);
        (this as any).update();
        (this as any).render();
        //(this as any).renderer.xr.getSession().requestAnimationFrame(this.updateLoop.bind(this));
    }


    /*public async start()
    {
        while ((this as any).viewer.xr.getSession() === null)
        {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        (this as any).viewer.xr.getSession().requestAnimationFrame(this.updateLoop.bind(this));

    }*/
}