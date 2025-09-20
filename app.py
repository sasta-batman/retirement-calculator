import streamlit as st
import altair as alt
import return_calculations


st.set_page_config(layout="wide")
st.title("Retirement Calculator 🚀")

st.write("Let's plan your retirement savings!")

# --- Inputs ---

# Top currencies (ISO code, symbol)
TOP_CURRENCIES = [
    ("USD", "$"),
    ("EUR", "€"),
    ("GBP", "£"),
    ("JPY", "¥"),
    ("INR", "₹"),
    ("CNY", "¥"),
    ("CAD", "$"),
    ("AUD", "$"),
    ("SGD", "$"),
]

currency_options = [f"{code} ({symbol})" for code, symbol in TOP_CURRENCIES]

col1, col2 = st.columns(2)

with col1:
    currency_idx = st.selectbox("Select Earning Currency", options=range(len(currency_options)), format_func=lambda i: currency_options[i], index=0)
    currency_code, currency_symbol = TOP_CURRENCIES[currency_idx]
    current_age = st.slider("Your Current Age", min_value=18, max_value=70, value=30)
    retirement_age = st.slider("Your Retirement Age", min_value=current_age, max_value=80, value=60)
    inflation_rate = st.number_input(f"Inflation per year(%)", min_value=0, max_value=100, value=6)
    tax_rate = st.number_input(f"Avg tax on withdrawal(%)", min_value=0, max_value=100, value=25)

with col2:
    current_savings = st.number_input(f"Current Savings (in thousand {currency_symbol})", 0, 100000000000, 1000)
    monthly_contribution = st.number_input(f"Current Monthly Contribution (in thousand {currency_symbol})", 0, 100000000, 2)
    contribution_increase_rate = st.number_input(f"Increase in Contribution per year(%)", 0, 100, 5, 5)
    expected_roi = st.number_input(f"Annual ROI on investment(%)", 0, 100, 10)
    expected_yearly_spending = st.number_input(f"Expected Annual Spending During Retirement (in thousand {currency_symbol})", 0, 100000000, 100)

current_savings = current_savings * 1000
monthly_contribution = monthly_contribution * 1000
expected_yearly_spending = expected_yearly_spending * 1000


nw_per_year = return_calculations.calculate_retirement_net_worth(current_age, retirement_age, inflation_rate, current_savings,
    monthly_contribution, contribution_increase_rate, expected_roi, expected_yearly_spending, tax_rate)

# st.button(
#     label="Calculate Retirement Age",
#     on_click=find_required_variable_for_good_retirement('retirement_age', current_age+1, 100, current_age, retirement_age, inflation_rate, current_savings, monthly_contribution, contribution_increase_rate, expected_roi, expected_yearly_spending, tax_rate)
# )

st.title('Savings Over Time')
st.write(f"All values are shown in {currency_code} ({currency_symbol})")
# st.line_chart(nw_per_year)
chart = alt.Chart(nw_per_year).mark_line(point=True).encode(
    # Map 'Year' to the x-axis
    # We can format the year to remove the comma (e.g., "2,025" -> "2025")
    x=alt.X('Year', axis=alt.Axis(format='d')),

    # Map 'Valuation' to the y-axis
    # This is the magic line! format='~s' applies SI-unit prefixes
    y=alt.Y('Net Worth', axis=alt.Axis(format='~s')),

    # Add tooltips to show values on hover
    tooltip=[
        alt.Tooltip('Year', format='d'),
        alt.Tooltip('Net Worth', format=',.2f') # Format valuation in tooltip
    ]
).interactive()  # Make the chart interactive (zoom/pan)

st.altair_chart(chart, use_container_width=True)
