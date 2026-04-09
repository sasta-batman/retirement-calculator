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
  target_buffer: number; // desired leftover at end of life
  spending_model: 'flat' | 'smile' | 'increasing'; // spending curve type
}

export interface ProjectionPoint {
  Year: number;
  "Net Worth": number;
  "Total Contributions": number;
  "Compound Growth": number;
  "Annual Contribution": number;
  "Annual Withdrawal": number;
}

export interface Milestone {
  age: number;
  label: string;
  value: number;
  type: 'achievement' | 'warning' | 'fire';
}

export interface ProjectionResult {
  projection: ProjectionPoint[];
  milestones: Milestone[];
  coastFireAge: number | null;
  crossoverAge: number | null;
  runOutAge: number | null;
}

/**
 * Smile spending curve multiplier.
 * Higher in early retirement (travel, activities), lower in middle, higher at end (healthcare).
 */
function getSmileMultiplier(yearsIntoRetirement: number, totalRetirementYears: number): number {
  if (totalRetirementYears <= 0) return 1;
  const t = yearsIntoRetirement / totalRetirementYears; // 0 to 1
  // Parabola: higher at start and end, lower in middle
  // f(t) = 1 + 0.2 * (4t^2 - 4t + 1) => ranges from 1.2 at edges to 1.0 at center
  return 1 + 0.15 * (4 * t * t - 4 * t + 1);
}

/**
 * Increasing spending curve multiplier.
 * Starts at 1.0 and grows linearly to 2.0 by the end of retirement.
 * Models a lifestyle where spending steadily rises (e.g., growing hobbies, travel, healthcare).
 */
function getIncreasingMultiplier(yearsIntoRetirement: number, totalRetirementYears: number): number {
  if (totalRetirementYears <= 0) return 1;
  const t = yearsIntoRetirement / totalRetirementYears; // 0 to 1
  // Linear ramp: 1.0 at retirement, 2.0 at end of life
  return 1 + 1.0 * t;
}

/**
 * Enhanced retirement projection with contribution/growth breakdown and milestones.
 */
