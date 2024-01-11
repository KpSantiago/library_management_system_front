import './style.css';

export default function Loading({ bg, size }: { bg: string; size: string }) {
    return (
        <div className={`fixed top-0 left-0 z-10 ${bg} h-${size} w-${size} grid place-items-center`}>
            <div className="load rounded-full"></div>
        </div>
    )
}