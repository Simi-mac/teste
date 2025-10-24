import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `Você é um educador financeiro amigável e experiente. 
Seu objetivo é explicar conceitos financeiros complexos de uma forma simples, clara e encorajadora para iniciantes no Brasil.
Evite jargões e use analogias do dia a dia. Suas respostas devem ser práticas, acionáveis e adaptadas à realidade brasileira (mencionando, por exemplo, Real (BRL), Selic, Tesouro Direto, etc., quando relevante).
Sempre formate suas respostas usando markdown para melhor legibilidade, usando títulos, listas e negrito quando apropriado.`;

export const getFinancialAdvice = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
};

export const generateOnboarding = async (score: number, userName: string, userGoal: string): Promise<{welcomeMessage: string, trackSteps: {title: string, description: string}[]}> => {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }

    const prompt = `
      Gere um objeto JSON para a jornada de onboarding de um usuário de educação financeira.
      Dados do usuário:
      - Nome: ${userName}
      - Pontuação do Diagnóstico: ${score.toFixed(0)}%
      - Meta/Dificuldade Principal: ${userGoal}

      Use as regras abaixo para o conteúdo:

      **Se a pontuação for de 0 a 50 (Trilha 1: Fundamentos):**
      - "welcomeMessage": Deve dar as boas-vindas ao usuário pelo nome, parabenizá-lo por completar o diagnóstico e tratar a pontuação como "um ótimo ponto de partida". Apresente a "Jornada de Fundamentos e Criação de Hábitos", focando em clareza e controle. Mencione que a dificuldade citada (${userGoal}) é comum e será abordada. Dê a primeira missão: "Sua primeira missão, que vai durar esta semana, é simplesmente **anotar todos os seus gastos**. O objetivo é apenas clareza.". Termine com encorajamento.
      - "trackSteps": Liste 4 passos lógicos para esta trilha. Use títulos como: 1. Clareza Total, 2. Orçamento Inteligente, 3. Construindo sua Segurança (Reserva), 4. Plano de Ação contra Dívidas.

      **Se a pontuação for de 51 a 100 (Trilha 2: Otimização):**
      - "welcomeMessage": Deve dar as boas-vindas ao usuário pelo nome e parabenizá-lo pelo bom resultado, mostrando que ele está pronto para o próximo nível. Apresente a "Jornada de Otimização e Alcance de Metas", focando em transformar organização em ação para atingir a meta de ${userGoal}. Dê a primeira missão: "Sua primeira missão é transformar seu sonho em um plano usando a metodologia **SMART**: **Específica**, **Mensurável**, **Atingível**, **Relevante** e **Temporal**.". Termine dizendo que o próximo passo será sobre ferramentas de investimento.
      - "trackSteps": Liste 4 passos lógicos para esta trilha. Use títulos como: 1. Sua Meta SMART, 2. Otimização do Orçamento, 3. Descobrindo seu Perfil de Investidor, 4. Montando sua Carteira de Investimentos.

      O tom deve ser sempre amigável e motivador. O "welcomeMessage" deve ser formatado em markdown.
    `;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            welcomeMessage: { type: Type.STRING },
            trackSteps: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["title", "description"]
                }
            }
        },
        required: ["welcomeMessage", "trackSteps"]
    };

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });
        
        // The response text is a JSON string, so we parse it.
        return JSON.parse(response.text);

    } catch (error) {
        console.error("Gemini API call failed for onboarding:", error);
        throw new Error("Failed to get a response from the AI model for the onboarding message.");
    }
};
