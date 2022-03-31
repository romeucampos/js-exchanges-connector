import {
  Exchange,
  IExchangeImplementationConstructorArgs,
} from "../interfaces/exchange";
import { IOrderbook, ITicker, IExchangeBase } from "../types/common";

interface INovaDAXBaseApiResponse {
  code: string;
  message: string;
}

interface INovaDAXTicker {
  ask: string;
  baseVolume24h: string;
  bid: string;
  high24h: string;
  lastPrice: string;
  low24h: string;
  open24h: string;
  quoteVolume24h: string;
  symbol: string;
  timestamp: number;
}

interface INovaDAXTickerRes extends INovaDAXBaseApiResponse {
  data: INovaDAXTicker;
}

interface INovaDAXTickersRes extends INovaDAXBaseApiResponse {
  code: string;
  data: INovaDAXTicker[];
}

type INovaDAXOrderbookOrder = [string, string];

interface INovaDAXOrderbookRes extends INovaDAXBaseApiResponse {
  data: {
    asks: INovaDAXOrderbookOrder[];
    bids: INovaDAXOrderbookOrder[];
    timestamp: number;
  };
}

export class novadax<T> extends Exchange<T> implements IExchangeBase {
  constructor(args?: IExchangeImplementationConstructorArgs<T>) {
    super({
      id: "novadax",
      baseUrl: "https://api.novadax.com",
      opts: args?.opts,
      limiter: args?.limiter,
      allTickersAllQuotes: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAllTickers(quote: string): Promise<ITicker[]> {
    const { data: res } = await this.fetch<INovaDAXTickersRes>(
      `${this.baseUrl}/v1/market/tickers`,
    );

    return res.map((t) => ({
      exchangeId: this.id,
      base: t.symbol.split("_")[0] as string,
      quote: t.symbol.split("_")[1] as string,
      last: Number(t.lastPrice),
      ask: Number(t.ask),
      bid: Number(t.bid),
      vol: Number(t.baseVolume24h),
    }));
  }

  async getTicker(base: string, quote: string): Promise<ITicker> {
    const { data: res } = await this.fetch<INovaDAXTickerRes>(
      `${this.baseUrl}/v1/market/ticker?symbol=${base}_${quote}`,
    );

    return {
      exchangeId: this.id,
      base,
      quote,
      last: Number(res.lastPrice),
      ask: Number(res.ask),
      bid: Number(res.bid),
      vol: Number(res.baseVolume24h),
    };
  }

  private parseOrder([price, amount]: INovaDAXOrderbookOrder) {
    return {
      price: Number(price),
      amount: Number(amount),
    };
  }

  async getBook(base: string, quote: string): Promise<IOrderbook> {
    const { data: res } = await this.fetch<INovaDAXOrderbookRes>(
      `${this.baseUrl}/v1/market/depth?symbol=${base}_${quote}&size=10`,
    );

    return {
      asks: (res.asks || []).map(this.parseOrder),
      bids: (res.bids || []).map(this.parseOrder),
    };
  }
}
