import Customer from "../../customer/entity/customer";

describe("Customer create event tests", () => {
  it("should notify all event handlers of when the created customer", () => {
    const spyEventHandler1 = jest.spyOn(Customer.enviaConsoleLog1Handler, "handle");
    const spyEventHandler2 = jest.spyOn(Customer.enviaConsoleLog2Handler, "handle");
    const spyConsoleLog = jest.spyOn(console, 'log');

    new Customer("1", "Customer 1");

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
    expect(spyConsoleLog)
      .toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');
    expect(spyConsoleLog)
      .toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');
  });
});