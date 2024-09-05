// @ts-ignore
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

export class SpectatorViewer extends GaussianSplats3D.Viewer
{
    //private _scene: THREE.Scene;
    //private _camera: THREE.Camera;

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.Camera)
    {
        super({
            'halfPrecisionCovariancesOnGPU': true,
            'scene': scene,
            'selfDrivenMode': false,
            'renderer': renderer,
            'camera': camera,
            'webXRMode': GaussianSplats3D.WebXRMode.AR,
        })

        //this._scene = scene;
        //this._camera = camera;
    }

    public updateLoop(_: number, frame: XRFrame): void
    {
        frame;
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