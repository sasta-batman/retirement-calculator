import math
import pandas as pd

def calculate_monthly_sip_return(initial_amount, monthly_contribution, monthly_roi):
    final_amount = initial_amount * (1 + monthly_roi) ** 12
    final_amount += monthly_contribution * (((1 + monthly_roi) ** 12 - 1) / monthly_roi)
    return final_amount

def calculate_retirement_net_worth(
    current_age,
    retirement_age,
    inflation_rate,
    current_savings,
    monthly_contribution,
    contribution_increase_rate,
    expected_yearly_roi,
    expected_yearly_spending,
    tax_rate
):
    """
    Calculates the year-by-year net worth from current_age to 100.

    Args:
        current_age (int): The starting age.
        retirement_age (int): The age of retirement.
        inflation_rate (float): The expected annual inflation (e.g., 3 for 3%).
        current_savings (float): The initial investment amount.
        monthly_contribution (float): The starting monthly investment.
        contribution_increase_rate (float): The annual % increase in contributions
                                              (e.g., 5 for 5%).
        expected_yearly_roi (float): The expected annual return on investment (e.g., 8 for 8%).
        expected_yearly_spending (float): The yearly spending at the first
                                             year of retirement.

    Returns:
        list: A list of [age, net_worth] lists from current_age to 100.
    """

    # --- Initialize variables ---
    results = []
    net_worth = current_savings
    if retirement_age < current_age:
        retirement_age = current_age

    # Create copies to modify within the loop
    current_monthly_contribution = monthly_contribution
    inflation_adjusted_yearly_withdrawal = expected_yearly_spending * (1 + (inflation_rate / 100.0)) ** (retirement_age - current_age)
    inflation_adjusted_yearly_withdrawal *= 100.0 / (100 - tax_rate)


    # --- Loop from current age to 100 ---
    for age in range(current_age, 101):
        
        # Store the net worth at the *beginning* of this year (age)
        # We use math.floor to keep the currency to two decimal places
        results.append([age, math.floor(net_worth * 100) / 100.0])

        # --- Calculate net worth for the *end* of this year (start of next) ---
        
        # --- Phase 1: Accumulation (Working years) ---
        # This phase lasts up to AND INCLUDING the retirement_age
        if age < retirement_age:
            # 1. Calculate total contribution for the current year
            # total_annual_contribution = current_monthly_contribution * 12
            
            # 2. Calculate end-of-year net worth:
            # (StartAmount * Growth) + NewContributions
            # net_worth = calculate_monthly_sip_return(net_worth, current_monthly_contribution, expected_roi / 100.0 / 12.00)
            for _ in range(12):
                net_worth = (net_worth + current_monthly_contribution) * (1 + ((expected_yearly_roi / 100.0) / 12.0))
            # 3. Increase the *next* year's contribution amount
            # (We don't need to do this on the final year, but it doesn't hurt)
            current_monthly_contribution *= (1 + (contribution_increase_rate / 100.0))

        # --- Phase 2: Decumulation (Retirement years) ---
        # This phase starts the year AFTER retirement_age
        else:
            # 1. Calculate total spending for the current year
            # current_yearly_spending = current_monthly_spending * 12
            
            # 2. Calculate end-of-year net worth:
            # (StartAmount * Growth) - Withdrawals
            # net_worth = (net_worth * (1 + (expected_roi / 100.0))) - inflation_adjusted_yearly_spending
            for _num_months in range(12):
                net_worth = net_worth * (1 + ((expected_yearly_roi / 100.0) / 12.0))
                net_worth = net_worth - (inflation_adjusted_yearly_withdrawal / 12.0)
            
            # 3. Increase the *next* year's spending by inflation
            inflation_adjusted_yearly_withdrawal *= (1 + (inflation_rate / 100.0))

            # 4. Safety check: Net worth cannot go below
            if net_worth < 0:
                net_worth = 0
            
            # 5. If money runs out, stop all future spending
            if net_worth == 0:
                inflation_adjusted_yearly_spending = 0
    
    df = pd.DataFrame(results, columns=['Year', 'Net Worth'])
    # df.set_index('Year', inplace=True)
    return df

def find_required_variable_for_good_retirement(
    variable_to_solve,
    search_min,
    search_max,
    current_age,
    retirement_age,
    inflation_rate,
    current_savings,
    monthly_contribution,
    contribution_increase_rate,
    expected_roi,
    expected_yearly_spending,
    tax_rate
):
    """
    Uses a binary search to find the minimum value of a specified
    variable needed to have a target net worth at age 100.

    Args:
        variable_to_solve (str): The name of the variable to solve for
                                 (e.g., 'expected_roi', 'monthly_contribution').
        search_min (float): The lower bound of the search range.
        search_max (float): The upper bound of the search range.
        ... (all other args from calculate_retirement_net_worth) ...

    Returns:
        float: The minimum value of the target variable that achieves
               the goal, or None if the goal is not achievable
               even at 'search_max'.
    """
    
    # Store all simulation parameters in a dictionary
    # This makes it easy to modify the one we're solving for
    params = {
        'current_age': current_age,
        'retirement_age': retirement_age,
        'inflation_rate': inflation_rate,
        'current_savings': current_savings,
        'monthly_contribution': monthly_contribution,
        'contribution_increase_rate': contribution_increase_rate,
        'expected_roi': expected_roi,
        'expected_yearly_spending': expected_yearly_spending,
        'tax_rate': tax_rate
    }
    assert variable_to_solve in params, f"Unknown variable_to_solve: {variable_to_solve}"
    
    low = search_min
    high = search_max
    best_so_far = None

    for _ in range(20):
        # 1. Try the midpoint of the current search range
        mid = (low + high) / 2
        
        # 2. Update the variable we're solving for
        params[variable_to_solve] = mid
        
        # 3. Run the full simulation
        df = calculate_retirement_net_worth(**params)
        
        # 4. Get the final net worth at age 100
        net_worth_at_100 = df.loc[df['Year'] == 99, 'Net Worth'].iloc[0]
        
        # 5. Adjust the search range (Binary Search)
        if net_worth_at_100 >= 1:
            # This 'mid' value works. It's our new potential answer.
            # Now, let's try to find an *even lower* value that also works.
            best_so_far = mid
            high = mid
        else:
            # This 'mid' value FAILED (net worth was too low).
            # We must search for a *higher* value.
            low = mid
            
        # Optional: Check if we've found a precise-enough answer
        if (high - low) < 1e-6: # Stop if range is tiny
             break

    return best_so_far