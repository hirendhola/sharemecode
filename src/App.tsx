import "./App.css";
import Home from "./components/Home"; 
import TextEditor from "./components/TextEditor";
import { Routes, Route } from "react-router";

const App = () => {
  return (
    <div className="max-w-screen max-h-screen bg-[#222831] text-[#EEEEEE] overflow-x-auto overflow-y-auto custom-scrollbar">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<TextEditor />} />
      </Routes>
    </div>
  );
};

export default App;