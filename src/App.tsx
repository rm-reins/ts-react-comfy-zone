import {HomeLayout, Landing, Error, Register, Login, Products, SingleProduct, Cart, Checkout, Orders} from "./pages";
import { Button } from "./components/ui/button";
import {useAppSelector} from "./hooks";

function App() {
    const {name} = useAppSelector((state) => state.userState);

    return (
        <div>
            <h1 className="text-7xl font-bold">App</h1>
            <Button variant="destructive" size="lg" onClick={() => {
                console.log("clicked");
            }}>
                Click me
            </Button>
            <Cart />
        </div>
    )
}

export default App;