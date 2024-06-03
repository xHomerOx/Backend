import { ticketService } from "../repositories/index.js";

class TicketController {

    async createTicket(purchaser, amount, cart) {
        return await ticketService.createTicket(purchaser, amount, cart);
    }
}

export default TicketController;