export function calculateRetirementNetWorth(inputs: RetirementInputs): ProjectionResult {
  const results: ProjectionPoint[] = [];
  const milestones: Milestone[] = [];
  let net_worth = inputs.current_savings;
  let retirement_age = inputs.retirement_age < inputs.current_age ? inputs.current_age : inputs.retirement_age;

  let current_monthly_contribution = inputs.monthly_contribution;
  let inflation_adjusted_yearly_withdrawal =
    inputs.current_yearly_spending * Math.pow(1 + (inputs.inflation_rate / 100), (retirement_age - inputs.current_age));

  // Tax adjustment
  inflation_adjusted_yearly_withdrawal *= 100.0 / (100 - inputs.tax_rate);

  let totalContributions = inputs.current_savings;
  let cumulativeContributionsThisYear = 0;

  let coastFireAge: number | null = null;
  let crossoverAge: number | null = null;
  let runOutAge: number | null = null;

  // Track milestones
  const milestoneThresholds = [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000];
  const hitMilestones = new Set<number>();

  let prevGrowth = 0;

  const totalRetirementYears = 100 - retirement_age;

  for (let age = inputs.current_age; age <= 100; age++) {
    const compoundGrowth = Math.max(0, net_worth - totalContributions);

    results.push({
      Year: age,
      "Net Worth": Math.floor(net_worth * 100) / 100.0,
      "Total Contributions": Math.floor(totalContributions * 100) / 100.0,
      "Compound Growth": Math.floor(compoundGrowth * 100) / 100.0,
      "Annual Contribution": Math.floor(cumulativeContributionsThisYear * 100) / 100.0,
      "Annual Withdrawal": 0,
    });

    // Check milestones
    for (const threshold of milestoneThresholds) {
      if (net_worth >= threshold && !hitMilestones.has(threshold)) {
        hitMilestones.add(threshold);
        milestones.push({
          age,
          label: `reached!`,
          value: threshold,
          type: 'achievement',
        });
      }
    }

    // Coast FIRE: when current savings alone (no more contributions) would grow to cover retirement
    if (coastFireAge === null && age < retirement_age) {
      const yearsToRetirement = retirement_age - age;
      const futureValue = net_worth * Math.pow(1 + inputs.annual_return / 100, yearsToRetirement);
      const annualSpendingAtRetirement = inputs.current_yearly_spending *
        Math.pow(1 + inputs.inflation_rate / 100, retirement_age - inputs.current_age);
      const withdrawalRate = (annualSpendingAtRetirement * (100 / (100 - inputs.tax_rate))) / futureValue;
      if (withdrawalRate <= 0.04 && futureValue > 0) {
        coastFireAge = age;
        milestones.push({
          age,
          label: 'Coast FIRE reached!',
          value: net_worth,
          type: 'fire',
        });
      }
    }

    // Crossover: when compound growth exceeds total contributions
    if (crossoverAge === null && compoundGrowth > totalContributions && totalContributions > 0) {
      crossoverAge = age;
      milestones.push({
        age,
        label: 'Growth exceeds contributions!',
        value: compoundGrowth,
        type: 'achievement',
      });
    }

    cumulativeContributionsThisYear = 0;

    if (age < retirement_age) {
      // Accumulation Phase
      for (let m = 0; m < 12; m++) {
        net_worth = (net_worth + current_monthly_contribution) * (1 + ((inputs.annual_return / 100.0) / 12.0));
        totalContributions += current_monthly_contribution;
        cumulativeContributionsThisYear += current_monthly_contribution;
      }
      current_monthly_contribution *= (1 + (inputs.contribution_increase_rate / 100.0));
    } else {
      // Decumulation Phase
      const yearsIntoRetirement = age - retirement_age;
      let effectiveWithdrawal = inflation_adjusted_yearly_withdrawal;

      if (inputs.spending_model === 'smile') {
        effectiveWithdrawal *= getSmileMultiplier(yearsIntoRetirement, totalRetirementYears);
      } else if (inputs.spending_model === 'increasing') {
        effectiveWithdrawal *= getIncreasingMultiplier(yearsIntoRetirement, totalRetirementYears);
      }

      // Update the last result's Annual Withdrawal
      results[results.length - 1]["Annual Withdrawal"] = Math.floor(effectiveWithdrawal * 100) / 100.0;

      for (let m = 0; m < 12; m++) {
        net_worth = net_worth * (1 + ((inputs.annual_return / 100.0) / 12.0));
        net_worth = net_worth - (effectiveWithdrawal / 12.0);
      }
      inflation_adjusted_yearly_withdrawal *= (1 + (inputs.inflation_rate / 100.0));

      if (net_worth < 0) {
        if (runOutAge === null) {
          runOutAge = age;
          milestones.push({
            age,
            label: 'Money runs out!',
            value: 0,
            type: 'warning',
          });
        }
        net_worth = 0;
      }
    }

    prevGrowth = compoundGrowth;
  }

  return { projection: results, milestones, coastFireAge, crossoverAge, runOutAge };
}

/**
 * Binary search to find the required value of a variable for a successful retirement.
 * "Success" means net worth at age 99 >= target_buffer.
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

  const targetBuffer = baseInputs.target_buffer || 1;

  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    const testInputs = { ...baseInputs, [variable_to_solve]: mid };
    const result = calculateRetirementNetWorth(testInputs);

    // Check net worth at age 99
    const net_worth_at_100 = result.projection.find(p => p.Year === 99)?.["Net Worth"] || 0;

    if (net_worth_at_100 >= targetBuffer) {
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

/**
 * Generate dynamic educational insights based on the user's inputs and results.
 * @param fmt  Currency-aware number formatter supplied by the display layer.
 */
