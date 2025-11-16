from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from return_calculations import calculate_retirement_net_worth

app = FastAPI()

# Allow the frontend to talk to the backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RetirementRequest(BaseModel):
    current_age: int
    retirement_age: int
    current_savings: float
    monthly_contribution: float
    annual_return: float
    inflation_rate: float = 2.0
    contribution_increase_rate: float = 0.0
    current_yearly_spending: float = 0.0
    tax_rate: float = 0.0

@app.post("/calculate")
def calculate_retirement(data: RetirementRequest):
    # Simple Logic: Compound Interest Calculation
    years = data.retirement_age - data.current_age
    months = years * 12
    monthly_rate = data.annual_return / 100 / 12
    
    # Future value of current savings
    future_value = data.current_savings * ((1 + monthly_rate) ** months)

    # Contributions that grow over time: simulate monthly contributions that increase by
    # `contribution_increase_rate` annually (approximated monthly growth).
    growth_monthly = data.contribution_increase_rate / 100 / 12
    contributions_fv = 0.0
    for m in range(months):
        # contribution made at month m (0-based) grows for remaining months
        contribution = data.monthly_contribution * ((1 + growth_monthly) ** m)
        contributions_fv += contribution * ((1 + monthly_rate) ** (months - 1 - m))

    total_savings = future_value + contributions_fv

    # Inflation-adjusted (real) value in today's dollars
    if years > 0:
        real_total_savings = total_savings / ((1 + data.inflation_rate / 100) ** years)
    else:
        real_total_savings = total_savings

    # 4% safe withdrawal rule -> monthly income
    monthly_income_in_retirement = total_savings * 0.04 / 12
    after_tax_monthly_income = monthly_income_in_retirement * (1 - data.tax_rate / 100)

    # Project the user's current yearly spending to retirement year using inflation
    future_yearly_spending = data.current_yearly_spending * ((1 + data.inflation_rate / 100) ** years)

    return {
        "years_to_grow": years,
        "total_savings": round(total_savings, 2),
        "real_total_savings": round(real_total_savings, 2),
        "monthly_income_in_retirement": round(monthly_income_in_retirement, 2),
        "after_tax_monthly_income": round(after_tax_monthly_income, 2),
        "future_yearly_spending": round(future_yearly_spending, 2),
        "tax_rate": data.tax_rate,
        "inflation_rate": data.inflation_rate,
        "contribution_increase_rate": data.contribution_increase_rate,
    }

@app.post("/calculate-projection")
def calculate_wealth_projection(data: RetirementRequest):
    """
    Returns year-by-year wealth projection from current age to 100.
    """
    df = calculate_retirement_net_worth(
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        inflation_rate=data.inflation_rate,
        current_savings=data.current_savings,
        monthly_contribution=data.monthly_contribution,
        contribution_increase_rate=data.contribution_increase_rate,
        expected_roi=data.annual_return,
        expected_yearly_spending=data.current_yearly_spending,
        tax_rate=data.tax_rate
    )
    
    # Convert DataFrame to list of dicts for JSON serialization
    projection_data = df.to_dict(orient='records')
    return {
        "projection": projection_data,
        "retirement_age": data.retirement_age
    }