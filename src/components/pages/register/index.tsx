import { Suspense } from "react";
import LoginRegister from "../../layout/login-register";
import './style.css';
import Loading from "../../layout/loading";
import { Navigate } from "react-router-dom";

export default function Register() {
    const user: { data: { token: string; livro_id: string; id: string } } = JSON.parse(localStorage.getItem('ashsdas') || 'null');
    if (user && user.data.token) {
        Navigate({ to: '/home' })
    }
    return (
        <Suspense fallback={<Loading bg='#010101' size='screen' />}>
            <div className="container bg-white min-w-full max-w-screen h-screen max-h-screen grid place-items-center">
                <LoginRegister />
            </div>
        </Suspense>

    )
}