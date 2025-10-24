import React from 'react';
import type { Assessment } from '../types';

interface ResultsProps {
    assessment: Assessment;
    onProceed: () => void;
}

const scoreLevels = [
    { 
        min: 0, max: 20, 
        colorName: 'Vermelho', 
        icon: '❌', 
        message: 'Sua saúde financeira precisa de atenção. Vamos começar pelos hábitos de consumo.', 
        actionText: 'Revisar Gastos', 
        shortFeedback: 'Atenção aos detalhes!', 
        colorClasses: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300' } 
    },
    { 
        min: 21, max: 35, 
        colorName: 'Laranja', 
        icon: '⚙️', 
        message: 'Você está no caminho, mas há pontos importantes a equilibrar.', 
        actionText: 'Ajustar Orçamento', 
        shortFeedback: 'Em construção!', 
        colorClasses: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300' } 
    },
    { 
        min: 36, max: 45, 
        colorName: 'Amarelo', 
        icon: '🌱', 
        message: 'Seus hábitos estão melhorando. Vamos fortalecer seu controle e foco em metas.', 
        actionText: 'Criar Metas SMART', 
        shortFeedback: 'Você está evoluindo!', 
        colorClasses: { text: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-300' } 
    },
    { 
        min: 46, max: 100, 
        colorName: 'Verde', 
        icon: '💚', 
        message: 'Excelente! Sua base é sólida. Agora é hora de investir e crescer.', 
        actionText: 'Continuar', 
        shortFeedback: 'Excelente base!', 
        colorClasses: { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300' } 
    },
];


const Results: React.FC<ResultsProps> = ({ assessment, onProceed }) => {
    const score = Math.round(assessment.score);
    const level = scoreLevels.find(l => score >= l.min && score <= l.max) || scoreLevels[0];
    const insights = assessment.feedback.slice(0, 3);

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 text-center animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Seu Diagnóstico Financeiro</h2>
            
            <div className={`p-6 rounded-xl shadow-md border-2 max-w-md mx-auto my-8 text-center ${level.colorClasses.bg} ${level.colorClasses.border}`}>
                <div className={`flex items-center justify-center gap-2 text-lg font-bold ${level.colorClasses.text}`}>
                    <span className="text-3xl">{level.icon}</span>
                    <span>{level.colorName}</span>
                </div>
                <div className="my-3">
                    <span className="text-7xl font-extrabold text-slate-800">{score}%</span>
                    <p className="text-xl font-semibold text-slate-700 mt-2">{level.shortFeedback}</p>
                </div>
                <p className="text-slate-600">{level.message}</p>
            </div>


            <div className="text-left my-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Principais Insights para Você:</h3>
                <ul className="space-y-3">
                    {insights.map((insight, index) => (
                        <li key={index} className="flex items-start p-3 bg-slate-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-slate-700">{insight}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onProceed}
                className="w-full max-w-sm mx-auto bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
            >
                {level.actionText} →
            </button>
            
            <div className="mt-10 max-w-2xl mx-auto border-t border-slate-200 pt-8">
                <div className="bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 text-left">
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-emerald-900">Seu Próximo Passo: Um Guia Prático</h3>
                        <p className="text-emerald-800 mt-2">
                            Transforme sua relação com o dinheiro através de hábitos simples e sustentáveis. Este guia foi criado especialmente para quem está dando os primeiros passos rumo ao controle financeiro.
                        </p>
                        <a
                            href="https://drive.google.com/drive/folders/1JXXMNuoni1erGE-pLw9JIP2qD69XfwgZ?usp=drive_link"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
                        >
                            Baixar Guia em PDF
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;