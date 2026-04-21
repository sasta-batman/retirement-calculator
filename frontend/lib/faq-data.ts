export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: "How does this retirement calculator work?",
    answer:
      "Our calculator uses compound interest formulas to project your wealth over time. It factors in your current savings, monthly contributions, expected investment returns, inflation, taxes, and spending patterns. The projection runs year-by-year from your current age to age 100, showing how your net worth grows during your saving years and how it's drawn down during retirement.",
  },
  {
    question: "What is compound interest and why does it matter?",
    answer:
      "Compound interest is interest earned on both your original investment and on previously accumulated interest. It's often called the 'eighth wonder of the world' because it causes exponential growth over time. For example, $10,000 invested at 8% annual return becomes $100,627 after 30 years — over 10x your initial investment — without any additional contributions.",
  },
  {
    question: "What are the FIRE presets (Lean, Chubby, Fat)?",
    answer:
      "FIRE stands for 'Financial Independence, Retire Early.' The three levels represent different retirement lifestyles: Lean FIRE covers basic needs with frugal living (~$40k/yr in the US), Chubby FIRE provides a comfortable lifestyle with moderate luxuries (~$100k/yr), and Fat FIRE enables a wealthy lifestyle with full financial freedom (~$250k/yr). Our calculator auto-fills spending amounts for 10 different currencies based on country-specific benchmarks.",
  },
  {
    question: "How does inflation affect my retirement savings?",
    answer:
      "Inflation erodes your purchasing power over time. At 3% inflation, something that costs $100 today will cost $243 in 30 years. Our calculator shows both nominal net worth (the actual dollar amount) and inflation-adjusted net worth (what that money is actually worth in today's dollars). This gives you a realistic picture of your retirement purchasing power.",
  },
  {
    question: "What is a safe withdrawal rate (SWR)?",
    answer:
      "The safe withdrawal rate is the percentage of your portfolio you can spend each year in retirement without running out of money. The most commonly cited rule is the '4% Rule,' based on the Trinity Study, which found that withdrawing 4% of your initial portfolio (adjusted for inflation) historically survived 30-year retirement periods. Our calculator models your actual spending to show whether your savings will last.",
  },
  {
    question: "What is Coast FIRE?",
    answer:
      "Coast FIRE is the point where you've saved enough that compound interest alone will grow your portfolio to your retirement target — even if you stop contributing entirely. After reaching Coast FIRE, you only need to earn enough to cover your current expenses. Our calculator shows when you'll reach this milestone in the Milestones section.",
  },
  {
    question: "Is this calculator accurate?",
    answer:
      "Our calculator uses the same mathematical models used by financial advisors: compound growth for investments, geometric inflation adjustment, and year-by-year cash flow modeling. However, real-world returns fluctuate year to year. The projections assume a constant average return, which is a simplification. For a more conservative estimate, use the 'Conservative' preset (5% returns) or reduce the annual return to account for market volatility.",
  },
  {
    question: "What spending models are available?",
    answer:
      "We offer three spending models: Flat (constant inflation-adjusted spending throughout retirement), Smile (higher spending in early active years and late healthcare years, with lower spending in between — based on research by David Blanchett), and Rising (spending linearly increases, doubling by age 100, to account for growing healthcare costs).",
  },
];
