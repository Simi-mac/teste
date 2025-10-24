import React, { useState } from 'react';
import AccordionItem from './AccordionItem';
import type { Assessment } from '../types';

interface QuestionnaireProps {
    onComplete: (assessment: Assessment, name: string, goal: string) => void;
}

const questions = {
    habits: [
        { id: 'track_expenses', text: 'Você acompanha seus ganhos e gastos mensais?', options: ['Sempre', 'Às vezes', 'Nunca'], points: [2, 1, 0], feedback: 'Acompanhar seus ganhos e gastos é o primeiro passo para ter controle sobre seu dinheiro.' },
        { id: 'budget', text: 'Você possui um orçamento mensal?', options: ['Sim', 'Não'], points: [2, 0], feedback: 'Criar um orçamento ajuda a garantir que seu dinheiro está indo para onde você mais precisa.' },
        { id: 'savings', text: 'Você consegue guardar uma parte do seu dinheiro todo mês?', options: ['Sim, consistentemente', 'Sim, mas nem sempre', 'Não'], points: [2, 1, 0], feedback: 'Desenvolver o hábito de poupar é crucial para alcançar metas e ter segurança.' },
    ],
    consumption: [
        { id: 'impulse', text: 'Com que frequência você faz compras por impulso?', options: ['Raramente/Nunca', 'Ocasionalmente', 'Frequentemente'], points: [2, 1, 0], feedback: 'Controlar compras por impulso libera mais dinheiro para seus objetivos.' },
        { id: 'compare_prices', text: 'Você costuma pesquisar preços antes de uma compra importante?', options: ['Sempre', 'Às vezes', 'Nunca'], points: [2, 1, 0], feedback: 'Pesquisar preços pode gerar uma economia significativa a longo prazo.' },
        { id: 'credit_card', text: 'Você possui dívidas no cartão de crédito?', options: ['Não', 'Sim, mas estou pagando', 'Sim, e está aumentando'], points: [2, 1, 0], feedback: 'Entender e quitar dívidas de juros altos, como as do cartão, é uma prioridade.' },
    ],
    financial_life: [
        { id: 'emergency_fund', text: 'Você tem uma reserva de emergência (equivalente a 3-6 meses de seus custos)?', options: ['Sim, completa', 'Tenho um pouco guardado', 'Não tenho'], points: [2, 1, 0], feedback: 'A reserva de emergência te protege de imprevistos sem precisar se endividar.' },
        { id: 'investments', text: 'Você investe seu dinheiro?', options: ['Sim, regularmente', 'Tenho alguns investimentos', 'Não'], points: [2, 1, 0], feedback: 'Investir é o que fará seu dinheiro trabalhar para você e crescer ao longo do tempo.' },
    ],
};

