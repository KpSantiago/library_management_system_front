import './style.css';

export default function Loading({ bg }: { bg: string }) {
    return (
        <div className={`fixed top-0 left-0 z-10 ${bg} h-screen w-screen grid place-items-center`}>
            <div className="load rounded-full"></div>
        </div>
    )
}