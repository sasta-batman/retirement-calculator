export interface RetirementInputs {
  current_age: number;
  retirement_age: number;
  current_savings: number;
  monthly_contribution: number;
  annual_return: number;
  inflation_rate: number;
  contribution_increase_rate: number;
  current_yearly_spending: number;
  tax_rate: number;
}

export interface ProjectionPoint {
  Year: number;
  "Net Worth": number;
}

/**
 * Ported from calculate_retirement in backend/main.py
 * Provides the high-level summary results
 */
export function calculateSummary(data: RetirementInputs) {
  let { retirement_age } = data;
  if (retirement_age < data.current_age) retirement_age = data.current_age;

  const years = retirement_age - data.current_age;
  const months = years * 12;
  const monthly_rate = data.annual_return / 100 / 12;

  // 1. Future Value of Current Savings
  const fv_lump_sum = data.current_savings * Math.pow(1 + monthly_rate, months);

  // 2. Future Value of Contributions
  let current_monthly_contribution = data.monthly_contribution;
  let fv_contributions = 0.0;

  for (let m = 1; m <= months; m++) {
    fv_contributions += current_monthly_contribution;
    fv_contributions *= (1 + monthly_rate);
    if (m % 12 === 0) {
      current_monthly_contribution *= (1 + data.contribution_increase_rate / 100);
    }
  }

  const total_savings = fv_lump_sum + fv_contributions;
  const real_total_savings = total_savings / Math.pow(1 + data.inflation_rate / 100, years);
  const monthly_income_in_retirement = (total_savings * 0.04) / 12;
  const after_tax_monthly_income = monthly_income_in_retirement * (1 - data.tax_rate / 100);
  const future_yearly_spending = data.current_yearly_spending * Math.pow(1 + data.inflation_rate / 100, years);

  return {
    years_to_grow: years,
    total_savings: Math.round(total_savings * 100) / 100,
    real_total_savings: Math.round(real_total_savings * 100) / 100,
    monthly_income_in_retirement: Math.round(monthly_income_in_retirement * 100) / 100,
    after_tax_monthly_income: Math.round(after_tax_monthly_income * 100) / 100,
    future_yearly_spending: Math.round(future_yearly_spending * 100) / 100,
  };
}

/**
 * Ported from calculate_retirement_net_worth in backend/return_calculations.py
 */
export function calculateRetirementNetWorth(inputs: RetirementInputs): ProjectionPoint[] {
  const results: ProjectionPoint[] = [];
  let net_worth = inputs.current_savings;
  let retirement_age = inputs.retirement_age < inputs.current_age ? inputs.current_age : inputs.retirement_age;

  let current_monthly_contribution = inputs.monthly_contribution;
  let inflation_adjusted_yearly_withdrawal = 
    inputs.current_yearly_spending * Math.pow(1 + (inputs.inflation_rate / 100), (retirement_age - inputs.current_age));
  
  // Tax adjustment
  inflation_adjusted_yearly_withdrawal *= 100.0 / (100 - inputs.tax_rate);

  for (let age = inputs.current_age; age <= 100; age++) {
    results.push({
      Year: age,
      "Net Worth": Math.floor(net_worth * 100) / 100.0
    });

    if (age < retirement_age) {
      // Accumulation Phase
      for (let m = 0; m < 12; m++) {
        net_worth = (net_worth + current_monthly_contribution) * (1 + ((inputs.annual_return / 100.0) / 12.0));
      }
      current_monthly_contribution *= (1 + (inputs.contribution_increase_rate / 100.0));
    } else {
      // Decumulation Phase
      for (let m = 0; m < 12; m++) {
        net_worth = net_worth * (1 + ((inputs.annual_return / 100.0) / 12.0));
        net_worth = net_worth - (inflation_adjusted_yearly_withdrawal / 12.0);
      }
      inflation_adjusted_yearly_withdrawal *= (1 + (inputs.inflation_rate / 100.0));
      if (net_worth < 0) net_worth = 0;
    }
  }

  return results;
}

/**
 * Ported from find_required_variable_for_good_retirement
 */
export function findRequiredVariable(
  variable_to_solve: keyof RetirementInputs,
  search_min: number,
  search_max: number,
  baseInputs: RetirementInputs
): number | null {
  let low = search_min;
  let high = search_max;
  let best_so_far: number | null = null;
  const find_lowest = variable_to_solve !== 'current_yearly_spending';

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const testInputs = { ...baseInputs, [variable_to_solve]: mid };
    const projection = calculateRetirementNetWorth(testInputs);
    
    // Check net worth at age 99 (start of age 100)
    const net_worth_at_100 = projection.find(p => p.Year === 99)?.["Net Worth"] || 0;

    if (net_worth_at_100 >= 1) {
      best_so_far = mid;
      if (find_lowest) high = mid;
      else low = mid;
    } else {
      if (find_lowest) low = mid;
      else high = mid;
    }
    if (high - low < 1e-6) break;
  }
  return best_so_far;
}