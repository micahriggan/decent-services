import * as React from 'react';
import { Component } from 'react';
import { AddressBox } from '../../components/AddressBox/AddressBox';
import { ShiftToMeService, DestinationAddress, InputAddress } from '../../services/ShiftToMe';
import './View.css';

interface Props {
  match: {
    params: {
      address?: string;
    };
  };
}
export class ViewContainer extends Component<Props> {
  public state: DestinationAddress = {
    address: '',
    currency: '',
    inputs: new Array<InputAddress>()
  };

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    const state = await ShiftToMeService.getAddressInputs(this.props.match.params.address || '');
    this.setState(state);
  }

  public render() {
    const { address, currency, inputs } = this.state;
    const makeListItem = (i: InputAddress) => {
      return (
        <AddressBox key={i.address} currency={i.currency} address={i.address} baseCurrency={currency}/>
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
      <div className="card-header">I accept</div>
      <div className="card-body">
      {makeListItem({address, currency})}
      {listItems}
      </div>
      <div className="card-footer text-muted">
        <a href="/"> Create your own donation page</a>
        </div>
      </div>
    );
  }
}
