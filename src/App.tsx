import "./App.css";
import Redirect from "./components/Redirect";
import TextEditor from "./components/TextEditor";
import { Routes, Route } from "react-router";

const App = () => {
  return (
    <div className="min-w-screen min-h-screen bg-[#222831] text-[#EEEEEE] overflow-x-auto overflow-y-hidden">
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/:id" element={<TextEditor />} />
      </Routes>
    </div>
  );
};

export default App;
