import React,{Component} from "react";
import {connect} from "react-redux";
import {Alert, Platform, Text, View} from "react-native";
import {ActivityIndicator, Button, Colors, Surface, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import ClientareaLoader from "../ContentLoader/ClientareaLoader";
import FormLoader from "../ContentLoader/FormLoader";
import ListLoader from "../ContentLoader/ListLoader";
import PrintLoader from "../ContentLoader/PrintLoader";
import {log} from "../../lib/functions";
import {v4 as uuidv4} from "uuid";


class Index extends Component<any,any> {
    constructor(props:any){
        super(props);
    }
    render() {

        const {loader:{show,type},theme:{colors}}:any = this.props;

        const  Component:any = () => {
            return (
                <>
                    {(type === 'list' || type === 'clientarea' || type === 'form' || type === 'print') &&
                        <Surface style={[{elevation:0,marginTop:Platform.OS==='ios'?90:50}]}>
                            {type === 'list' &&  <ListLoader  />  }
                            {type === 'clientarea' &&  <ClientareaLoader     />  }
                            {type === 'form' &&  <FormLoader    />  }
                            {type === 'print' &&  <PrintLoader   />  }
                        </Surface>}
                 </>
            )
        }


        if(!show){
            return <></>
        }

        return (
            <View  style={styles.loader}>
                {type === 'activity' && <View  style={[styles.screenCenter,styles.h_100,styles.transparent]}>
                    <View style={{borderRadius:50}}>
                        <ActivityIndicator style={styles.m_1} color={'#016EFE'} size='large' animating={true}   />
                    </View>
                </View> }
                <Component/>
            </View>

        );
    }
}

const mapStateToProps = (state:any) => ({
    loader : state.components.loader,
})
export default  connect(mapStateToProps)(withTheme(Index));


