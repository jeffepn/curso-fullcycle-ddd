import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAddressChanged from "../event/customer-address-changed";
import CustomerCreatedEvent from "../event/customer-created.event";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log-handler";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log1-handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log2-handler";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  static eventDispatcher = new EventDispatcher();
  static enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
  static enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
  static enviaConsoleLogHandler = new EnviaConsoleLogHandler();

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    this.registerHanlers();
    this.notifyCreatedCustomer();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    this.notifyCustomerAddressChanged();
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }

  private registerHanlers() {
    Customer.eventDispatcher.register("CustomerCreatedEvent", Customer.enviaConsoleLog1Handler);
    Customer.eventDispatcher.register("CustomerCreatedEvent", Customer.enviaConsoleLog2Handler);
    Customer.eventDispatcher.register("CustomerAddressChanged", Customer.enviaConsoleLogHandler);
  }

  private notifyCreatedCustomer() {
    Customer.eventDispatcher.notify(new CustomerCreatedEvent({}));
  }

  private notifyCustomerAddressChanged() {
    Customer.eventDispatcher.notify(new CustomerAddressChanged({
      id: this._id,
      name: this._name,
      address: this._address.toString()
    }));
  }
}
