import { Suspense } from "react";
import LoginRegister from "../../layout/login-register";
import './style.css';
import Loading from "../../layout/loading";

export default function Register() {
    return (
        <Suspense fallback={<Loading bg='#010101' size='screen'/>}>
            <div className="container bg-white min-w-full max-w-screen h-screen max-h-screen grid place-items-center">
                <LoginRegister />
            </div>
        </Suspense>

    )
}