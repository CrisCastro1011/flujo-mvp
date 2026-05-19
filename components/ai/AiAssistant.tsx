'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/context/FinanceContext';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { transactions, budgets, savingsGoals } = useFinance();

  // Construir contexto financiero del usuario
  const buildContext = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Top categorías de gasto
    const expensesByCategory: Record<string, number> = {};
    monthlyTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const topCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, amount]) => `${cat}: $${amount.toFixed(2)}`)
      .join(', ');

    const activeBudgets = budgets.filter(b => b.isActive);
    const budgetSummary = activeBudgets.map(b =>
      `${b.name}: gastado $${b.totalSpent.toFixed(2)} de $${b.maxSpendingLimit.toFixed(2)} (${b.status})`
    ).join('; ');

    const savingsSummary = savingsGoals.map(g =>
      `${g.name}: $${g.currentAmount.toFixed(2)} de $${g.targetAmount.toFixed(2)}`
    ).join('; ');

    return `Mes actual (${now.toLocaleString('es', { month: 'long', year: 'numeric' })}):
- Ingresos: $${totalIncome.toFixed(2)}
- Gastos: $${totalExpenses.toFixed(2)}
- Balance: $${balance.toFixed(2)}
- Top categorías de gasto: ${topCategories || 'Sin datos'}
- Presupuestos activos: ${budgetSummary || 'Ninguno'}
- Metas de ahorro: ${savingsSummary || 'Ninguna'}
- Total de transacciones este mes: ${monthlyTransactions.length}`;
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: {
      context: buildContext(),
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: '¡Hola! 👋 Soy Flujo, tu asistente financiero. Puedo analizar tus gastos, ayudarte con tus presupuestos y darte consejos personalizados. ¿En qué te puedo ayudar hoy?',
        },
      ]);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg flex items-center justify-center transition-all duration-200 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Abrir asistente"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Panel del chat */}
      <div
        className={`fixed bottom-0 right-0 z-50 flex flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out
          md:bottom-6 md:right-6 md:rounded-2xl md:w-[380px] md:h-[560px]
          w-full h-[90vh] rounded-t-2xl
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full md:translate-y-8 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white md:rounded-t-2xl rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Flujo AI</p>
              <p className="text-xs text-blue-100">Asistente financiero</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-3 py-2">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sugerencias rápidas */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
            {['¿En qué gasté más?', '¿Cómo van mis ahorros?', 'Dame un consejo'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  handleInputChange({ target: { value: suggestion } } as any);
                  setTimeout(() => {
                    const form = document.getElementById('chat-form') as HTMLFormElement;
                    form?.requestSubmit();
                  }, 50);
                }}
                className="text-xs whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          id="chat-form"
          onSubmit={onSubmit}
          className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 flex-shrink-0"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Pregúntame algo..."
            className="flex-1 text-sm bg-slate-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ios-input-fix"
            style={{ fontSize: '16px' }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
