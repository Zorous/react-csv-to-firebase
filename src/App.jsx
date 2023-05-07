import {Routes, Route} from "react-router-dom";
import DataParser from "./DataParser";

function App() {

  return (
<Routes>
<Route index element={<DataParser />} />
</Routes>
  )
}

export default App
