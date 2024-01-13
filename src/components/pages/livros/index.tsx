import { Icon } from '@iconify/react';
import Card from '../../layout/card';
import { useRef, useState } from 'react';
import './style.css';
import { Navigate } from 'react-router-dom';

export default function Livros() {
    const user: { data: { id: number; livro_id: number; token: string; } } = JSON.parse(localStorage.getItem('ashsdas') || 'null');
    const [search, setSearch] = useState(null)
    const inputRef: any = useRef(null)
    function submit() {
        setSearch(inputRef.current.value)
    }

    if (!user || !user.data.token) {
        Navigate({ to: '/' })
    }

    return (
        <div className="search-container w-full max-w-full max-h-screen overflow-y-auto">
            <form className="w-full flex justify-center items-center my-7">
                <button className='w-8 h-8'><Icon icon="gala:search" className='rotate-[270deg] text-2xl text-purple-400' /></button><input className="bg-transparent w-[43%] h-8 border-2 outline-purple-300 border-purple-300 rounded-3xl focus:bg-purple-200 focus:border-purple-600 focus:placeholder-white px-1 pl-2" ref={inputRef} onChange={submit} type="search" id="search" name="search" placeholder="Buscar por livros" />
            </form>
            <div className='flex flex-wrap justify-center gap-8 p-4'>
                <Card tipo='all' search={search} />
            </div>
        </div>
    )
}