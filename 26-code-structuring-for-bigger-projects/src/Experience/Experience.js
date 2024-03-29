import { Mesh, Scene } from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Resources from "./Utils/Resources";
import sources from "./sources";

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import World from "./World/World";
import Debug from "./Utils/Debug";

let instance = null

export default class Experience {
    constructor(canvas) {

        if (instance) {
            return instance;
        }

        instance = this;

        // Options
        this.canvas = canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

        this.sizes.on('resize', () => {
            this.resize();
        });

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.camera.update();
        this.world.update();
        this.renderer.update();
    }

    destroy() {
        this.sizes.off('resize');
        this.time.off('trigger');
        this.time.off('tick');

        this.scene.traverse(child => {
            if (child instanceof Mesh) {
                child.geometry.dispose();

                for (const key in child.material) {
                    const value = child.material[key];

                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            }
        });

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if (this.debug.active) {
            this.debug.ui.destroy();
        }

    }
}
