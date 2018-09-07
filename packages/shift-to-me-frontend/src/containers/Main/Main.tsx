import * as React from 'react';
import { Component } from 'react';
import * as request from 'request';
import { PulseLoader } from 'halogenium';
import {
  CurrencySelector,
  Currency
} from '../../components/CurrencySelector/CurrencySelector';
import './Main.css';

interface Props {
  history: String[];
}
interface State {
  currency: string;
  currencyName: string;
  address?: string;
  coinsCount?: number;
  clicked: boolean;
}
export class MainContainer extends Component<Props> {
  public state: State = {
    address: '',
    coinsCount: 0,
    currency: 'BTC',
    currencyName: 'Bitcoin',
    clicked: false
  };

  constructor(props: Props) {
    super(props);
    this.handleCoinChange = this.handleCoinChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleCoinsLoad = this.handleCoinsLoad.bind(this);
    this.registerAddress = this.registerAddress.bind(this);
  }

  public handleCoinChange(coin: Currency) {
    this.setState({ currency: coin.symbol, currencyName: coin.name });
  }

  public handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ address: event.target.value });
  }

  public handleCoinsLoad(coins: Currency[]) {
    const filteredCoins = coins.filter(c => c.status === 'available');
    this.setState({ coinsCount: filteredCoins.length });
  }

  public registerAddress() {
    this.setState({clicked: true});
    request.post(
      {
        json: { address: this.state.address, currency: this.state.currency },
        url: 'http://www.localhost:3000/destination'
      },
      () => {
        this.props.history.push(`/view/${this.state.address}`);
      }
    );
  }

  public render() {
    const mainBody = (
      <a
      href="#"
      className="btn btn-lg btn-primary"
      onClick={this.registerAddress}
      >
      Accept More Coins
      </a>
    );
    const progressSpinner = (<PulseLoader color="#26A65B" size="16px" margin="4px"/>);

    const content = this.state.clicked ? progressSpinner : mainBody;
    return (
      <div id="MainContainer">
      <div className="card text-center">
      <div className="card-header"> I want to accept {this.state.coinsCount} crypto-currencies and
      receive {this.state.currencyName}
</div>
      <div className="card-body">
      <div className="input-group input-group-lg">
      <div className="input-group-prepend" />
      <input
      type="text"
      className="form-control"
      aria-label="Large"
      aria-describedby="inputGroup-sizing-sm"
      placeholder={this.state.currencyName + ' Address'}
      value={this.state.address}
      onChange={this.handleAddressChange}
      />
      </div>
      <CurrencySelector
      label="What currency is your address for?"
      onCoinChange={this.handleCoinChange}
      onCoinsLoad={this.handleCoinsLoad}
      />

      {content}
      </div>
      <div className="card-footer text-muted">
Donations powered by ShiftTo.me
      </div>

      </div>
      </div>

    );
  }
}
