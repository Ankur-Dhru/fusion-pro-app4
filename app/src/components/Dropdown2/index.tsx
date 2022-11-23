import * as React from 'react';
import { Paragraph, Surface, TextInput, Title, withTheme,Text,Divider} from 'react-native-paper';

import DropDown from 'react-native-paper-dropdown';
import {styles} from "../../theme";
import {TouchableOpacity, View} from "react-native";
import DropdownList from "./DropdownList";
import {setModal} from "../../lib/Store/actions/components";
import {findObject, log} from "../../lib/functions";
import {connect} from "react-redux";

import {ProIcon} from "../index";
import {chevronRight} from "../../lib/setting";


class Index extends React.Component<any> {

    constructor(props:any) {
        super(props);
        this.state={selectedvalue:props.value}
    }

    onSelect = (value:any) => {
        this.props.onChange(value.value);
        this.setState({selectedvalue:value.value})
    }

    render(){

        const {list,label,setModal,morestyle,hideDivider,editmode=true}:any = this.props;
        const { colors } = this.props.theme;
        const {selectedvalue}:any = this.state

        let selected = findObject(list,'value',selectedvalue);


        return (
            <View>
                <TouchableOpacity
                    onPress={() => editmode && setModal({
                        visible: true,
                        component: () => <DropdownList
                            label={label}
                            list={list}
                            onSelect={this.onSelect}
                        >
                        </DropdownList>
                    })}>

                    <View style={[styles.grid,styles.bottom,{marginBottom:0}]}>
                        <View style={[styles.cell,styles.w_auto]}>
                            <Text style={[styles.inputLabel,{...morestyle}]}>{label}</Text>
                            {Boolean(selected[0]?.label) && <Paragraph style={[styles.paragraph,styles.text_sm,{marginTop:0,padding:0,marginBottom:5},morestyle?styles.bold:'']}>{selected[0]?.label}</Paragraph>}
                            {!Boolean(selected[0]?.label) && <Paragraph style={[styles.paragraph,styles.text_sm,{marginTop:0,padding:0,color:`${colors.text}2d`}]}>Select {label}</Paragraph>}
                        </View>
                        <View style={[styles.cell,{paddingRight:0}]}>
                            {editmode && <Text>{chevronRight}</Text>}
                        </View>
                    </View>

                </TouchableOpacity>

                {!hideDivider && editmode  && <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>}
            </View>
        );
    }
}


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({
    setModal: (dialog:any) => dispatch(setModal(dialog)),

});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));


