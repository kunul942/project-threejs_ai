import { easing } from "maath"
import { useSnapshot } from "valtio"  
import { useFrame } from "@react-three/fiber"
import { Decal, useGLTF, useTexture } from "@react-three/drei"

import { state } from '../store'

export const Shirt = () => {

    const snap = useSnapshot( state )

    //3D MODAL
    const { nodes, materials } = useGLTF('/shirt_baked.glb')

    //textures for the shirt
    const logoTexture = useTexture( snap.logoDecal )
    const fullTexture = useTexture( snap.fullDecal )


    //apply the color smoothly
    useFrame(( state, delta )=> easing.dampC( materials.lambert1.color ,snap.color, 0.25, delta ))
    

    // update always the shirt 
    const stateString = JSON.stringify( snap )

    return (    
        <group 
            // update always the shirt 
            key={ stateString }
        > 
            <mesh
                castShadow
                geometry={ nodes.T_Shirt_male.geometry }
                material={ materials.lambert1 }
                material-roughness={ 1 }
                dispose={ null }
            >
                {/* showing the full texture */}
                { snap.isFullTexture && (
                    <Decal 
                        position={[ 0, 0, 0 ]}
                        rotation={[ 0, 0, 0 ]}
                        scale={ 1 }
                        map={ fullTexture }
                    />
                ) }
                {/* showing the logo */}
                { snap.isLogoTexture && (
                    <Decal 
                        position={[ 0, 0.04, 0.15 ]}
                        rotation={[ 0, 0, 0 ]}
                        scale={ 0.15 }
                        map={ logoTexture }
                        map-anisotropy={ 16 }
                        depthTest={ false }
                        depthWrite={ true }
                    />
                ) }
            </mesh>
        </group>
    )

}
