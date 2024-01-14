import { useEffect, useState } from 'react'
import Card from '../../layout/card'
import Section from '../../layout/section'
import './style.css'
import ILivros from '../../../interfaces/iLivros'
import { NavLink, Navigate } from 'react-router-dom'

const { REACT_APP_API_URL } = process.env;

export default function Home() {
    const [livro, setLivro] = useState({} as ILivros | null)
    const user: { data: { id: number; livro_id: number; token: string; } } = JSON.parse(localStorage.getItem('ashsdas') || 'null');

    useEffect(() => {
        async function getLivro() {
            const res = await fetch(`${REACT_APP_API_URL}api/livros/${Number(user.data.livro_id)}`);

            return res;
        }

        if (user.data.livro_id) {
            getLivro().then(d => d.json()).then(d => setLivro(d.data[0])).catch(e => console.log(e));
        } else {
            setLivro(null)
        }
    }, [])

    if (livro) {
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
    }

    if (!user || !user.data.token) {
        Navigate({ to: '/' })
    }

    return (
        <div className="book-container w-full max-w-full max-h-screen overflow-y-auto">
            <div className="w-full max-w-full h-fit flex justify-start gap-6 px-8 my-8 overflow-x-auto">
                <NavLink to={`/livro/${livro && livro.id}`} className="bg-[#44cd7644] min-w-[350px] w-[30%] h-[200px] border-2 border-green-400 rounded-xl grid place-items-center">
                    {livro ?
                        <div>
                            <h2 className='text-lg'>Você está lendo: <strong>{livro.nome}</strong>!</h2>
                            {livro.autor && <p><span className='font-semibold'>Autor(es):</span> {
                                livro.autor.map((a, i) => <span key={i}><span>{a.nome}</span>{i + 1 < livro.autor.length && <span></span>}</span>)
                            }</p>}
                            <p><span className='font-semibold'>Devolver:</span> {new Date(livro.data_devolucao_estimada).toLocaleDateString()}</p>
                            <p><span className='font-semibold'>Tipo do livro:</span> {livro.tipo}</p>
                        </div> : <NavLink to='/livros' className="h-full w-full grid place-items-center">Você ainda não está lendo! adquira aqui.</NavLink>}</NavLink>
                {localStorage.getItem('interesses') && JSON.parse(localStorage.getItem('interesses')!).length > 0 ?
                    JSON.parse(localStorage.getItem('interesses')!).map((l: any, i: number) => {
                        let livro_id = l.id

                        return (
                            <div className="bg-[#b685e544] min-w-[350px] w-[33%] h-[200px] border-2 border-purple-400 rounded-xl grid place-items-center" key={i + 1}>
                                <div>
                                    <h2 className='text-lg whitespace-nowrap text-ellipsis'>Interesse em: <strong>{l.nome}</strong>!</h2>
                                    {l.autor && <p><span className='font-semibold'>Autor(es):</span> {
                                        l.autor.map((a: any, i: number) => <span key={i}><span>{a.nome}</span>{i + 1 < l.autor.length && <span></span>}</span>)
                                    }</p>}
                                    <p><span className='font-semibold whitespace-nowrap text-ellipsis'>Tipo do livro:</span> {l.tipo}</p>
                                    <button className='bg-purple-600 w-[80%] mr-2 min-h-8 text-white font-semibold text-lg rounded-md hover:bg-purple-800 duration-200 mt-2' onClick={() => {
                                        let l = JSON.parse(localStorage.getItem('interesses')!).filter((f: any) => f.id != livro_id);
                                        localStorage.setItem('interesses', JSON.stringify(l))
                                        window.location.reload()
                                    }}>Excluir da lista</button>
                                    <button className='bg-purple-600 min-w-[80%] min-h-8 px-py-1 text-white font-semibold text-lg rounded-md hover:bg-purple-800 duration-200 mt-2'><NavLink to={`/livro/${l.id}`} className='block'>Ir para o livro</NavLink></button>
                                </div>
                            </div>
                        )
                    })
                    : <div className="bg-[#b685e544] min-w-[250px] w-[33%] h-[200px] border-2 border-purple-400 rounded-xl grid place-items-center"><NavLink to='/livros' className="h-full w-[90%] grid place-items-center text-center">Você ainda não tem interesse em nenhum livro em! clique aqui.</NavLink></div>}
            </div>
            <Section tipo='curtos'>
                <Card tipo="sm" search={null} />
            </Section>
            <Section tipo='médios'>
                <Card tipo="md" search={null} />
            </Section>
            <Section tipo='longos'>
                <Card tipo="lg" search={null} />
            </Section>
        </div>
    )
}