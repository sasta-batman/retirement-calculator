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
    if data.retirement_age < data.current_age:
        data.retirement_age  = data.current_age
    years = data.retirement_age - data.current_age
    months = years * 12
    monthly_rate = data.annual_return / 100 / 12
    
    # 1. Future Value of Current Savings (Lump Sum)
    fv_lump_sum = data.current_savings * ((1 + monthly_rate) ** months)

    current_monthly_contribution = data.monthly_contribution
    fv_contributions = 0.0
    
    for m in range(1, months + 1):
        # Add contribution for this month
        fv_contributions += current_monthly_contribution
        
        # Compound the entire pot (previous balance + new contribution)
        fv_contributions *= (1 + monthly_rate)
        
        # If a year has passed (every 12th month), increase the contribution amount
        if m % 12 == 0:
            current_monthly_contribution *= (1 + data.contribution_increase_rate / 100)

    total_savings = fv_lump_sum + fv_contributions

    # 3. Real Value (Inflation Adjusted)
    # Discounting the future pile of money back to today's value
    real_total_savings = total_savings / ((1 + data.inflation_rate / 100) ** years)

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
        expected_yearly_roi=data.annual_return,
        expected_yearly_spending=data.current_yearly_spending,
        tax_rate=data.tax_rate
    )
    
    # Convert DataFrame to list of dicts for JSON serialization
    projection_data = df.to_dict(orient='records')
    return {
        "projection": projection_data,
        "retirement_age": data.retirement_age
    }

@app.post("/find-required-variables")
def find_required_variables(data: RetirementRequest):
    """
    Finds the required values for expected_yearly_roi, monthly_contribution, 
    retirement_age, and expected_yearly_spending to achieve a good retirement.
    """
    from return_calculations import find_required_variable_for_good_retirement
    
    results = {}
    
    # Find required expected_yearly_roi (search range: 0% to 30%)
    results['expected_yearly_roi'] = find_required_variable_for_good_retirement(
        variable_to_solve='expected_yearly_roi',
        search_min=0,
        search_max=200,
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        inflation_rate=data.inflation_rate,
        current_savings=data.current_savings,
        monthly_contribution=data.monthly_contribution,
        contribution_increase_rate=data.contribution_increase_rate,
        expected_yearly_roi=data.annual_return,
        expected_yearly_spending=data.current_yearly_spending,
        tax_rate=data.tax_rate
    )
    
    # Find required monthly_contribution (search range: 0 to 100,000)
    results['monthly_contribution'] = find_required_variable_for_good_retirement(
        variable_to_solve='monthly_contribution',
        search_min=0,
        search_max=100000000,
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        inflation_rate=data.inflation_rate,
        current_savings=data.current_savings,
        monthly_contribution=data.monthly_contribution,
        contribution_increase_rate=data.contribution_increase_rate,
        expected_yearly_roi=data.annual_return,
        expected_yearly_spending=data.current_yearly_spending,
        tax_rate=data.tax_rate
    )
    
    # Find required retirement_age (search range: current_age to 100)
    results['retirement_age'] = find_required_variable_for_good_retirement(
        variable_to_solve='retirement_age',
        search_min=data.current_age,
        search_max=100,
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        inflation_rate=data.inflation_rate,
        current_savings=data.current_savings,
        monthly_contribution=data.monthly_contribution,
        contribution_increase_rate=data.contribution_increase_rate,
        expected_yearly_roi=data.annual_return,
        expected_yearly_spending=data.current_yearly_spending,
        tax_rate=data.tax_rate
    )
    
    # Find required expected_yearly_spending (search range: 0 to 1,000,000)
    results['expected_yearly_spending'] = find_required_variable_for_good_retirement(
        variable_to_solve='expected_yearly_spending',
        search_min=0,
        search_max=100000000,
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        inflation_rate=data.inflation_rate,
        current_savings=data.current_savings,
        monthly_contribution=data.monthly_contribution,
        contribution_increase_rate=data.contribution_increase_rate,
        expected_yearly_roi=data.annual_return,
        expected_yearly_spending=data.current_yearly_spending,
        tax_rate=data.tax_rate
    )
    
    return results