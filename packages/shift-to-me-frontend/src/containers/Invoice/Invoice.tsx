import * as React from 'react';
import { Component } from 'react';
import { AddressBox } from '../../components/AddressBox/AddressBox';
import { ShiftToMeService, DestinationAddress, InputAddress } from '../../services/ShiftToMe';
import './Invoice.css';

interface Props {
  match: {
    params: {
      address?: string;
      amount?: string;
    };
  };
}
type State = DestinationAddress & {
  amount: number;
};
export class InvoiceContainer extends Component<Props> {
  public state: State = {
    address: '',
    currency: '',
    inputs: new Array<InputAddress>(),
    amount: 0
  };

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    const destination = await ShiftToMeService.getAddressInputs(this.props.match.params.address || '');
    const amount = Number(this.props.match.params.amount) || 1;
    const state = Object.assign({}, destination, {amount});
    this.setState(state);
  }

  public render() {
    const { address, currency, inputs, amount } = this.state;
    const makeListItem = (i: InputAddress) => {
      return (
        <AddressBox key={i.address} currency={i.currency} address={i.address} baseCurrency={currency} payment={amount}/>
      );
    };
    const listItems = inputs
      .sort((a, b) => {
        if (a.currency > b.currency) {
          return 1;
        } else if (a.currency < b.currency) {
          return -1;
        } else {
          return 0;
        }
      })
      .map(makeListItem);
    return (
      <div className="view-container card text-center">
      <div className="card-header">Please pay {this.state.amount} USD</div>
      <div className="card-body">
      {makeListItem({address, currency})}
      {listItems}
      </div>
      <div className="card-footer text-muted">
        <a href="/"> Create your own payment page</a>
        </div>
      </div>
    );
  }
}