export function generateInsights(
  inputs: RetirementInputs,
  result: ProjectionResult,
  fmt: (n: number) => string = (n) => n.toFixed(0)
): string[] {
  const insights: string[] = [];
  const yearsToRetirement = inputs.retirement_age - inputs.current_age;

  // Insight: Power of starting early
  if (yearsToRetirement > 5) {
    const laterInputs = { ...inputs, current_age: inputs.current_age + 5 };
    const laterResult = calculateRetirementNetWorth(laterInputs);
    const currentAtRetirement = result.projection.find(p => p.Year === inputs.retirement_age)?.["Net Worth"] || 0;
    const laterAtRetirement = laterResult.projection.find(p => p.Year === inputs.retirement_age)?.["Net Worth"] || 0;
    const diff = currentAtRetirement - laterAtRetirement;
    if (diff > 0) {
      insights.push(
        `💡 Starting 5 years earlier gives you ${fmt(diff)} more at retirement — that's the power of compound interest!`
      );
    }
  }

  // Insight: Inflation impact
  const higherInflationInputs = { ...inputs, inflation_rate: inputs.inflation_rate + 1 };
  const higherInflationResult = calculateRetirementNetWorth(higherInflationInputs);
  if (higherInflationResult.runOutAge && !result.runOutAge) {
    insights.push(
      `⚠️ Just a 1% increase in inflation could cause you to run out of money at age ${higherInflationResult.runOutAge}. Inflation is the silent wealth killer.`
    );
  } else if (higherInflationResult.runOutAge && result.runOutAge) {
    const yearsDiff = result.runOutAge - higherInflationResult.runOutAge;
    if (yearsDiff > 0) {
      insights.push(
        `⚠️ A 1% higher inflation rate would exhaust your savings ${yearsDiff} years sooner — at age ${higherInflationResult.runOutAge}.`
      );
    }
  }

  // Insight: Coast FIRE
  if (result.coastFireAge !== null) {
    insights.push(
      `🔥 You reach Coast FIRE at age ${result.coastFireAge} — from that point, your savings would grow to cover retirement even without any new contributions.`
    );
  }

  // Insight: Run out warning
  if (result.runOutAge !== null) {
    insights.push(
      `🚨 At current projections, your money runs out at age ${result.runOutAge}. Consider increasing contributions or reducing spending.`
    );
  }

  // Insight: Compound growth dominance
  if (result.crossoverAge !== null) {
    insights.push(
      `📈 At age ${result.crossoverAge}, your investment growth overtakes your total contributions. After this, compound interest does the heavy lifting!`
    );
  }

  // Insight: Tax drag
  if (inputs.tax_rate > 15) {
    const lowerTaxInputs = { ...inputs, tax_rate: inputs.tax_rate - 5 };
    const lowerTaxResult = calculateRetirementNetWorth(lowerTaxInputs);
    const currentAt99 = result.projection.find(p => p.Year === 99)?.["Net Worth"] || 0;
    const lowerAt99 = lowerTaxResult.projection.find(p => p.Year === 99)?.["Net Worth"] || 0;
    const diff = lowerAt99 - currentAt99;
    if (diff > 10000) {
      insights.push(
        `💰 Reducing your effective tax rate by 5% (e.g., through tax-advantaged accounts) could leave you with ${fmt(diff)} more at age 99.`
      );
    }
  }

  // Insight: Contribution increase impact
  if (inputs.contribution_increase_rate < 3) {
    insights.push(
      `📊 Tip: Increasing your contributions by just 3% annually (e.g., matching salary raises) can dramatically accelerate your savings in later years.`
    );
  }

  return insights.slice(0, 4); // Max 4 insights at a time
}

/**
 * Generate a narrative summary of the retirement projection.
 * @param fmt  Currency-aware number formatter supplied by the display layer.
 */
export function generateNarrative(
  inputs: RetirementInputs,
  result: ProjectionResult,
  fmt: (n: number) => string = (n) => n.toFixed(0)
): string {
  const retirementNetWorth = result.projection.find(p => p.Year === inputs.retirement_age)?.["Net Worth"] || 0;
  const netWorthAt99 = result.projection.find(p => p.Year === 99)?.["Net Worth"] || 0;
  const yearsToRetirement = inputs.retirement_age - inputs.current_age;
  const inflationAdjustedNetWorth = retirementNetWorth / Math.pow(1 + inputs.inflation_rate / 100, yearsToRetirement);

  let narrative = `Starting at age ${inputs.current_age} with ${fmt(inputs.current_savings)} in savings and contributing ${fmt(inputs.monthly_contribution * 12)}/year, `;

  if (result.runOutAge !== null) {
    narrative += `your current plan would unfortunately run out of money at age ${result.runOutAge}. `;
    if (result.runOutAge < 80) {
      narrative += `This is well below average life expectancy. Consider reducing your yearly spending, increasing contributions, or pushing retirement a few years later.`;
    } else {
      narrative += `You're close to making it work — small adjustments to your spending or contributions could close the gap.`;
    }
  } else {
    narrative += `you're projected to accumulate ${fmt(retirementNetWorth)} by age ${inputs.retirement_age} (${fmt(inflationAdjustedNetWorth)} in today's purchasing power). `;

    if (netWorthAt99 > retirementNetWorth * 0.5) {
      narrative += `Your plan is very robust — you'd still have substantial wealth at age 99.`;
    } else if (netWorthAt99 > 0) {
      narrative += `Your money lasts to age 99+, though the buffer is modest. A market downturn or unexpected expenses could challenge this plan.`;
    }
  }

  return narrative;
}
