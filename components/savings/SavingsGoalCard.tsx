'use client';

import { useState } from 'react';
import { SavingsGoal } from '@/lib/types';
import { Trash2, Shield, Plane, Laptop, Hammer, PiggyBank, Plus } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';

const iconMap: Record<string, React.ElementType> = {
  Shield, Plane, Laptop, Hammer, PiggyBank,
};

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

export default function SavingsGoalCard({ goal }: SavingsGoalCardProps) {
  const { deleteSavingsGoal, updateSavingsGoal } = useFinance();
  const [addAmount, setAddAmount] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const isComplete = goal.currentAmount >= goal.targetAmount;
  const deadline = new Date(goal.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const Icon = iconMap[goal.icon] || PiggyBank;

  const handleAdd = async () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      try {
        await updateSavingsGoal(goal.id, amount);
        setAddAmount('');
        setShowAdd(false);
      } catch (error) {
        console.error('Error updating savings goal:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}18` }}
          >
            <Icon size={20} style={{ color: goal.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{goal.name}</p>
            <p className="text-xs text-slate-400">
              {isComplete ? 'Goal achieved!' : daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
            </p>
          </div>
        </div>
        <button
          onClick={async () => {
            try {
              await deleteSavingsGoal(goal.id);
            } catch (error) {
              console.error('Error deleting savings goal:', error);
            }
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>

      <div className="mb-3">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xl font-bold text-slate-900">${goal.currentAmount.toLocaleString()}</span>
            <span className="text-sm text-slate-400 ml-1">/ ${goal.targetAmount.toLocaleString()}</span>
          </div>
          <span className="text-sm font-bold" style={{ color: goal.color }}>{percentage}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%`, backgroundColor: goal.color }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {isComplete ? 'Completed' : `$${remaining.toLocaleString()} to go`}
        </span>
        <span className="text-xs text-slate-400">
          by {deadline.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </div>

      {!isComplete && (
        <div className="mt-4 pt-4 border-t border-slate-50">
          {showAdd ? (
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Amount to add"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button
                onClick={handleAdd}
                className="px-3 py-2 rounded-lg text-sm font-bold text-white transition-all"
                style={{ backgroundColor: goal.color }}
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: goal.color }}
            >
              <Plus size={14} />
              Add funds
            </button>
          )}
        </div>
      )}
    </div>
  );
}
