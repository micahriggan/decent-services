import { EthMonetizeClient, MonetizedApp } from 'eth-monetize-client/ts_build';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Input } from 'semantic-ui-react';

type Props = RouteComponentProps<{
  app: string;
}>;
interface State extends MonetizedApp {
  loading: boolean;
  purchaseAmount: number;
}
export class BuyContainer extends React.Component<Props, State> {
  public monetizationClient: EthMonetizeClient;
  public state: State = {
    appName: '',
    costPerCall: 0,
    loading: true,
    purchaseAmount: 0
  };
  constructor(props: Props) {
    super(props);
    this.monetizationClient = new EthMonetizeClient();
    this.handlePurchaseAmountChange = this.handlePurchaseAmountChange.bind(this);
  }

  public async componentDidMount() {
    const app = this.props.match.params.app;
    const { appName, costPerCall } = await this.monetizationClient.getMonetizedApp(app);
    this.setState({ appName, costPerCall });
  }
  public render() {
    return (
      <div>
        <div>{this.state.appName}</div>
        <div>{this.state.costPerCall}</div>
        <div>
          <Input
            type="number"
            placeholder="Amount of api calls"
            value={this.state.purchaseAmount}
            onChange={this.handlePurchaseAmountChange}
          />
        </div>
      </div>
    );
  }

  private async handlePurchaseAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const purchaseAmount = event.target.valueAsNumber;
    if (purchaseAmount && purchaseAmount > 0) {
      window.console.log(purchaseAmount);
      this.setState({ purchaseAmount });
      const quote = await this.monetizationClient.getQuoteForApp(this.state.appName, purchaseAmount);
      window.console.log(quote);
    }
  }
}
