# Salary Management Demo Script (60-90 seconds)

## Goal

Demonstrate employee lifecycle and salary insights for an HR manager.

## Script

1. Open the app on `http://localhost:5173` and land on **Employees**.
2. Show that list is paginated and responsive with 10,000 records.
3. Use search (`name/email`) and country/department filters.
4. Click **Add Employee**, create a new employee, and show success snackbar.
5. Edit that employee salary and save changes.
6. Delete (deactivate) the same employee and show it disappears from active list.
7. Navigate to **Insights**.
8. Show **summary cards** (total employees, avg/min/max salary).
9. In **Country Salary Distribution**, point to min/max/avg/median/total payroll columns.
10. Select a country and job title in **Country and Job Title Insight** and show avg/min/max/count.
11. End by confirming all insights are computed server-side and list operations use server pagination.

## Optional Talking Points

- Seed script generates exactly 10,000 employees from first and last name lists.
- Data model includes HR-relevant fields (department, employment type, start date, active status).
- API provides filterable employee endpoints and SQL-based aggregate insights.
