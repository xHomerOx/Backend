class TicketDao {
    constructor() {
      this.tickets = [];
    }

    static getInstance() {
        if (!TicketDao.instance) {
            TicketDao.instance = new TicketDao();
        }
        return TicketDao.instance;
  }
}

export default TicketDao;