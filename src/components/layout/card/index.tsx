import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ILivros from '../../../interfaces/iLivros';
import IData from '../../../interfaces/iData';

import './style.css';
import Loading from '../loading';

const { REACT_APP_API_URL } = process.env;

export default function Card({ tipo, search = null }: { tipo: string; search: string | null }) {
    const [card, setCard] = useState<IData<ILivros[]>>();
    const [load, setLoad] = useState<boolean>(false);
    useEffect(() => {
        async function items() {
            setLoad(true)
            const res = await fetch(`${REACT_APP_API_URL}api/livros`);

            return res
        }

        items().then(d => d.json()).then(r => { setCard(r); localStorage.setItem('livros', JSON.stringify(r)) }).catch(err => console.log(err)).finally(()=> setLoad(false));
    }, [])



    return (
        <>
            {load && tipo == 'all' ?
                <Loading bg='bg-[#000a]' size='screen'/> : ''
            }
            {card ?
                card.data &&
                card.data.filter(i => {
                    if (i.id < 8) {

                    }
                    if (tipo != 'all') {
                        return i.tipo == tipo
                    } else if (search) {
                        return i.nome.toLowerCase().includes(search.toLowerCase())
                    } else {
                        return i
                    }
                }).map((d, i) => {
                    return (
                        <div className='card min-w-[200px] w-52 min-h-44 h-72 pt-5' key={i++}>
                            {d.image ? <img src={`${REACT_APP_API_URL}api/image/${d.image}`} className='w-full h-[60%] object-contain rounded-[10px]' /> : <div className='bg-[#999] w-full h-[45%] rounded-[10px]'></div>}
                            <div className='infos min-w-full h-[40%] flex flex-col justify-between p-2'>
                                <p className='line-clamp-2 text-ellipsis'>{d.nome}</p>
                                <NavLink to={`/livro/${d.id}`} className={`bg-purple-600 text-white text-sm grid place-items-center self-center min-w-[60%] h-8 px-4 mb-2 font-semibold rounded-md hover:bg-purple-800 duration-200`}>VER MAIS</NavLink>
                            </div>
                        </div>
                    );
                }) : <div>Não há nada</div>
            }
        </>
    )
}