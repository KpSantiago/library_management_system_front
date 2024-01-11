import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from '@iconify/react';

import './style.css'

export default function Header() {
    const user: { data: { id: number } } = JSON.parse(localStorage.getItem('ashsdas') || 'null');
    const [classNameLi, setClassNameLi] = useState(false);
    const [menuState, setMenuState] = useState(false);
    const [aluno, setAluno] = useState({} as { id: number; nome: string; email: string })

    let headerRef: any = useRef(null);

    useEffect(() => {
        async function getAlunos() {
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/alunos/${user.data.id}`);

            return res;
        }

        getAlunos().then(d => d.json()).then(d => setAluno(d.data[0])).catch(e => console.log(e))
    }, [])
    function openMenu() {
        let header = headerRef.current as HTMLElement
        header.classList.toggle('actived')
        if (!classNameLi && !menuState) {
            setTimeout(() => {
                setClassNameLi(!classNameLi);
                setMenuState(!menuState);
            }, 160)
        } else {
            setClassNameLi(!classNameLi);
            setMenuState(!menuState);
        }
    }

    return (
        <header ref={headerRef} className='sidebar bg-slate-100 min-w-[50px] w-12 max-w-[230px] h-screen max-h-screen flex flex-col items-center justify-between py-6 rounded-tr-md rounded-br-md'>
            <ul className='w-full flex flex-col gap-4 px-2'>
                <li onClick={openMenu} className={`mh w-full flex items-center mb-2 py-2`}>
                    <div className={`${menuState ? 'w-[20%]' : 'w-full'} flex flex-col gap-1 items-center`}>
                        <p className={menuState ? 'w-[30px]' : 'w-[6px]'}></p>
                        <p className={menuState ? 'w-[30px]' : 'w-[6px]'}></p>
                        <p className={menuState ? 'w-[30px]' : 'w-[6px]'}></p>
                    </div>
                    <span className={`${!classNameLi ? 'hidden' : 'block'} w-full text-2xl text-center `}>BIBLIOTECH</span>
                </li>
                <li className="w-[100%] max-h-8 flex"><Icon icon='iconamoon:profile-fill' className="text-3xl" /><span className={`${!classNameLi ? 'hidden' : 'block'} whitespace-nowrap`}>{aluno.nome}</span></li>
                <li><NavLink to="home" className="w-[100%] max-h-8 flex"><Icon icon='gravity-ui:house' className="text-3xl" /><span className={!classNameLi ? 'hidden' : 'block'}>Home</span></NavLink></li>
                <li><NavLink to="livros" className="w-[100%] max-h-8 flex"><Icon icon='gravity-ui:book' className="text-3xl" /><span className={!classNameLi ? 'hidden' : 'block'} >Livros</span></NavLink></li>
            </ul>
            <ul className="logout">
                <li onClick={() => { localStorage.removeItem('ashsdas'); localStorage.removeItem('interesses') }}><NavLink to='/' className="flex items-center"><Icon icon="ion:log-out-outline" className="rotate-180 text-3xl" /><span className={!classNameLi ? 'hidden' : 'block'} >Sair</span></NavLink></li>
            </ul>
        </header>
    )
}