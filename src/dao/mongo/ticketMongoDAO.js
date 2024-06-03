import ticketModel from "../../models/ticketModel.js";
import { cartModel } from "../../models/cartModel.js";

class TicketDao {
    constructor() {}

    static getInstance() {
        if (!TicketDao.instance) {
            TicketDao.instance = new TicketDao();
            TicketDao.instance.ticketModel = new ticketModel();
        }
        return TicketDao.instance;
    }

    async createTicket(purchaser, amount, cart) {
        const myCart = await cartModel.findById(cart);
        
        if (!myCart) {
            throw new Error(`Cart ${cart} not found`);
        }

        const ticket = new ticketModel({
          code: `TICKET-${Math.floor(Math.random() * 100000)}`,
          purchase_datetime: new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }),
          amount: Number(amount),
          purchaser: purchaser.toString(),
          products: myCart.products.map((cartProduct) => ({
            product: cartProduct.product,
            quantity: cartProduct.quantity,
          })),
        });
      
        await ticket.save();

        return ticket;
    }
}

export default TicketDao;