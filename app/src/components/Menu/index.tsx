import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import { Button, Paragraph, Menu, Divider, Appbar} from 'react-native-paper';
import {connect} from "react-redux";
import {log} from "../../lib/functions";



class Index extends React.Component<any> {

    state = {
        visible: false,
    };
    _openMenu = () => this.setState({ visible: true });
    _closeMenu = () => this.setState({ visible: false });

    render() {

        const {label, menulist, onPress,children,width}:any = this.props;

        return (
            <View>
                <Menu
                    visible={this.state.visible}
                    onDismiss={this._closeMenu}
                    anchor={
                        <TouchableOpacity style={{width:width}} onPress={this._openMenu}>{children}</TouchableOpacity>
                    }
                >
                    {
                        menulist && menulist.map((menu:any)=>{
                            return <Menu.Item key={menu.value} onPress={() => {
                                onPress(menu);
                                this._closeMenu();
                            }} title={menu.label} />
                        })
                    }
                </Menu>

            </View>

        );
    }
}

const mapStateToProps = (state:any) => ({

})
export default  connect(mapStateToProps)(Index);




