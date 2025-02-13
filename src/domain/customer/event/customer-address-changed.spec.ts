import Customer from "../../customer/entity/customer";
import Address from "../value-object/address";

describe("Customer change address event tests", () => {
  it("should notify all event handlers of when the address of customer is changed", () => {
    const spyEventHandler1 = jest.spyOn(Customer.enviaConsoleLogHandler, "handle");
    const spyConsoleLog = jest.spyOn(console, 'log');

    const customer = new Customer("1", "Customer 1");
    customer.changeAddress(
      new Address("Rua Alagoas", 500, '03480-234', 'São Paulo')
    );

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyConsoleLog)
      .toHaveBeenCalledWith(
        `Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.Address.toString()}`
      );
  });
});
