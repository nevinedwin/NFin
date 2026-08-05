
import { getBudgets } from '@/actions/budget';
import BudgetPage from '@/components/budget/budgetPage';

const Budget = async () => {
  const budgets = await getBudgets();

  return (
    <div>
      <BudgetPage budgets={budgets} />
    </div>
  );
};

export default Budget;