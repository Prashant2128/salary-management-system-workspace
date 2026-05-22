import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmployeeDialog } from "../src/components/EmployeeDialog";

describe("EmployeeDialog", () => {
  it("shows validation error for invalid email", async () => {
    render(
      <EmployeeDialog
        open
        employee={null}
        onClose={vi.fn()}
        onSubmit={vi.fn(async () => Promise.resolve())}
        isSubmitting={false}
      />
    );

    const emailField = screen.getByLabelText("Email");
    await userEvent.clear(emailField);
    await userEvent.type(emailField, "invalid-email");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(screen.getByText(/invalid email/i)).toBeInTheDocument());
  });
});
