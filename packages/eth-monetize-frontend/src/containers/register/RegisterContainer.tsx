import { EthMonetizeClient, MonetizedApp } from 'eth-monetize-client';
import * as React from 'react';
import { Button, Header, Input } from 'semantic-ui-react';

interface State extends MonetizedApp {
  loading: boolean;
}

export class RegisterContainer extends React.Component<any, State> {
  public state: State = {
    appName: '',
    costPerCall: 1,
    loading: true
  };

  private monetizeClient: EthMonetizeClient;
  constructor(props: any) {
    super(props);
    this.monetizeClient = new EthMonetizeClient();
    this.handleAppNameChange = this.handleAppNameChange.bind(this);
    this.handleCostChange = this.handleCostChange.bind(this);
    this.handleRegisterApp = this.handleRegisterApp.bind(this);
  }

  public render() {
    return (
      <div>
        <Header>Register an app with EthMonetizeApi </Header>
        <Input placeholder="App Name" value={this.state.appName} onChange={this.handleAppNameChange} />
        <Input
          placeholder="Price per call"
          type="number"
          value={this.state.costPerCall}
          onChange={this.handleCostChange}
        />
        <Button onClick={this.handleRegisterApp}> Monetize!</Button>
      </div>
    );
  }

  private async handleRegisterApp() {
    window.console.log(this.state);
    const resp = await this.monetizeClient.monetizeApp(this.state.appName, this.state.costPerCall);
    window.console.log(resp);
  }

  private handleAppNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const appName = event.target.value;
    this.setState({ appName });
  }

  private handleCostChange(event: React.ChangeEvent<HTMLInputElement>) {
    const costPerCall = event.target.valueAsNumber;
    this.setState({ costPerCall });
  }
}
