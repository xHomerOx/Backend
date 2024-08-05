import { ticketService } from "../repositories/index.js";

class TicketController {

    async createTicket(purchaser, amount, cart) {
        return await ticketService.createTicket(purchaser, amount, cart);
    }

    async getTicketByCode(ticket) {
        return await ticketService.getTicketByCode(ticket);
    }
}

export default TicketController;