import { Outlet } from "react-router-dom";

function PrivateLayout() {
  return (
    <div className="min-h-screen bg-[#FEF2E1]">
      <Outlet />
    </div>
  );
}

export default PrivateLayout;