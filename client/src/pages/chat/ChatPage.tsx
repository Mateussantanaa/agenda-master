import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, BookOpen, Code, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'E aí, beleza? 👋 Sou o Teteu, e criei este cantinho especial pra te ajudar com programação! Passei anos estudando, trabalhando com código, e agora quero compartilhar tudo que aprendi contigo. Pode mandar qualquer dúvida sobre JavaScript, Python, React, algoritmos, carreira... Vamos nessa! 🚀',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "Como começar a programar do zero?",
    "Qual a diferença entre let, const e var?",
    "Como fazer uma API REST com Node.js?",
    "O que é algoritmo e por que é importante?",
    "Como usar React na prática?",
    "Dicas para conseguir o primeiro emprego"
  ];

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response with more detailed responses
    setTimeout(() => {
      const aiResponse = generateDetailedAIResponse(messageToSend);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 2000);
  };

  const generateDetailedAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('começar') || input.includes('iniciante') || input.includes('zero')) {
      return `Cara, que massa que você quer começar! 🎉 Vou te dar o roadmap que eu gostaria de ter tido:

**1. Comece com o básico:**
• HTML e CSS primeiro (estrutura e estilo)
• JavaScript depois (a lógica por trás)

**2. Pratique muito:**
• FreeCodeCamp é sensacional e gratuito
• Codepen para testar códigos rapidinho
• GitHub Pages para hospedar seus projetos

**3. Primeiro projeto:**
Faz uma página pessoal simples! Foi o que me deu confiança no início.

**4. Não tenha medo de errar:**
Bug faz parte, cara! Eu já quebrei a cabeça por horas com um ponto e vírgula perdido 😅

**Dica de ouro:** Programa todo dia, nem que seja 30 minutos. Consistência vale mais que maratonas!

Qual parte te deixa mais curioso pra começar?`;
    }
    
    if (input.includes('let') && input.includes('const') && input.includes('var')) {
      return `Opa! Essa é clássica, me lembro quando descobri isso! 😄

**VAR (o veterano):**
• Funciona em toda a função
• Pode ser redeclarado (perigoso!)
• Pode causar bugs estranhos

**LET (o moderno):**
• Funciona só no bloco onde foi criado
• Não pode ser redeclarado
• Pode mudar o valor depois

**CONST (o seguro):**
• Também funciona só no bloco
• Valor não pode mudar depois de criado
• Use sempre que possível!

**Exemplo que me salvou muito bug:**
\`\`\`javascript
// VAR - problemático
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Imprime 3, 3, 3 😵
}

// LET - funciona certinho
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Imprime 0, 1, 2 👍
}
\`\`\`

**Minha regra de ouro:** Sempre uso const, só mudo pra let quando preciso alterar o valor, e var... bem, não uso mais! 😅`;
    }
    
    if (input.includes('api rest') || input.includes('node.js') || input.includes('backend')) {
      return `Node.js é demais! 🔥 Foi quando descobri que podia usar JavaScript no backend que minha mente explodiu!

Vou te mostrar como fazer uma API simples que uso muito:

**1. Setup básico:**
\`\`\`bash
npm init -y
npm install express cors
\`\`\`

**2. Servidor básico (app.js):**
\`\`\`javascript
const express = require('express');
const app = express();

// Middleware pra aceitar JSON
app.use(express.json());

// Array simulando banco de dados
let usuarios = [
  { id: 1, nome: 'Teteu', email: 'teteu@dev.com' }
];

// GET - Buscar todos
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// POST - Criar novo
app.post('/usuarios', (req, res) => {
  const novoUsuario = {
    id: usuarios.length + 1,
    ...req.body
  };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

app.listen(3000, () => {
  console.log('API rodando na porta 3000! 🚀');
});
\`\`\`

**Dicas que aprendi na prática:**
• Sempre use códigos de status HTTP corretos
• Valide os dados que chegam
• Use middleware para coisas repetitivas

Quer que eu explique alguma parte específica?`;
    }
    
    if (input.includes('algoritmo') || input.includes('lógica')) {
      return `Algoritmos são o coração da programação! 💓 No início achava chato, mas depois entendi que é tipo uma receita de bolo:

**O que é algoritmo?**
É uma sequência de passos para resolver um problema. Tipo:
1. Pegar os ingredientes
2. Misturar na ordem certa
3. Assar por X minutos
4. Pronto, bolo feito!

**Exemplo prático - buscar um nome:**
\`\`\`javascript
function buscarNome(lista, nomeProcurado) {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i] === nomeProcurado) {
      return i; // Achou!
    }
  }
  return -1; // Não achou
}
\`\`\`

**Por que é importante?**
• Te ensina a quebrar problemas grandes em pedaços pequenos
• Melhora sua lógica de programação
• Te prepara para entrevistas técnicas

**Dica que mudou minha vida:**
Antes de programar, escrevo o algoritmo em português. Tipo:
1. Receber uma lista de números
2. Para cada número, verificar se é par
3. Se for par, adicionar numa nova lista
4. Retornar a nova lista

Aí depois traduzo pro código! Funciona muito bem.`;
    }
    
    if (input.includes('react')) {
      return `React é vida! ⚛️ Cara, quando aprendi React foi um divisor de águas na minha carreira.

**Por que React é massa:**
• Componentes reutilizáveis (escreve uma vez, usa em vários lugares)
• Virtual DOM (super rápido)
• Ecossistema gigante
• Mercado de trabalho aquecido

**Exemplo básico:**
\`\`\`javascript
import React, { useState } from 'react';

function Contador() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Você clicou {count} vezes</p>
      <button onClick={() => setCount(count + 1)}>
        Clique aqui
      </button>
    </div>
  );
}
\`\`\`

**Hooks mais usados:**
• useState - para guardar dados que mudam
• useEffect - para fazer coisas quando o componente aparece/some
• useContext - para compartilhar dados entre componentes

O segredo é começar pequeno e ir evoluindo. Quer que eu explique algum hook específico?`;
    }
    
    if (input.includes('carreira') || input.includes('emprego') || input.includes('trabalho')) {
      return `O mercado tá muito bom, cara! 📈 Vou te dar umas dicas que funcionaram comigo:

**1. Portfolio no GitHub:**
• Pelo menos 3-5 projetos bem feitos
• README explicando o que faz e como rodar
• Código limpo e comentado

**2. Projetos que impressionam:**
• Todo app com banco de dados
• API REST completa
• Site responsivo
• Algo que resolva um problema real

**3. LinkedIn otimizado:**
• Foto profissional
• Resumo contando sua história
• Poste sobre o que tá aprendendo

**4. Prepare-se para entrevistas:**
• Estude algoritmos básicos
• Saiba explicar seus projetos
• Pratique coding challenges

**5. Networking:**
• Participe de grupos de dev
• Vá em meetups e eventos
• Seja ativo na comunidade

**Dica extra:** Começar como júnior/estagiário é normal! Foque em mostrar vontade de aprender. Qual área te interessa mais: frontend, backend ou fullstack?`;
    }
    
    if (input.includes('css') || input.includes('estilo')) {
      return `CSS é arte! 🎨 No começo era meu pesadelo, hoje é uma das partes que mais gosto.

**Conceitos que mudaram minha vida:**

**1. Flexbox:**
\`\`\`css
.container {
  display: flex;
  justify-content: center; /* centraliza horizontal */
  align-items: center; /* centraliza vertical */
}
\`\`\`

**2. Grid:**
\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 1fr 3fr; /* sidebar + conteúdo */
  gap: 20px;
}
\`\`\`

**3. Responsividade:**
\`\`\`css
/* Mobile first */
.card {
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .card {
    width: 50%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    width: 33.33%;
  }
}
\`\`\`

**Dicas de ouro:**
• Use box-sizing: border-box sempre
• Aprenda bem flexbox e grid
• Mobile first é vida
• DevTools do browser são seus amigos

O que tá te dando mais dor de cabeça no CSS?`;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Bot className="h-8 w-8 mr-3 text-primary" />
          Teteu Bot Assistente
        </h1>
        <p className="text-muted-foreground mt-2">
          Tire suas dúvidas sobre programação, algoritmos, linguagens e frameworks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="text-lg">Chat com IA</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-80">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start space-x-3",
                      message.isUser ? "flex-row-reverse space-x-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.isUser ? "bg-primary" : "bg-muted"
                    )}>
                      {message.isUser ? (
                        <User className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap",
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
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
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
                    placeholder="Digite sua dúvida sobre programação..."
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={() => handleSendMessage()} 
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Sugestões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-left h-auto p-2 justify-start whitespace-normal"
                  onClick={() => handleSendMessage(question)}
                  disabled={isLoading}
                >
                  <span className="text-xs">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Tópicos Populares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="font-medium">Frontend:</div>
                <div className="text-muted-foreground">React, Vue, Angular, CSS, HTML</div>
                
                <div className="font-medium mt-3">Backend:</div>
                <div className="text-muted-foreground">Node.js, Python, APIs REST</div>
                
                <div className="font-medium mt-3">Algoritmos:</div>
                <div className="text-muted-foreground">Ordenação, Busca, Big O</div>
                
                <div className="font-medium mt-3">Conceitos:</div>
                <div className="text-muted-foreground">Git, Debugging, Clean Code</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}