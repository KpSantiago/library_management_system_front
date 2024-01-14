import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

import './style.css';
import Loading from '../loading';

const { REACT_APP_API_URL } = process.env;

export default function LoginRegister() {
    const user: { data: { token: string; livro_id: string; id: string } } = JSON.parse(localStorage.getItem('ashsdas') || 'null');
    const navigate = useNavigate();
    const [nome, setNome] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [error, setError] = useState<string | null>(null)
    const [emailLg, setEmailLg] = useState('')
    const [senhaLg, setSenhaLg] = useState('')
    const [tipo, setTipo] = useState<string>('cadastro');

    const form1: any = useRef(null);
    const form2: any = useRef(null);
    async function cadastrar() {
        setLoad(true);
        const body = {
            nome,
            email,
            senha
        }

        await fetch(`${REACT_APP_API_URL}auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(body)
        }).then(d => d.json()).then(d => {
            if (!d.error) {
                form1.current.classList.add('move');
                form2.current.classList.add('move');
                setLoad(false);
                setTipo('login');
            } else {
                setError(d.message)
            }
        }).catch(e => console.log(e)).finally(() => { setTimeout(() => { setError(null) }, 3500) }).finally(() => { setEmail(''); setSenha(''); setNome(''); setLoad(false) });
    }

    if (user.data.token) {
        navigate('/home')
    }

    async function entrar() {
        const body = {
            email: emailLg,
            senha: senhaLg
        }
        setLoad(true);

        await fetch(`${REACT_APP_API_URL}auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(body)
        }).then(d => d.json()).then(d => {
            setLoad(false);
            if (!d.error) {
                localStorage.setItem('ashsdas', JSON.stringify(d));
                navigate('/home')
            } else {
                setError(d.message)
            }
            ;
        }).catch(e => console.log(e)).finally(() => { setLoad(false); setSenhaLg(''); setEmailLg(''); setTimeout(() => { setError(null) }, 3500); });
    }

    return (
        <div className='form-container bg-transparent backdrop-blur-[4px] min-w-[250px] w-[30%] min-h-[60%] h-fit max-h-fit flex flex-col items-center rounded-2xl py-4 overflow-x-hidden'>
            {load &&
                <Loading size='full' bg='bg-[#0004]' />
            }
            <h1 className='text-white font-semibold text-2xl w-full text-center mb-6'>Fazer {tipo}</h1>
            {error && <p className='bg-[#f002] text-red-600 font-semibold w-[90%] p-1 rounded-lg border-[1px] border-solid border-red-500 mb-4'>{error}</p>}
            <div className='flex'>
                <form ref={form1} className={'form1 min-w-full flex flex-col items-center gap-12 px-4'}>
                    <label htmlFor='nome'>
                        <Icon icon="fluent:person-48-regular" className='text-2xl text-white' /><input type="text" id='nome' placeholder='Digite o seu nome' onChange={(e) => setNome(e.target.value)} value={nome ? nome : ''} />
                    </label>
                    <label htmlFor='email'>
                        <Icon icon="ic:outline-email" className='text-2xl text-white' /><input type="email" id='email' placeholder='Digite o seu email' onChange={(e) => setEmail(e.target.value)} value={email ? email : ''} />
                    </label>
                    <label htmlFor='senha'>
                        <Icon icon="carbon:password" className='text-2xl text-white' /><input type="password" id='senha' placeholder='Digite a sua senha' onChange={(e) => setSenha(e.target.value)} value={senha ? senha : ''} />
                    </label>
                    <div className='w-[75%]'>
                        <button className='bg-transparent w-full h-8 rounded-lg hover:bg-[#fff1] duration-200' onClick={(e) => {
                            e.preventDefault();
                            cadastrar();
                        }}>Cadastrar</button>
                        <p className='text-white text-sm underline cursor-pointer hover:text-slate-100 duration-200' onClick={() => {
                            form1.current.classList.add('move');
                            form2.current.classList.add('move');
                            setTipo('login');
                        }}>Entrar na conta</p>
                    </div>
                </form>
                <form ref={form2} className={'form2 min-w-full flex flex-col items-center gap-12 px-4'}>
                    <label htmlFor='email'>
                        <Icon icon="ic:outline-email" className='text-2xl text-white' /><input type="email" id='email' placeholder='Digite o seu email' onChange={(e) => setEmailLg(e.target.value)} value={emailLg ? emailLg : ''} />
                    </label>
                    <label htmlFor='senha'>
                        <Icon icon="carbon:password" className='text-2xl text-white' /><input type="password" id='senha' placeholder='Digite a sua senha' onChange={(e) => setSenhaLg(e.target.value)} value={senhaLg ? senhaLg : ''} />
                    </label>
                    <div className='w-[75%]'>
                        <button className='bg-transparent w-full h-8 rounded-lg hover:bg-[#fff1] duration-200' onClick={(e) => {
                            e.preventDefault();
                            entrar();
                        }}>Entrar</button>
                        <p className='text-white text-sm underline cursor-pointer hover:text-slate-100 duration-200' onClick={() => {
                            form1.current.classList.toggle('move');
                            form2.current.classList.toggle('move');
                            setTipo('cadastro');
                        }}>Cadastrar conta</p>
                    </div>
                </form>
            </div>
        </div>
    )
}