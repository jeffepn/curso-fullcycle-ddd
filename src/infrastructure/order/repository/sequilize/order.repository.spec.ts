import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  const orderRepository = new OrderRepository();

  const createCustomer = async (id: string): Promise<Customer> => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(id, "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    return customer;
  }

  const createProduct = async (id: string, price: number): Promise<Product> => {
    const productRepository = new ProductRepository();
    const product = new Product(id, "Product 1", price);
    await productRepository.create(product);
    return product;
  }

  const createOrder = async (id: string, customerId: string, product: Product, amountItem: number): Promise<Order> => {
    const orderItem = new OrderItem(`${id}1`, product.name, product.price, product.id, amountItem);
    const order = new Order(id, customerId, [orderItem]);
    await orderRepository.create(order);
    return order;
  }

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    createCustomer('123');
    const product = await createProduct('123', 10);
    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", "123", [orderItem]);

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customer = await createCustomer('123');
    const product = await createProduct('123', 10);
    const order = await createOrder('123', customer.id, product, 2);
    expect(order.total()).toBe(20);

    const orderItem = new OrderItem(order.items[0].id, "Name edit", 8, product.id, 3);
    order.changeItems([orderItem]);
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });
    expect(order.total()).toBe(24);
    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        { id: order.items[0].id, name: "Name edit", price: 8, quantity: 3, order_id: "123", product_id: "123" },
      ],
    });
  });

  it("should find a order", async () => {
    const customer = await createCustomer('123');
    const product = await createProduct('123', 10);
    const order = await createOrder('123', customer.id, product, 2);

    const orderResult = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderResult);
  });

  it("should find all orders", async () => {
    const customer1 = await createCustomer('123');
    const product1 = await createProduct('123', 10);
    const order1 = await createOrder('123', customer1.id, product1, 2);

    const customer2 = await createCustomer('321');
    const product2 = await createProduct('321', 10);
    const order2 = await createOrder('321', customer2.id, product2, 2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});
