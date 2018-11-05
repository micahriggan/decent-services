import { MonetizedApp } from 'eth-monetize-client';
import { EthMonetizeClient } from 'eth-monetize-client';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Header, Placeholder, Segment } from 'semantic-ui-react';

interface State {
  loading: boolean;
  apps: MonetizedApp[];
}

export class ListContainer extends React.Component<RouteComponentProps, State> {
  public state: State = {
    apps: [],
    loading: true
  };
  private monetizeClient: EthMonetizeClient;
  constructor(props: any) {
    super(props);
    this.monetizeClient = new EthMonetizeClient();
  }

  public async componentDidMount() {
    setTimeout(async () => {
      const newApps = await this.monetizeClient.getAllMonetizedApps();
      window.console.log(newApps);
      const apps = this.state.apps.concat(newApps);
      this.setState({ apps, loading: false });
    }, 1000);
  }

  public render() {
    return this.state.loading ? this.getPlaceHolder() : this.getList();
  }

  private getEmptyList() {
    return (
      <Segment raised={true}>
        <Header> No Apps Have Been Monetized Yet :( </Header>
      </Segment>
    );
  }

  private handleNavigate(appName: string) {
    return () => this.props.history.push(`/buy/${appName}`);
  }

  private getList() {
    if (this.state.apps.length > 0) {
      return this.state.apps.map(app => {
        return (
          <Segment key={app.appName} raised={true} onClick={this.handleNavigate(app.appName)}>
            <Header image={true}>{app.appName}</Header>
            <div> {app.costPerCall} </div>
          </Segment>
        );
      });
    } else {
      return this.getEmptyList();
    }
  }

  private getPlaceHolder() {
    return (
      <Segment raised={true}>
        <Placeholder>
          <Placeholder.Header image={true}>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length="medium" />
            <Placeholder.Line length="short" />
          </Placeholder.Paragraph>
        </Placeholder>
      </Segment>
    );
  }
}
