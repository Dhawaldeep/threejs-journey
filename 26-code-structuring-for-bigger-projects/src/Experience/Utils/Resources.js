import EventEmitter from "./EventEmitter"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CubeTextureLoader, TextureLoader } from "three";

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        // Option
        this.sources = sources;

        // Setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {
            gltFLoader: new GLTFLoader(),
            textureLoader: new TextureLoader(),
            cubeTextureLoader: new CubeTextureLoader(),
        };
    }

    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltFLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file);
                });
            } else if(source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file);
                });
            } else if(source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file);
                });
            }
        }
    }

    sourceLoaded(source, file) {
        console.log(source, file);
        this.items[source.name] = file;
        this.loaded++;

        console.log(this.loaded, this.toLoad)

        if (this.toLoad === this.loaded) {
            this.trigger('ready');
        }
    }
}