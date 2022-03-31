import {
  Exchange,
  IExchangeImplementationConstructorArgs,
} from "../interfaces/exchange";

export class bitcointoyou<T> extends Exchange<T> implements ExchangeBase {
  constructor(args?: IExchangeImplementationConstructorArgs<T>) {
    super({
      id: "bitcointoyou",
      baseUrl: "https://back.bitcointoyou.com/api/v2",
      opts: args?.opts,
      limiter: args?.limiter,
    });
  }

  async getTicker(base: any, quote: string) {
    if (quote === "BRL") quote = "BRLC";
    let res = await this.fetch(`${this.baseUrl}/ticker?pair=${base}_${quote}`);

    res = res.summary;
    return {
      last: res.last,
      ask: res.last,
      bid: res.last,
      vol: res.amount,
    };
  }

  async getBook(base: any, quote: string) {
    if (quote === "BRL") quote = "BRLC";
    const res = await this.fetch(
      `${this.baseUrl}/orderbook?pair=${base}_${quote}&depth=50`,
    );

    return {
      asks: res.asks.map((order: any[]) => ({
        price: order[0],
        amount: order[1],
      })),
      bids: res.bids.map((order: any[]) => ({
        price: order[0],
        amount: order[1],
      })),
    };
  }
}
