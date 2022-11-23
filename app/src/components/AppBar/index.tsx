import * as React from 'react';
import {Appbar, Button, Paragraph} from 'react-native-paper';
import {styles} from "../../theme";
import Search from "../SearchBox";
import {log} from "../../lib/functions";
import {Appearance, View} from "react-native";
import {setSettings} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";
import {setBottomSheet,setPageSheet, setModal} from "../../lib/Store/actions/components";
import {defaultvalues} from "../../lib/setting";
import {ProIcon} from "../index";
import Avatar from "../Avatar";
const colorScheme = Appearance.getColorScheme();


class Index extends React.Component<any> {


    render(){
        const {title,subtitle,children,navigation,back,preferences,isModal,setModal,setBottomSheet,setPageSheet,hideMenuSharp,connection}:any = this.props;

        let theme = colorScheme;
        if(preferences && preferences.theme === 'Light'){
            theme = 'light';
        }
        else if(preferences && preferences.theme === 'Dark'){
            theme = 'dark';
        }


        return (
            <>
            <Appbar.Header style={[styles.appbar]} {...this.props} dark={theme==='dark'}>



                {!back && !isModal && !hideMenuSharp && <Appbar.Action  size={26} icon={()=> <Avatar label={'AA'} value={'10'} size={28}  /> } onPress={()=> {navigation.openDrawer()} } />}

                {back && !isModal &&  <Appbar.BackAction   size={16}    onPress={() => {navigation.goBack()  }}/> }



                {isModal && back && <View style={[{marginLeft:10,marginRight:10}]}><ProIcon
                     align={'left'}
                    name={'chevron-left'}
                    onPress={() => {
                        setModal({visible: false,component: () => {return <></>}});
                        setBottomSheet({visible: false,component: () => {return <></>}});
                        setPageSheet({visible: false,component: () => {return <></>}})
                    }} /></View>  }

                {Boolean(title) &&  <Appbar.Content
                    titleStyle={[styles.appbartitle]}
                    title={title}
                    subtitleStyle={[styles.appbartitle]}
                    subtitle={subtitle} /> }

                {children?children:<View style={{width:60}}></View>}


            </Appbar.Header>


            </>
        );
    }
}

const mapStateToProps = (state:any) => ({
    preferences: state.appApiData.preferences,
    connection:state.appApiData.connection,
})
const mapDispatchToProps = (dispatch:any) => ({
    setModal: (modal:any) => dispatch(setModal(modal)),
    setBottomSheet: (modal:any) => dispatch(setBottomSheet(modal)),
    setPageSheet: (modal:any) => dispatch(setPageSheet(modal)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Index);
