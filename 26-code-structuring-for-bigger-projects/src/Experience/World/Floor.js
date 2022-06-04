import { CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, sRGBEncoding } from 'three';
import Experience from '../Experience.js'

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setGeometry();
        this.setTexure();
        this.setMaterial();
        console.log('set mesh')
        this.setMesh();
    }

    setGeometry() {
        this.floorGeometry = new CircleGeometry(5, 64);
    }

    setTexure() {
        this.textures = {
            color: this.resources.items['grassColorTexture'],
            normal: this.resources.items['grassNormalTexture']
        }
        this.textures.color.encoding = sRGBEncoding;
        this.textures.color.repeat.set(1.5, 1.5);
        this.textures.color.wrapS = RepeatWrapping;
        this.textures.color.wrapT = RepeatWrapping;

        this.textures.normal.wrapS = RepeatWrapping;
        this.textures.normal.wrapT = RepeatWrapping;
    }

    setMaterial() {
        this.material = new MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        });
    }

    setMesh() {
        this.mesh = new Mesh(this.floorGeometry, this.material);
        this.mesh.rotation.x = - Math.PI * 0.5;
        this.scene.add(this.mesh);
        this.mesh.receiveShadow = true;
    }
}
