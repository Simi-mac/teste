import React from 'react';
import type { Expense, ExpenseCategory, Feeling } from '../types';
import AddExpense from './AddExpense';
import PieChart from './PieChart';

interface DiaryProps {
    expenses: Expense[];
    onAddExpense: (description: string, amount: number, category: ExpenseCategory, feeling: Feeling) => void;
}

const FEELING_STYLES: Record<Feeling, { color: string, icon: string }> = {
    'Essencial': { color: 'text-green-600', icon: '✅' },
    'Importante': { color: 'text-blue-600', icon: '🔹' },
    'Desejo': { color: 'text-orange-600', icon: '🛍️' },
    'Dava pra Evitar': { color: 'text-red-600', icon: '🤔' },
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Moradia': '#3b82f6', // blue-500
  'Transporte': '#ef4444', // red-500
  'Alimentação': '#22c55e', // green-500
  'Lazer': '#f97316', // orange-500
  'Saúde': '#a855f7', // purple-500
  'Outros': '#64748b', // slate-500
};

const FEELING_COLORS: Record<Feeling, string> = {
    'Essencial': '#16a34a', // green-600
    'Importante': '#2563eb', // blue-600
    'Desejo': '#ea580c', // orange-600
    'Dava pra Evitar': '#dc2626', // red-600
};

const Diary: React.FC<DiaryProps> = ({ expenses, onAddExpense }) => {
    const dataByCategory = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<ExpenseCategory, number>);

    const dataByFeeling = expenses.reduce((acc, expense) => {
        acc[expense.feeling] = (acc[expense.feeling] || 0) + expense.amount;
        return acc;
    }, {} as Record<Feeling, number>);

    return (
        <div className="space-y-8 animate-fade-in">
            <AddExpense onAddExpense={onAddExpense} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Resumo por Categoria</h2>
                    <PieChart data={dataByCategory} colors={CATEGORY_COLORS} />
                </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Resumo por Sentimento</h2>
                    <PieChart data={dataByFeeling} colors={FEELING_COLORS} />
                </div>
            </div>
            <div>
                 <h2 className="text-xl font-bold text-slate-800 mb-4">Histórico</h2>
                 <div className="space-y-2">
                    {expenses.length > 0 ? (
                        [...expenses].sort((a,b) => b.date.getTime() - a.date.getTime()).map(expense => {
                            const feelingStyle = FEELING_STYLES[expense.feeling] || { color: 'text-slate-500', icon: '?' };
                            return (
                                <div key={expense.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                                    <div>
                                        <p className="font-semibold text-slate-800">{expense.description}</p>
                                        <div className="flex items-center text-sm text-slate-500 gap-x-3 mt-1">
                                            <span>{expense.category}</span>
                                            <span className={`flex items-center gap-1 font-medium ${feelingStyle.color}`}>
                                                {feelingStyle.icon}
                                                <span>{expense.feeling}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-red-600 text-lg">
                                        - R$ {expense.amount.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-center text-slate-500 py-4">Nenhuma despesa registrada ainda.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default Diary;