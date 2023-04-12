import { Invite } from "./models/invite";
import { Order } from "./models/order";
import { Product } from "./models/product";
import { Store } from "./models/store";
import { User } from "./models/user";

export declare module "@medusajs/medusa/dist/models/order" {
  declare interface Order {
    store_id: string;
    store: Store
  }
}

export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    store_id: string
    store: Store
  }
}

export declare module "@medusajs/medusa/dist/models/sales-channel" {
  declare interface SalesChannel {
    store_id: string
    store: Store
  }
}

export declare module "@medusajs/medusa/dist/models/store" {
  declare interface Store {
    admins: User[]
    orders: Order[]
    products: Product[]
    invites: Invite[]
  }
}

export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    store_id: string
    store: Store
  }
}

export declare module "@medusajs/medusa/dist/models/invite" {
  declare interface Invite {
    store_id: string
    store: Store
  }
}

