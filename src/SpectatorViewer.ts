// @ts-ignore
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from "three";

export class SpectatorViewer extends GaussianSplats3D.Viewer
{
    //private _scene: THREE.Scene;
    //private _camera: THREE.Camera;
    private _referenceSpace: XRReferenceSpace = null!;
    private _renderer: THREE.WebGLRenderer;

    private _debugSphere = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));

    private constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera, imgBitmap: ImageBitmap)
    {
        super({
            'halfPrecisionCovariancesOnGPU': true,
            'scene': scene,
            'selfDrivenMode': false,
            'renderer': renderer,
            'camera': camera,
            'webXRMode': GaussianSplats3D.WebXRMode.AR,
            'webXRSessionInit': {
                requiredFeatures: ['image-tracking'],
                trackedImages: [
                    {
                        image: imgBitmap,
                        widthInMeters: 0.2
                    }
                ]
            }
        });

        this._renderer = renderer;
        //this._scene = scene;
        //this._camera = camera;
        this.setupReferenceSpace();
        scene.add(this._debugSphere)

    }

    private async setupReferenceSpace()
    {
        while (this._renderer.xr.getSession() === null)
        {
            console.log("waiting")
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        console.log("making reference space")
        this._referenceSpace = await this._renderer.xr.getSession()?.requestReferenceSpace("local")!;

    }

    public static async createSpectatorViewer(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera)
    {

        const img = document.getElementById('assiette')! as HTMLImageElement;
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

                if (state == "tracked")
                {
                    console.log("tracked image")
                } else if (state == "emulated")
                {
                    console.log("emulated image")
                }
                if (this._referenceSpace)
                {
                    const pose = frame.getPose(result.imageSpace, this._referenceSpace);
                    console.log(pose);
                    if (pose)
                    {
                        (this as any).splatMesh.getScene(0).matrix = new THREE.Matrix4().fromArray(pose.transform.matrix);
                        (this as any).splatMesh.getScene(0).updateMatrix();
                        this._debugSphere.matrix = new THREE.Matrix4().fromArray(pose.transform.matrix);
                        this._debugSphere.updateMatrix();
                    }

                }
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