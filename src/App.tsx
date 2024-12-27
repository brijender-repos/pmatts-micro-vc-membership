import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ManageLayout } from "@/components/layouts/ManageLayout";
import Users from "@/pages/manage/Users";
import ManageUserDetails from "@/pages/manage/ManageUserDetails";
import Investments from "@/pages/manage/Investments";
import Home from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ManageIndex from "@/pages/manage/Index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="manage" element={<ManageLayout />}>
          <Route path="" element={<ManageIndex />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:userId" element={<ManageUserDetails />} />
          <Route path="investments" element={<Investments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;