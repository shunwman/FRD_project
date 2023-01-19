import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { IRootState } from "../redux/store";
import NoMatch from "./NoMatch";

export default function RequireAuth() {
    const isLoggedIn = useSelector((state: IRootState) => state.user.isLoggedIn)
    return <div>
        <Outlet/>
    </div>
}