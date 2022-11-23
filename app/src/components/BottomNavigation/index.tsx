import * as React from 'react';
import {BottomNavigation, Text, withTheme} from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import {styles} from "../../theme";
import {connect} from "react-redux";



class Index extends React.Component<any> {

    constructor(props:any){
        super(props);
        const {routes,component,index}:any = this.props;
        this.state = {index:index,routes:routes};
    }

    render() {

        const {index,routes}:any = this.state;
        const {component}:any = this.props;
        const renderScene = BottomNavigation.SceneMap(component);
        const { colors } = this.props.theme;

        return (
            <>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={(index:any)=>this.setState({index:index})}
                renderScene={renderScene}
                keyboardHidesNavigationBar={true}
                labeled={true}
                barStyle={[styles.borderTop,{backgroundColor:colors.bottomNavigation,shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius:3,
                    elevation: 3}]}
            />
            </>
        );
    }
}

export default  (withTheme(Index));


