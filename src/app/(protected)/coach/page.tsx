"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Sparkles, RefreshCcw, Loader2 } from "lucide-react";

type Message = {
  role: "ai" | "user";
  content: string;
  options?: string[];
  isTyping?: boolean;
};

// --- Base de Conhecimento do Coach ---
const KNOWLEDGE_BASE: Record<string, Record<string, string>> = {
  "Iniciante": {
    "Recepção": "Módulo 1: O Segredo da Recepção de Peito. \n\nPara iniciantes, a regra de ouro é: **Não pule antes da hora!**\n\n1. Dobre os joelhos e faça uma base sólida na areia.\n2. Leia o ombro do adversário para antecipar a bola.\n3. Deixe a bola bater no meio do peito, jogando o corpo levemente para cima e para frente.\n\nQuer que eu monte um drill (exercício) para treinar isso sozinho?",
    "Levantamento": "Módulo 1: Levantamento de Cabeça. \n\nO levantamento perfeito não precisa de força, mas sim de posicionamento.\n\n1. Entre sempre 'embaixo' da bola.\n2. Mantenha os olhos abertos e o pescoço firme.\n3. O contato deve ser na testa, amortecendo a bola e jogando na altura ideal para sua dupla.",
    "Ataque/Pingo": "Módulo 1: Ataque Seguro. \n\nAntes de tentar o Shark Attack, você precisa aprender a chapada simples e o pingo.\n\n1. Use a chapa do pé para ter controle e não força.\n2. Olhe a quadra adversária antes de bater.\n3. O pingo (curtinha) é a melhor arma do iniciante contra quem fica preso no fundo da quadra.",
    "Saque": "Módulo 1: Saque por Baixo. \n\nO saque mais seguro. \n\n1. Apoie o peso na perna de trás.\n2. Bata na bola com o peito do pé firme.\n3. Mire sempre no jogador adversário que tem a pior recepção ou no meio da quadra para gerar confusão."
  },
  "Amador (C/B)": {
    "Recepção": "Módulo Intermediário: Leitura de Jogo.\n\nVocê já sabe receber, agora precisamos evitar erros bobos.\n\n1. Comunicação é tudo: Grite 'MINHA' alto e claro.\n2. Se o saque adversário vier com muito spin (efeito), ataque a bola, não espere ela cair.\n3. Posicione-se sempre em diagonal ao sacador.",
    "Levantamento": "Módulo Intermediário: Levantamento de Ombro e Peito.\n\nVamos variar os levantamentos para confundir o bloqueio.\n\n1. No levantamento de ombro, feche o ângulo do corpo em direção à rede.\n2. Tente levantar a bola a um palmo da rede, nem tão colado, nem tão recuado.",
    "Ataque/Pingo": "Módulo Intermediário: Pingo Falso e Quebra de Ritmo.\n\n1. Arme o corpo como se fosse dar uma chapada forte no fundo.\n2. No último segundo, tire a força e dê um pingo curto logo atrás da rede.\n3. Exige leitura de onde o defensor adversário está posicionado.",
    "Saque": "Módulo Intermediário: Saque Jornada e Chapa.\n\n1. O Saque Jornada nas Estrelas (balão) usa o vento a seu favor e quebra o tempo de bola do adversário.\n2. Treine sacar buscando as linhas laterais (corredor)."
  },
  "Avançado (A/Pro)": {
    "Recepção": "Módulo Avançado: Defesa de Shark Attack.\n\nPara defender ataques fortes (Shark ou Bicicleta):\n\n1. Fique com o centro de gravidade baixíssimo.\n2. Afaste-se da rede, o tempo de reação é crucial.\n3. Use o peito ou o ombro de forma reativa, apenas para jogar a bola para cima.",
    "Levantamento": "Módulo Avançado: Levantamento de Sola/Calcanhar.\n\nSituações de emergência exigem recursos.\n\n1. Quando a recepção for muito ruim e a bola passar de você, use a sola do pé por trás do corpo.\n2. Requer muita flexibilidade e leitura espacial de onde sua dupla está.",
    "Ataque/Pingo": "Módulo Avançado: Shark Attack.\n\nO ataque mais mortal do futevôlei.\n\n1. O tempo de salto é vital: pule no momento exato em que a bola atinge o ponto mais alto do levantamento.\n2. O contato é feito com a sola/peito do pé, como uma cortada de vôlei, esmagando a bola para baixo.",
    "Saque": "Módulo Avançado: Saque Viagem (Ataque).\n\n1. Jogue a bola alta e para frente.\n2. Salte e ataque a bola no ar com força total em direção ao fundo da quadra.\n3. O objetivo é ace ou quebrar completamente a recepção."
  }
};

