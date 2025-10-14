import { Table2 } from 'lucide-react';

export function Placeholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 h-full">
      <div className="text-center text-gray-500">
        <Table2 className="mx-auto h-16 w-16 mb-4 text-[#1777af]/50" />
        <h2 className="text-2xl font-semibold">Nenhuma tabela selecionada</h2>
        <p className="mt-2 text-gray-600">Selecione uma tabela no menu ao lado para começar a visualizar os dados.</p>
      </div>
    </div>
  );
}