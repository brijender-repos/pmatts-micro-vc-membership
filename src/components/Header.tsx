import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            PMatts
          </Link>
          <div className="flex gap-4">
            <Link to="/projects">Projects</Link>
            <Link to="/portfolio">Portfolio</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}