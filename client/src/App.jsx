import { CanvasModel } from './canvas'
import { Customizer, Home } from './pages'



export const App = () => {
    return(

        <main className="app transition-all ease-in">
            <Home />
            <CanvasModel />
            <Customizer />
        </main>

    )
}
