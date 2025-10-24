import React, { useState } from 'react';
import type { ExpenseCategory, Feeling } from '../types';

interface AddExpenseProps {
  onAddExpense: (description: string, amount: number, category: ExpenseCategory, feeling: Feeling) => void;
}

const CATEGORIES: ExpenseCategory[] = ['Moradia', 'Transporte', 'Alimentação', 'Lazer', 'Saúde', 'Outros'];

const FEELINGS: { name: Feeling; color: string; icon: string }[] = [
    { name: 'Essencial', color: 'bg-green-100 text-green-800 border-green-300', icon: '✅' },
    { name: 'Importante', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🔹' },
    { name: 'Desejo', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '🛍️' },
    { name: 'Dava pra Evitar', color: 'bg-red-100 text-red-800 border-red-300', icon: '🤔' },
];

const AddExpense: React.FC<AddExpenseProps> = ({ onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Alimentação');
  const [feeling, setFeeling] = useState<Feeling>('Importante');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }
    onAddExpense(description, numericAmount, category, feeling);
    setDescription('');
    setAmount('');
    setCategory('Alimentação');
    setFeeling('Importante');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Adicionar ao Diário Financeiro</h3>
      
      {/* Description and Amount */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Almoço no restaurante"
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          required
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="25,50"
            step="0.01"
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white h-[42px]"
            required
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      
      {/* Feeling Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Como você se sente sobre este gasto?</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {FEELINGS.map(f => (
                <button
                    type="button"
                    key={f.name}
                    onClick={() => setFeeling(f.name)}
                    className={`flex items-center justify-center p-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                        feeling === f.name 
                        ? `${f.color} ring-2 ring-offset-1 ring-blue-500`
                        : 'bg-white border-slate-300 hover:bg-slate-100'
                    }`}
                >
                    <span className="mr-2">{f.icon}</span>
                    {f.name}
                </button>
            ))}
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400"
        disabled={!description.trim() || !amount}
      >
        Salvar Gasto
      </button>
    </form>
  );
};

export default AddExpense;