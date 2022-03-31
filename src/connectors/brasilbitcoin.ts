import {
  Exchange,
  IExchangeImplementationConstructorArgs,
} from "../interfaces/exchange";
import { IOrderbook, ITicker, IExchangeBase } from "../types/common";

export class brasilbitcoin<T> extends Exchange<T> implements IExchangeBase {
  constructor(args?: IExchangeImplementationConstructorArgs<T>) {
    super({
      id: "brasilbitcoin",
      baseUrl: "https://brasilbitcoin.com.br/API",
      opts: args?.opts,
      limiter: args?.limiter,
    });
  }

  async getTicker(base: string, quote: string): Promise<ITicker> {
    const res = await this.fetch(`${this.baseUrl}/prices/${base}`);

    return {
      exchangeId: this.id,
      base,
      quote,
      last: res.last,
      ask: res.sell,
      bid: res.buy,
      vol: res.vol,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBook(base: string, quote: string): Promise<IOrderbook> {
    const res = await this.fetch(`${this.baseUrl}/orderbook/${base}`);

    return {
      asks: res.sell.map((o: { preco: number; quantidade: number }) => ({
        price: o.preco,
        amount: o.quantidade,
      })),
      bids: res.buy.map((o: { preco: number; quantidade: number }) => ({
        price: o.preco,
        amount: o.quantidade,
      })),
    };
  }
}
