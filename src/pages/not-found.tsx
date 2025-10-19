import { Link } from "react-router-dom";
export default function NotFound(){
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="opacity-80">Page not found.</p>
      <Link to="/" className="underline">Back to dashboard</Link>
    </div>
  );
}
