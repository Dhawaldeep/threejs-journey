import { AnimationMixer, Mesh } from "three";
import Experience from "../Experience";

export default class Fox {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time
        this.debug = this.experience.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Fox');
        }
        
        this.resource = this.resources.items.foxModel;


        this.setModel();
        this.setAnimation();
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.scale.set(0.02, 0.02, 0.02);
        this.scene.add(this.model);

        this.model.traverse((child) =>
        {
            if(child instanceof Mesh)
            {
                child.castShadow = true;
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new AnimationMixer(this.model)

        this.animation.actions = {
            idle: this.animation.mixer.clipAction(this.resource.animations[0]),
            walking: this.animation.mixer.clipAction(this.resource.animations[1]),
            running: this.animation.mixer.clipAction(this.resource.animations[2]),
        };

        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        this.animation.actions.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 1);

            this.animation.actions.current = newAction;
        }

        if (this.debug.active) {
            const debugObject = {
                playIdle: () => this.animation.actions.play('idle'),
                playWalking: () => this.animation.actions.play('walking'),
                playRunning: () => this.animation.actions.play('running')
            };

            this.debugFolder.add(debugObject, 'playIdle').name('Play Idle');
            this.debugFolder.add(debugObject, 'playWalking').name('Play Walking');
            this.debugFolder.add(debugObject, 'playRunning').name('Play Running');
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}