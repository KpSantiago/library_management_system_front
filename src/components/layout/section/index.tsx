export default function Section({ tipo, children }: { tipo: string; children: any }) {
    return (
        <div className="max-w-full min-h-[200px] py-3 ml-8 mb-8">
            <h2 className="mb-4 text-2xl">Livros {tipo}</h2>
            <div className="w-full h-fit py-3 flex gap-4 overflow-x-auto">
                {children}
            </div>
        </div>
    )
}