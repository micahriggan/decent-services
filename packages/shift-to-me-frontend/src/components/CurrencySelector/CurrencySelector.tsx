import * as React from 'react';
import { Component } from 'react';
import { ShapeShiftService } from '../../services/ShapeShift';

export interface Currency {
  name: string;
  symbol: string;
  image: string;
  imageSmall: string;
  status: string;
}

interface Props {
  label: string;
  onCoinChange?: (value: Currency) => void;
  selectedCurrency?: Currency;
  onCoinsLoad?: (coins: Currency[]) => void;
}

interface State {
  selectedCurrency?: Currency;
  coins?: Currency[];
}

export class CurrencySelector extends Component<Props> {
  public state: State = {};
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
  }

  public async componentDidMount() {
    const availableCoins = await ShapeShiftService.getCoins();
    if (this.props.onCoinsLoad) {
      this.props.onCoinsLoad(availableCoins);
    }
    this.setState({
      coins: availableCoins,
      selectedCurrency: availableCoins[0]
    });
  }

  public onChange(currency: Currency) {
    this.setCurrency(currency);
    if (this.props.onCoinChange) {
      this.props.onCoinChange(currency);
    }
  }

  public setCurrency(currency?: Currency) {
    return this.setState({
      selectedCurrency: currency
    });
  }

  public render() {
    const selected = this.state.selectedCurrency || this.props.selectedCurrency;
    const mkImage = (src: string) => {
      return <img style={{ paddingRight: '10px' }} src={src} />;
    };
    const coins = this.state.coins || [];
    const currencyItems = coins.map(coin => {
      const selectThisCurrency = () => this.onChange(coin);
      return (
        <div key={coin.symbol} onClick={selectThisCurrency}>
        {mkImage(coin.imageSmall)}
        {coin.name}
        </div>
      );
    });
    return (
      <div>
      <div className="btn-group">
      <button
        className="btn btn-secondary btn-lg dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
      {selected ? selected.name : 'Select a currency'}
      </button>
      <div className="dropdown-menu">{currencyItems}</div>
      </div>
      </div>
    );
  }
}
