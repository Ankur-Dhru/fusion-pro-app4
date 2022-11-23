import * as React from 'react';
import { Paragraph, Surface, TextInput, Title, withTheme,Text} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import {styles} from "../../theme";
import {TouchableOpacity, View} from "react-native";
import {setPageSheet} from "../../lib/Store/actions/components";
import {findObject, log} from "../../lib/functions";
import {connect} from "react-redux";

import Editor from "./editor";
import HTML from "react-native-render-html";
import {InputBox} from "../index";


class Index extends React.Component<any> {

    constructor(props:any) {
        super(props);
        this.state={html:props.html}
    }

    onChange = (value:any) => {
        this.props.onChange(value);
        this.setState({html:value})
    }

    render(){

        const {label,setPageSheet,editmode=true,hidehtml=false,onlyTitle=false,render,btnRender,navigation}:any = this.props;
        const { colors } = this.props.theme;
        const {html}:any = this.state
        const Render:any = render;

        return (
            <View>
                <TouchableOpacity
                    onPress={() => editmode && setPageSheet({
                        visible: true,
                        fullView:true,
                        component: () => <Editor defaultValue={html} label={label} editmode={editmode} btnRender={btnRender} onChange={this.onChange} />
                    })} style={{paddingVertical:5}}>
                    {!Boolean(render) ? <View>
                        <View>
                            {!Boolean(html) && <Text style={[styles.inputLabel,{color:'#bbb',fontSize:14}]}>{label?label:''}</Text>}
                            {Boolean(html) && <View>
                                <HTML baseStyle={{color:colors.inputLabel,margin:0,padding:0}}  source={{ html: html }}   />
                            </View>}
                        </View>
                    </View>  : <Render/> }
                </TouchableOpacity>
            </View>
        );
    }
}


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({
    setPageSheet: (dialog:any) => dispatch(setPageSheet(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));


