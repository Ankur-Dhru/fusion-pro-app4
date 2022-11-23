import * as React from 'react';
import ModalSelector from "react-native-modal-selector";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";
import {log} from "../../lib/functions";

class Index extends React.Component<any> {

    render(){
        const {data,onChange,children}:any = this.props;
        const { colors } = this.props.theme;

        return (
            <ModalSelector
                data={data}
                initValue={'1'}
                backdropPressToClose={true}
                overlayStyle={{ flex: 1, paddingBottom:30, paddingHorizontal:10,  justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' }}
                optionContainerStyle={{backgroundColor:'white',borderRadius:10}}
                cancelStyle={{backgroundColor:'white',borderRadius:10}}
                optionStyle={{paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#eee'}}
                optionTextStyle={{color:colors.primary}}
                cancelTextStyle={{textTransform:'capitalize'}}
                onModalClose={(option:any)=>{
                    onChange(option)
                }} >
                {children}
            </ModalSelector>
        );
    }
}
export default  (withTheme(Index));
