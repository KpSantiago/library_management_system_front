export default interface ILivros {
    id: number;
    nome: string;
    tipo: string;
    data_emissao: string;
    data_devolucao_estimada: string;
    data_devolucao: string;
    esta_disponivel: string;
    dias_para_devolucao: number;
    autor: { nome: string; }[];
    sinopse: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}