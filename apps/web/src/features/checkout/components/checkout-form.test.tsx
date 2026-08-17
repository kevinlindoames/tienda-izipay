import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { useCheckoutDraftStore } from "../stores/checkout-draft.store";
import { CheckoutForm } from "./checkout-form";

describe("CheckoutForm", () => {
  beforeEach(() => {
    useCheckoutDraftStore.setState({
      draft: null,
    });
  });

  it("shows validation errors for an empty delivery form", async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);

    await user.click(
      screen.getByRole("button", {
        name: "Revisar pedido",
      }),
    );

    expect(await screen.findByText("Ingresa tus nombres.")).toBeInTheDocument();

    expect(screen.getByText("Ingresa tus apellidos.")).toBeInTheDocument();

    expect(screen.getByText("Ingresa el departamento.")).toBeInTheDocument();

    expect(
      screen.getByText("Ingresa la direccion de entrega."),
    ).toBeInTheDocument();
  });

  it("stores a valid pickup draft without requiring an address", async () => {
    const user = userEvent.setup();

    render(<CheckoutForm />);

    await user.type(screen.getByLabelText("Nombres"), "Kevin");

    await user.type(screen.getByLabelText("Apellidos"), "Lindo");

    await user.type(
      screen.getByLabelText("Correo electronico"),
      "kevin@example.com",
    );

    await user.type(screen.getByLabelText("Telefono"), "987654321");

    await user.selectOptions(
      screen.getByLabelText("Modalidad de entrega"),
      "pickup",
    );

    expect(screen.queryByLabelText("Departamento")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Revisar pedido",
      }),
    );

    expect(
      await screen.findByText("Datos listos para revisar"),
    ).toBeInTheDocument();

    expect(useCheckoutDraftStore.getState().draft).toEqual({
      firstName: "Kevin",
      lastName: "Lindo",
      email: "kevin@example.com",
      phone: "987654321",
      deliveryMode: "pickup",
    });
  });
});
