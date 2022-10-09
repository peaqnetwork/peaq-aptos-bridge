import { useState } from "react";
import "./app.css";
import { BridgeForm } from "./components/BridgeForm";
import { Spinner } from "./components/Spinner";

function App() {
    const [showSpinner, setShowSpinner] = useState(false)
    return (
        <div className="bridge__page">
            <BridgeForm setShowSpinner={setShowSpinner} />
            {showSpinner && <Spinner />}
        </div>
    );
}

export default App;
