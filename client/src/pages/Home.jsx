import { motion, AnimatePresence } from "framer-motion"
import { useSnapshot } from "valtio"

import { state } from '../store'
import { CustomButton } from "../components"

import { 
    headContainerAnimation, 
    headContentAnimation, 
    headTextAnimation, 
    slideAnimation
} from '../config/motion'



export const Home = () => {
    const snap = useSnapshot( state )

    return(
        <AnimatePresence>
            { snap.intro && (

                <motion.section className="home" { ...slideAnimation('left') }>
                    
                    <motion.header { ...slideAnimation('down') }>
                        <img 
                            src="./threejs.png" 
                            alt="logo" 
                            className="w-8 h-8 object-contain" 
                        />
                    </motion.header>

                    <motion.div className="home-content" { ...headContainerAnimation }>
                        <motion.div { ...headTextAnimation } >
                            <h1 className="head-text">
                                LET'S <br className="xl:block hidden" /> DO IT.
                            </h1>
                        </motion.div>
                    </motion.div>
                    
                    <motion.div
                        className="flex flex-col gap-5"
                        { ...headContainerAnimation }
                    >
                        <p className="max-w-md font-normal text-gray-600 text-base">     
                            Crea tu camiseta única y exclusiva con nuestra nueva herramienta de personalización en 3D. 
                            <strong> Da rienda suelta a tu imaginación</strong> {" "} y define tu propio estilo.
                        </p>

                        <CustomButton 
                            type="filled"
                            title="Customize It"
                            handleClick={ ()=> state.intro = false }                 
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        />

                    </motion.div >

                </motion.section>

            )}
        </AnimatePresence>
    )
}