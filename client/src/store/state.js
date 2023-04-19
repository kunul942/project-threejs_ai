//use valtio
import { proxy } from 'valtio'

export const state = proxy({
    intro: true, //are we currently in the homepage or not
    color: '#EFBD48',  //default color
    isLogoTexture: true, //logo in the shirt
    isFullTexture: false, //texture in the shirt
    logoDecal: './threejs.png',  //initial Logo
    fullDecal: './threejs.png'  //initial Logo texture
})