from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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

@app.post("/calculate")
def calculate_retirement(data: RetirementRequest):
    # Simple Logic: Compound Interest Calculation
    years = data.retirement_age - data.current_age
    months = years * 12
    monthly_rate = data.annual_return / 100 / 12
    
    future_value = data.current_savings * ((1 + monthly_rate) ** months)
    
    # Future value of a series (monthly contributions)
    # FV = P * [((1 + r)^n - 1) / r]
    if monthly_rate > 0:
        contributions_fv = data.monthly_contribution * (((1 + monthly_rate) ** months - 1) / monthly_rate)
    else:
        contributions_fv = data.monthly_contribution * months
        
    total_savings = future_value + contributions_fv
    
    return {
        "years_to_grow": years,
        "total_savings": round(total_savings, 2),
        "monthly_income_in_retirement": round(total_savings * 0.04 / 12, 2) # 4% rule
    }