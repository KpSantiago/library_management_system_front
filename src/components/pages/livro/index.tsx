import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import './style.css';
import ILivros from '../../../interfaces/iLivros';
import Loading from '../../layout/loading';

const { REACT_APP_API_URL } = process.env;

const date = new Date();
let dia = date.getDate();
let mes = date.getMonth() + 1;
let ano = date.getFullYear();

export default function Livro() {
    const [load, setLoad] = useState<boolean>(false);
    const user: { data: { id: number; livro_id: number; token: string; } } = JSON.parse(localStorage.getItem('ashsdas') || 'null');
    const livro_id = useParams();
    const livroSalvo = JSON.parse(localStorage.getItem('livro') || 'null')
    const [livro, setLivro] = useState({} as ILivros);
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        async function getLivro() {
            const res = await fetch(`${REACT_APP_API_URL}api/livros/${Number(livro_id.id)}`);

            return res;
        }

            getLivro().then(d => { setLoad(true); return d.json() }).then(d => { setLivro(d.data[0]); localStorage.setItem('livro', JSON.stringify(livro)) }).catch(e => console.log(e)).finally(() => setLoad(false));
    }, []);

    if (!user || !user.data.token) {
        Navigate({ to: '/' })
    }

    async function adquirir() {
        setLoad(true);
        dia += livro.dias_para_devolucao;

        if (dia > 30 && dia < 60) {
            dia -= 30;
            mes += 1;
        }
        if (dia > 60) {
            dia -= 60;
            mes += 2;
        }
        if (mes > 12) {
            mes = 1;
            ano += 1;
        }
        const aluno_body = {
            livro_id: Number(livro_id.id),
            updated_at: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
        }
        const livro_body = {
            esta_disponivel: false,
            data_emissao: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
            data_devolucao_estimada: `${mes}-${dia}-${ano}`,
            data_devolucao: null,
            updated_at: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
        }

        await fetch(`${REACT_APP_API_URL}api/bookPurchased/${Number(livro_id.id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(livro_body)
        }).then(d => { return d.json(); }).then(d => { }).catch(e => console.log(e)).finally(() => {
            dia = date.getDate();
            mes = date.getMonth() + 1;
            ano = date.getFullYear();

        });

        await fetch(`${REACT_APP_API_URL}api/purchase/${Number(user.data.id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(aluno_body)
        }).then(d => { return d.json(); }).then(d => {
            if (!d.error) {
                setMsg(d.message);
            }
        }).catch(e => console.log(e))
        localStorage.setItem('ashsdas', JSON.stringify({ data: { id: user.data.id, livro_id: livro_id.id, token: user.data.token } }))
        setLoad(false)
        window.location.reload();

    }

    async function devolucao() {
        setLoad(true);
        const aluno_body = {
            livro_id: null,
            updated_at: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
        }
        const livro_body = {
            esta_disponivel: true,
            data_devolucao: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
            updated_at: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
        }

        await fetch(`${REACT_APP_API_URL}api/bookPurchased/${Number(livro_id.id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(livro_body)
        }).then(d => { return d.json(); }).then(d => console.log(d)).catch(e => console.log(e)).finally(() => {
            dia = date.getDate();
            mes = date.getMonth() + 1;
            ano = date.getFullYear();
        });

        await fetch(`${REACT_APP_API_URL}api/purchase/${Number(user.data.id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(aluno_body)
        }).then(d => { return d.json(); }).then(d => localStorage.setItem('livro', JSON.stringify(d.data))).catch(e => console.log(e))
        localStorage.setItem('ashsdas', JSON.stringify({ data: { id: user.data.id, livro_id: null, token: user.data.token } }))
        setLoad(false)
        window.location.reload();
    }

    switch (livro.tipo) {
        case 'sm':
            livro.tipo = 'Curto'
            break
        case 'md':
            livro.tipo = 'Médio'
            break
        case 'lg':
            livro.tipo = 'Longo'
            break
    }

    return (
        <div className='book-container w-screen max-w-screen h-screen max-h-screen grid place-items-center overflow-y-auto relative'>
            {msg &&
                <div className='w-full flex justify-center fixed top-0 z-20 pt-4'>
                    <p className='bg-[#0F06] text-white text-2xl font-semibold w-[50%] h-12  grid place-items-center border-[1px] border-green-600 rounded-2xl p-2'>{msg}</p>
                </div>}
            {load &&
                <Loading size='screen' bg='bg-[#000a]' />
            }

            <div className='w-[90%] h-[90%] flex flex-wrap items-center justify-center gap-8'>
                {livro.image ? <img className='img min-w-[200px] w-[20%] h-[65%] max-h-[350px] rounded-2xl' src={`${REACT_APP_API_URL}api/image/${livro.image}`} /> : <div className='bg-slate-400 min-w-[200px] w-[20%] h-[65%] rounded-2xl'></div>}
                <div className='infos h-[65%]'>
                    <h1 className='text-3xl font-semibold mb-5'>{livro.nome}</h1>
                    <div className='flex flex-wrap gap-7'>
                        <p className='font-semibold text-[#000a]'>Data de emissão: <span className='text-purple-600'>{livro.data_emissao ? new Date(livro.data_emissao).toLocaleDateString() : '-'}</span></p>
                        <p className='font-semibold text-[#000a]'>Data de devolução: <span className='text-purple-600'>{livro.data_devolucao ? new Date(livro.data_devolucao).toLocaleDateString() : '-'}</span></p>
                        <p className='font-semibold text-[#000a]'>Data de devolução estimada: <span className='text-purple-600'>{livro.data_devolucao_estimada ? new Date(livro.data_devolucao_estimada).toLocaleDateString() : '-'}</span></p>
                    </div>
                    <p className='w-full h-fit break-words text-justify'>{livro.sinopse ? livro.sinopse : 'Esta obra não possui sinopse ainda.'}</p>
                    <p><span className='font-semibold'>Está disponível: </span> {livro.esta_disponivel ? 'sim' : 'não'}</p>
                    <p><span className='font-semibold'>Tipo do livro: </span> {livro.tipo}</p>
                    <div className='flex flex-wrap gap-4'>
                        <button className='bg-green-600 text-white text-xl font-semibold min-w-44 h-12 rounded-lg my-5 hover:bg-green-800 duration-300 disabled:bg-slate-600 px-3' onClick={adquirir} disabled={user.data.livro_id || !livro.esta_disponivel ? true : false}>{user.data.livro_id || !livro.esta_disponivel ? `${user.data.livro_id == livro.id ? 'Adquirido!' : 'Não é possivel adquirir'}` : 'Adquirir'}</button>
                        {Number(livro_id.id) == user.data.livro_id ? <button className='bg-purple-600 text-white text-xl font-semibold min-w-44 h-12 rounded-lg my-5 hover:bg-purple-800 duration-300 px-3' onClick={devolucao}>Devolver</button> : ''}
                        <button className='bg-[#fa5] text-white text-xl font-semibold min-w-44 h-12 rounded-lg my-5 hover:bg-[#fa5d] duration-300 disabled:bg-slate-600 px-3' onClick={() => {
                            let l = [];
                            l.push(livro);
                            if (!localStorage.getItem('interesses')) {
                                localStorage.setItem('interesses', JSON.stringify(l))
                            } else {
                                let ls = JSON.parse(localStorage.getItem('interesses')!);
                                l.push(...ls)
                                localStorage.setItem('interesses', JSON.stringify(l))
                            }

                            window.location.reload()
                        }} disabled={localStorage.getItem('interesses') && (JSON.parse(localStorage.getItem('interesses')!).find((l: any) => l.id == livro_id.id) || JSON.parse(localStorage.getItem('interesses')!).length >= 2) ? true : false}>{localStorage.getItem('interesses') && JSON.parse(localStorage.getItem('interesses')!).find((l: any) => l.id == livro_id.id) ? 'Adicionado aos interesses' : 'Tenho interesse'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}