export default function CoachIAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [level, setLevel] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Passo 0: Iniciar conversa
  useEffect(() => {
    startConversation();
  }, []);

  const startConversation = () => {
    setLevel(null);
    setMessages([
      {
        role: "ai",
        content: "Fala, atleta! Sou o seu Treinador Virtual QuadraHub. Para eu montar seu treino hoje, preciso fazer um diagnóstico rápido.\n\n**Qual é o seu nível atual na areia?**",
        options: ["Iniciante", "Amador (C/B)", "Avançado (A/Pro)"]
      }
    ]);
  };

  const handleOptionClick = (option: string) => {
    // 1. Remove as opções da última mensagem da IA
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].options = undefined;
      }
      return newMessages;
    });

    // 2. Adiciona a mensagem do usuário
    setMessages(prev => [...prev, { role: "user", content: option }]);
    setIsTyping(true);

    // 3. Processa a lógica baseada no estado atual
    setTimeout(() => {
      if (!level) {
        // Acabou de responder o Nível -> Salva e pergunta o Fundamento
        setLevel(option);
        setMessages(prev => [
          ...prev,
          {
            role: "ai",
            content: `Boa, perfil **${option}** registrado! \n\nAgora me diz: qual fundamento está te dando mais dor de cabeça nos jogos ultimamente? O que você quer focar hoje?`,
            options: ["Recepção", "Levantamento", "Ataque/Pingo", "Saque"]
          }
        ]);
      } else {
        // Respondeu o Fundamento -> Entrega o Módulo de Treino
        const focus = option;
        const moduleContent = KNOWLEDGE_BASE[level]?.[focus] || "Módulo em desenvolvimento! Escolha outro fundamento.";
        
        setMessages(prev => [
          ...prev,
          {
            role: "ai",
            content: `Entendido. Preparando o seu treino focado em **${focus}**...\n\n---\n\n${moduleContent}`,
            options: ["Me dê um treino físico", "Como praticar sozinho?", "Escolher outro Módulo"]
          }
        ]);
      }
      setIsTyping(false);
    }, 1500);
  };

  const handleFollowUpClick = (option: string) => {
    if (option === "Escolher outro Módulo") {
      startConversation();
      return;
    }

    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1].options = undefined;
      return [...newMessages, { role: "user", content: option }];
    });
    
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          content: option === "Me dê um treino físico" 
            ? "Para aguentar o tranco na areia: \n- 4 séries de 15 saltos na areia fofa.\n- Tiros curtos de 10 metros (5 idas e vindas).\n- Fortalecimento de Core (Prancha 1 min x 3)."
            : "Para praticar sozinho (Paredão):\nEncontre um paredão plano. Fique a 3 metros de distância. Jogue a bola na parede e tente receber de peito ou chapa de forma contínua sem deixar cair. Faça séries de 50 toques.",
          options: ["Escolher outro Módulo"]
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleAnyOptionClick = (option: string) => {
    if (["Iniciante", "Amador (C/B)", "Avançado (A/Pro)", "Recepção", "Levantamento", "Ataque/Pingo", "Saque"].includes(option)) {
      handleOptionClick(option);
    } else {
      handleFollowUpClick(option);
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <Bot className="text-primary" size={32} /> Coach IA
          </h1>
          <p className="text-sm text-text-secondary font-medium mt-1">Seu treinador virtual focado em tática, técnica e fundamentos.</p>
        </div>
        <button 
          onClick={startConversation}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-colors border border-white/10 px-3 py-2 rounded-lg bg-[#0a0a0c]"
        >
          <RefreshCcw size={14} /> Reiniciar
        </button>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 rounded-xl border flex flex-col overflow-hidden bg-[#0a0a0c] shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ borderColor: "var(--color-border)" }}>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border shadow-lg ${
                  msg.role === "user"
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-primary/20 border-primary/40 text-primary shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                }`}
              >
                {msg.role === "user" ? <User size={20} /> : <Bot size={24} />}
              </div>

              {/* Bubble */}
              <div className="max-w-[85%] sm:max-w-[70%]">
                <div
                  className={`p-5 text-sm sm:text-base font-medium leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-white/5 border border-white/10 rounded-2xl rounded-tr-sm"
                      : "bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-sm text-white/90"
                  }`}
                >
                  {msg.content}
                </div>
                
                {/* Quick Reply Options */}
                {msg.options && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-start animate-fade-in">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnyOptionClick(opt)}
                        className="bg-[#101014] hover:bg-primary/20 hover:border-primary/50 text-white text-xs sm:text-sm font-bold border border-white/10 px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
                      >
                        <Sparkles size={14} className="text-primary group-hover:scale-110 transition-transform" /> {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border bg-primary/20 border-primary/40 text-primary shadow-lg">
                <Bot size={24} />
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-primary" />
                <span className="text-sm font-bold text-primary tracking-widest uppercase text-[10px]">Analisando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
