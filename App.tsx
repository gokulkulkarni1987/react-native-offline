import React from 'react';
import { LogBox } from 'react-native';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import AppNavigator from './navigation/AppNavigator';
import DummyNetworkContext from './DummyNetworkContext';

const onlineUrl = 'https://www.google.com/';
const offlineUrl = 'https://www.weifhweopfhwioehfiwoephfpweoifhewifhpewoif.com';
interface Props {
  skipLoadingScreen?: boolean;
}

interface State {
  isLoadingComplete: boolean;
  network: {
    pingUrl: string;
    toggleConnection: () => void;
  };
}
export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      network: {
        pingUrl: onlineUrl,
        toggleConnection: this.toggleConnection,
      },
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      ...Ionicons.font,
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    });
    LogBox.ignoreLogs(['It appears that you are using old version of react-navigation library. Please update @react-navigation/bottom-tabs, @react-navigation/stack and @react-navigation/drawer to version 5.10.0 or above to take full advantage of new functionality added to react-native-screens'])
    // LogBox.ignoreAllLogs(true);
    this.setState({ isLoadingComplete: true });
  }

  toggleConnection = () => {
    this.setState(prevState => ({
      network: {
        ...prevState.network,
        pingUrl:
          prevState.network.pingUrl === onlineUrl ? offlineUrl : onlineUrl,
      },
    }));
  };

  render() {
    const { isLoadingComplete, network } = this.state;
    const { skipLoadingScreen } = this.props;
    if (!isLoadingComplete && !skipLoadingScreen) {
      return null;
    }
    return (
      <DummyNetworkContext.Provider value={network}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </DummyNetworkContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
