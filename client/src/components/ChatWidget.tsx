import * as React from 'react';
import { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Eai, beleza? 👋 Sou o Teteu, seu assistente pessoal de programação! Criei esse cantinho aqui pra te ajudar com qualquer dúvida sobre código. Pode mandar ver com JavaScript, Python, React, algoritmos... tô aqui pra isso mesmo! Em que posso te dar uma força hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('javascript') || input.includes('js')) {
      return 'Opa! JavaScript é minha paixão! 😄 É uma linguagem que mudou minha vida, sério. Posso te ajudar com closures, promises, async/await, manipulação do DOM, ou frameworks como React e Vue. Tenho umas dicas massa pra te passar! Qual parte específica você quer dominar?';
    }
    
    if (input.includes('react')) {
      return 'React é vida! ⚛️ Cara, quando aprendi React foi um divisor de águas na minha carreira. Hooks são incríveis (useState, useEffect, useContext), componentes funcionais são o futuro... Posso te explicar desde o básico até Context API e patterns avançados. Qual sua dúvida específica?';
    }
    
    if (input.includes('python')) {
      return 'Python foi a primeira linguagem que me fez entender que programar pode ser divertido! 🐍 É perfeita pra quem tá começando. Posso te ajudar com sintaxe, estruturas de dados (listas, dicionários), POO, ou frameworks como Django e Flask. Qual o seu nível atual?';
    }
    
    if (input.includes('algoritmo') || input.includes('algorithm')) {
      return 'Algoritmos são a base de tudo! 🧠 No começo achava chato, mas depois vi como eles são fundamentais. Posso explicar ordenação, busca, estruturas de dados, Big O... sempre com exemplos práticos que uso no dia a dia. Quer começar por onde?';
    }
    
    if (input.includes('css') || input.includes('estilo')) {
      return 'CSS é arte! 🎨 Já passei horas debuggando um padding que não queria funcionar haha. Flexbox e Grid salvaram minha vida! Posso te ajudar com layouts, animações, responsividade... ou frameworks como Tailwind que uso aqui no projeto. O que tá te travando?';
    }
    
    if (input.includes('node') || input.includes('backend')) {
      return 'Node.js mudou o jogo pra mim! 🚀 JavaScript no backend é sensacional. Uso muito Express, APIs REST, JWT... Inclusive esse sistema que você tá usando foi feito com Node! Posso te ensinar desde o básico até deploy. Qual parte te interessa?';
    }
    
    if (input.includes('git') || input.includes('github')) {
      return 'Git é essencial, mano! 🔄 No início eu tinha medo de dar merge, agora é automático. Posso te ensinar os comandos básicos, branching, como resolver conflitos... Tenho umas dicas que aprendi na prática e que podem te salvar! Quer começar pelo básico?';
    }
    
    if (input.includes('projeto') || input.includes('ideia')) {
      return 'Projetos são a melhor forma de aprender! 💡 Esse sistema aqui mesmo foi um projeto pessoal que virou algo útil. Que tal um todo app, calculadora, blog, ou uma API? Posso te dar ideias e te guiar na implementação. Qual seu nível atual?';
    }
    
    if (input.includes('carreira') || input.includes('mercado') || input.includes('trabalho')) {
      return 'Cara, o mercado tá muito bom! 📈 Frontend, backend, mobile... tem vaga pra todo lado. Posso te dar dicas sobre portfolio (GitHub é essencial!), LinkedIn, como se preparar pra entrevistas... Passei por isso tudo e sei como é. Em que posso te ajudar?';
    }
    
    if (input.includes('erro') || input.includes('bug') || input.includes('debug')) {
      return 'Bug faz parte da vida! 🐛😅 Já passei madrugadas debuggando. Umas dicas: console.log é seu amigo, leia a mensagem de erro com calma, DevTools do navegador é incrível... Quer que eu te ajude com algum erro específico?';
    }
    
    if (input.includes('estudar') || input.includes('aprender') || input.includes('começar')) {
      return 'Estudar programação é uma jornada incrível! 🚀 Algumas dicas que funcionaram comigo: pratique todo dia (nem que seja 30min), faça projetos reais, use freeCodeCamp, MDN... E principalmente: não desista nos momentos difíceis! Qual linguagem quer focar?';
    }

    if (input.includes('obrigado') || input.includes('valeu') || input.includes('brigado')) {
      return 'Ô, imagina! 😊 Tô aqui pra isso mesmo, cara! Qualquer dúvida que surgir, pode mandar que vou te ajudar com o maior prazer. Programação é uma jornada e é massa ter companhia nela!';
    }
    
    // Respostas gerais com personalidade brasileira
    const responses = [
      'Eita, pergunta interessante! 🤔 Fala mais detalhes que eu te ajudo direitinho!',
      'Boa pergunta, mano! 👍 Deixa eu te explicar de um jeito simples e prático.',
      'Show! Adoro essas dúvidas. 😄 Vou quebrar isso em partes menores pra ficar mais fácil.',
      'Perfeito! Esse é um tópico importante mesmo. 💪 Deixa eu te dar uma explicação massa.',
      'Olha só que legal! 🔥 É exatamente esse tipo de coisa que todo dev precisa saber.',
      'Cara, essa pergunta me lembrou quando eu estava começando! 😅 Vou te explicar do jeito que gostaria que tivessem me explicado.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-96 shadow-2xl z-50 transition-all duration-300",
      isMinimized ? "h-16" : "h-96"
    )}>
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary text-primary-foreground">
        <CardTitle className="text-sm font-medium">🤖 Teteu Bot Assistente</CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-primary-foreground hover:bg-primary/20 h-8 w-8 p-0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary/20 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg text-sm",
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Manda sua dúvida aí, parceiro!"
                className="text-sm"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                disabled={!inputMessage.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}