import * as React from 'react';
import { Component } from 'react';
import { ShapeShiftService, Currency, MarketInfo } from '../../services/ShapeShift';
import { CoinMarketCap } from '../../services/CoinMarketCap';
let clipboard = require('clipboard-js');
import './AddressBox.css';
/*
 *import * as CopyToClipboard from "react-copy-to-clipboard";
 */

export interface State {
  currencyImage: string;
  copied: boolean;
  marketInfo: MarketInfo[];
  usdPrice: number;
  amountToSend: number;
}
export interface Props {
  address: string;
  currency: string;
  baseCurrency: string;
  payment?: number;
}
export class AddressBox extends Component<Props> {
  state: State = {
    currencyImage: '',
    copied: false,
    marketInfo: [],
    usdPrice: 0,
    amountToSend: -1
  };

  coins: Currency[];
  constructor(props: Props) {
    super(props);
    this.onClipboard = this.onClipboard.bind(this);
  }

  async componentDidMount() {
    const currencyImage = await ShapeShiftService.getImageForCurrency(this.props.currency, true);
    const marketInfo = await ShapeShiftService.getMarketInfoForBase(this.props.baseCurrency);
    const usdPrice = await CoinMarketCap.getUSDPrice(this.props.currency);
    const amountToSend = (this.props.payment || 1 ) / usdPrice;
    this.setState({currencyImage, marketInfo, usdPrice, amountToSend});
  }

  public onClipboard() {
    clipboard.copy(this.props.address);
    this.setState({copied: true});
    setTimeout(() => this.setState({copied: false}), 1000);
  }

  public getPaymentInfo(currency: string, market?: MarketInfo, payment?: number) {
    if (payment) {
      if (this.state.amountToSend > 0) {
        return (
          <div className="market-info"><span> Send {this.state.amountToSend.toFixed(4)} {currency} to Pay {payment} USD
          </span></div>
        );
      } else {
        return <div className="market-info"><span>Currency Unavailable</span></div>;
      }
    } else {
      const maybeMarketInfo = market ?
        (<div className="market-info"><span> Min: {market.min} </span> <span> Max: {market.limit} </span></div> )
        : '';
      return maybeMarketInfo;
    }
  }

  public getAddressPaymentInfo(maybeMarketInfo: '' | JSX.Element ) {
    const messageOrContent = this.state.copied ?  (<div className="message">copied</div>) : (
      <div>
      <img src={this.state.currencyImage} />
      <span className="currency-code">{this.props.currency}: </span>
      <span className="address" onClick={this.onClipboard}>{this.props.address}</span>
      {maybeMarketInfo}
      </div>
    );
    return messageOrContent;

  }

  public render() {
    const market = this.state.marketInfo.find( m => m.pair === `${this.props.currency}_${this.props.baseCurrency}`);
    const maybeMarketInfo = this.getPaymentInfo(this.props.currency, market, this.props.payment);
    const messageOrContent = this.getAddressPaymentInfo(maybeMarketInfo);
    if (this.state.amountToSend > 0 ) {
    return (
      <div className="address-box">
      {messageOrContent}
      </div>
    );
    } else {
      return <div/>;
    }
  }
}
