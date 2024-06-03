import moment from 'moment-timezone';

class TicketDto {
    constructor(ticket) {
      this.code = ticket.code;
      this.purchase_datetime = moment(ticket.purchase_datetime).tz('America/Argentina/Buenos_Aires').format('DD-MM-YYYY HH:mm:ss');
      this.amount = ticket.amount;
      this.purchaser = ticket.purchaser;
    }
}

export default TicketDto;