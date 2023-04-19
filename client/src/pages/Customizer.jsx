import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useSnapshot } from "valtio"

import { state } from '../store'
import { download } from '../assets'

import { 
    config,
    DecalTypes,
    downloadCanvasToImage,
    EditorTabs,
    fadeAnimation,
    FilterTabs,
    reader,
    slideAnimation
} from '../config'

import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from "../components"


export const Customizer = () => {
    const snap = useSnapshot( state )

    /* STATE  */
    //trigger which are we changing ( color, file, IA )
    const [activeEditorTab, setActiveEditorTab] = useState("")
    //file picker
    const [file, setFile] = useState('')
    //AI PROMP
    const [prompt, setPrompt] = useState('')
    //Generate image or not
    const [generatingImg, setGeneratingImg] = useState(false)
    // Trigger whether we are showing the logo or full texture
    const [activeFilterTab, setActiveFilterTab] = useState({ logoShirt: true, stylishShirt: false })
    



    /* FilterPicker */
    //Show the logo, texture or both - changing the state */
    const handleActiveFilter = ( tabName ) =>{
        switch ( tabName ) {
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[ tabName ] // isLogoTexture = false
                break;
            
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[ tabName ] //isFullTexture = true
                break;
        
            default:
                state.isLogoTexture = true
                state.isFullTexture = false
                break;
        }

        //after setting the state, set the activeFilterTab - toggle on and off the logo
        setActiveFilterTab(( prevState ) =>{
            return {
                ...prevState,
                [ tabName ]: !prevState[ tabName ]
            }
        })

    }

    //see what is the type of the decal ( logo, full )
    const handleDecals = ( type, result ) =>{
        const decalType = DecalTypes[ type ]

        state[ decalType.stateProperty ] = result

        if( !activeFilterTab( decalType.filterTab ) ){
            handleActiveFilter( decalType.filterTab )
        }

    }

    //see the type of the file
    const readFile = ( type ) =>{
        reader( file )
            .then( ( result ) => {
                handleDecals( type, result )

                setActiveEditorTab("")
            })
    }

    
    /*AIPicker*/

    const handleSubmit = async( type ) =>{
        if( !prompt ) return alert("Please enter a prompt")

        
        try {
            //call backend to generate an AI image
            setGeneratingImg( true )

            const options = { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ prompt }) 
            }
            const resp = await fetch('http://localhost:8080/api/v1/dalle', options)

            const data = await resp.json()
            console.log({ data })

            handleDecals(type, `data:image/png;base64,${ data.photo }` )

        } catch (error) {
            console.log({ error })
            // alert( error )

        } finally{
            setGeneratingImg( false )
            setActiveFilterTab("")
        }

    }

    //ACTIVATE TABS 
    const generateTabContent = () =>{
        switch ( activeEditorTab ) {
            case "colorpicker":
                return <ColorPicker />

            case "filepicker":
                return <FilePicker 
                    file={ file } 
                    setFile={ setFile } 
                    readFile = { readFile }
                />

            case "aipicker":
                return <AIPicker 
                    prompt={ prompt }
                    setPrompt={ setPrompt }
                    generatingImg={ generatingImg }
                    handleSubmit={ handleSubmit }
                />
                
            default:
                return null;
        }
    }


    return (
        <AnimatePresence>
            { !snap.intro && (
                <>
                    {/* tabs */}
                    <motion.div
                        key="custom"
                        className="absolute top-0 left-0 z-10"
                        { ...slideAnimation('left') }
                    >
                        <div className="flex items-center min-h-screen">

                            {/* tab en la izquierda */}
                            <div className="editortabs-container tabs">
                                { EditorTabs.map(( tab )=>(
                                    <Tab 
                                        key={ tab.name }
                                        tab={ tab }
                                        handleClick={()=> setActiveEditorTab( tab.name ) }
                                    />
                                )) }

                                {/* generate the tab content */}
                                { generateTabContent() }

                            </div> 
                        </div>
                    </motion.div> 
                    
                    {/* back button */}
                    <motion.div
                        className="absolute z-10 top-5 right-5"
                        { ...fadeAnimation }
                    >
                        <CustomButton 
                            type="filled"
                            title="Go Back"
                            handleClick={ ()=> state.intro = true }
                            customStyle="w-fit px-4 py-2.5 font-bold text-sm"
                        />
                    </motion.div>
                    
                    {/* tab abajo */}
                    <motion.div 
                        className="filtertabs-container"
                        { ...slideAnimation('up') }
                    >
                        { FilterTabs.map(( tab )=>(
                            <Tab 
                                key={ tab.name }
                                tab={ tab }
                                isFilterTab
                                isActiveTab={ activeFilterTab[ tab.name ] }
                                handleClick={()=> handleActiveFilter( tab.name ) }
                            />
                        )) }
                        {/* Download button */}
                        <button className='download-btn' onClick={downloadCanvasToImage}>
                            <img
                            src={download}
                            alt='download_image'
                            className='w-3/5 h-3/5 object-contain'
                        />
                        </button>
                    </motion.div> 
                    
                </>
            )}
        </AnimatePresence>
    )
}