const allQuestions = [...questions.habits, ...questions.consumption, ...questions.financial_life];
const MAX_SCORE = allQuestions.reduce((sum, q) => sum + Math.max(...q.points), 0);

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>('habits');
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [linkGenerated, setLinkGenerated] = useState(false);
    const [mailtoLink, setMailtoLink] = useState('');
    const [finalAssessment, setFinalAssessment] = useState<Assessment | null>(null);
    const [finalGoal, setFinalGoal] = useState('');

    const handleToggle = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prevAnswers => {
            const newAnswers = { ...prevAnswers, [questionId]: value };

            // Auto-accordion logic
            const sectionKeys = Object.keys(questions) as Array<keyof typeof questions>;
            let answeredSection: keyof typeof questions | null = null;
            for (const key of sectionKeys) {
                if (questions[key].some(q => q.id === questionId)) {
                    answeredSection = key;
                    break;
                }
            }
            
            if (answeredSection) {
                const sectionQuestions = questions[answeredSection];
                const allAnswered = sectionQuestions.every(q => newAnswers[q.id]);

                if (allAnswered) {
                    const currentIndex = sectionKeys.indexOf(answeredSection);
                    const nextSectionKey = sectionKeys[currentIndex + 1] || null;
                    
                    setTimeout(() => {
                        setOpenAccordion(nextSectionKey);
                    }, 300); // Small delay for UX
                }
            }
            
            return newAnswers;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let score = 0;
        const feedback: string[] = [];

        for(const q of allQuestions) {
            const answer = answers[q.id];
            if(answer) {
                const answerIndex = q.options.indexOf(answer);
                if (answerIndex !== -1) {
                    const points = q.points[answerIndex];
                    score += points;
                    if (points < Math.max(...q.points)) {
                        feedback.push(q.feedback);
                    }
                }
            } else {
                 feedback.push(q.feedback);
            }
        }
        
        const goal = answers['final_goal'] || 'Não especificado';
        const assessmentResult: Assessment = { score: (score / MAX_SCORE) * 100, feedback };
        
        setFinalAssessment(assessmentResult);
        setFinalGoal(goal);

        const emailBodyParts = [];
        emailBodyParts.push("Respostas do Questionário de Diagnóstico Financeiro:\n");
        
        allQuestions.forEach(q => {
            const answer = answers[q.id] || "Não respondido";
            emailBodyParts.push(`${q.text}: ${answer}`);
        });

        emailBodyParts.push(`${"Qual é a sua principal meta financeira ou maior dificuldade hoje?"}: ${goal}`);
        emailBodyParts.push(`\nE-mail informado: ${email}`);
        
        const body = encodeURIComponent(emailBodyParts.join('\n'));
        const subject = encodeURIComponent("Minhas Respostas - Diagnóstico Financeiro EducaFin");
        const recipient = email;
        const generatedMailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
        
        setMailtoLink(generatedMailtoLink);
        setLinkGenerated(true);
    };

    const isFormComplete = allQuestions.every(q => !!answers[q.id]) && !!answers.final_goal?.trim() && !!name.trim() && !!email.trim();

    const renderQuestion = (q: typeof allQuestions[0]) => (
        <div key={q.id} className="mb-6">
            <p className="block text-slate-800 mb-3 font-medium">{q.text}</p>
            <div className="space-y-3">
                {q.options.map((opt: string) => (
                    <label key={opt} htmlFor={`${q.id}-${opt}`} className="group flex items-center cursor-pointer p-3 rounded-lg transition-colors duration-150 border border-slate-200 bg-white hover:bg-slate-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                        <input 
                            type="radio" 
                            id={`${q.id}-${opt}`} 
                            name={q.id} 
                            value={opt} 
                            checked={answers[q.id] === opt}
                            onChange={e => handleAnswerChange(q.id, e.target.value)} 
                            required 
                            className="sr-only"
                        />
                        <div className="w-5 h-5 mr-3 border-2 border-slate-300 rounded-sm flex-shrink-0 flex items-center justify-center transition-colors group-hover:border-slate-400 group-has-[:checked]:bg-blue-600 group-has-[:checked]:border-blue-600">
                             <svg className="w-4 h-4 text-white fill-current opacity-0 group-has-[:checked]:opacity-100 transition-opacity" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289Z" fill="currentColor"/>
                             </svg>
                        </div>
                        <span className="font-medium text-slate-700">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <p className="text-slate-700 mb-6">Para começar, preciso entender um pouco sobre sua vida financeira. Por favor, responda às perguntas abaixo. Suas respostas nos ajudarão a traçar o melhor caminho para você!</p>
             <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <label htmlFor="name" className="block text-slate-800 mb-2 font-medium">Qual é o seu nome?</label>
                <input 
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    placeholder="Digite seu nome"
                    required
                />
            </div>
             <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <label htmlFor="email" className="block text-slate-800 mb-2 font-medium">Para receber seu diagnóstico completo por e-mail, por favor, informe seu melhor endereço de e-mail.</label>
                <input 
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    placeholder="seu.email@exemplo.com"
                    required
                />
            </div>
            <AccordionItem title="1. Hábitos Financeiros" isOpen={openAccordion === 'habits'} onToggle={() => handleToggle('habits')}>
                {questions.habits.map(renderQuestion)}
            </AccordionItem>
            <AccordionItem title="2. Consumo" isOpen={openAccordion === 'consumption'} onToggle={() => handleToggle('consumption')}>
                 {questions.consumption.map(renderQuestion)}
            </AccordionItem>
            <AccordionItem title="3. Vida Financeira e Metas" isOpen={openAccordion === 'financial_life'} onToggle={() => handleToggle('financial_life')}>
                 {questions.financial_life.map(renderQuestion)}
                 <div className="mt-6">
                    <label htmlFor="final_goal" className="block text-slate-800 mb-2 font-medium">Qual é a sua principal meta financeira ou maior dificuldade hoje?</label>
                    <textarea 
                        id="final_goal" 
                        name="final_goal" 
                        rows={3} 
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1 bg-white"
                        placeholder="Ex: Comprar uma casa, quitar dívidas, aprender a investir..."
                        onChange={e => handleAnswerChange('final_goal', e.target.value)}
                        required
                    />
                </div>
            </AccordionItem>

            {linkGenerated ? (
                <div className="mt-6 text-center p-4 bg-blue-50 border-t-4 border-blue-300 rounded-b-lg">
                    <h3 className="font-bold text-lg text-blue-800">Passo Final!</h3>
                    <p className="text-blue-700 my-2">Para salvar uma cópia das suas respostas, clique no botão abaixo. Isso abrirá seu aplicativo de e-mail para que você possa enviar o questionário para si mesmo. Depois, volte aqui e clique em "Ver meu diagnóstico" para continuar.</p>
                    <a 
                        href={mailtoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block my-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
                    >
                        Salvar minhas respostas por e-mail
                    </a>
                    <button
                        type="button"
                        onClick={() => {
                            if (finalAssessment) {
                                onComplete(finalAssessment, name, finalGoal);
                            }
                        }}
                        className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Ver meu diagnóstico →
                    </button>
                </div>
            ) : (
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    disabled={!isFormComplete}
                    >
                    Enviar Respostas e Iniciar Minha Jornada
                </button>
            )}
        </form>
    );
};

export default Questionnaire;