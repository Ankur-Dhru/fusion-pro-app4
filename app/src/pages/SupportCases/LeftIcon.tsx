import React, {memo} from "react";
import {styles} from "../../theme";
import {View} from "react-native";
import {ProIcon} from "../../components";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";

const LeftIcon = ({item, size, ...props}: any) => {
    if (!size) {
        size = 36
    }
    try {
        return <View style={[styles.middle, styles.center, styles.px_4]}>
            <View style={[styles.middle, styles.center, {
                backgroundColor: `#${item.color}`,
                borderRadius: 50,
                height: size,
                width: size
            }]}>
                <ProIcon name={item.icon} type={'light'} color={"#fff"} size={size / 2}/>
            </View>
        </View>
    }
    catch (e){

    }
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(LeftIcon)));

