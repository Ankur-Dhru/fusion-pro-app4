import React, {Component, useCallback, useMemo} from "react";

import {connect} from "react-redux";
import {styles} from "../../theme";
import {Container, ProIcon} from "../../components";
import {
    Paragraph,
    withTheme,
} from "react-native-paper";
import {Image, View} from "react-native";
import NoResultFound from "../../components/NoResultFound";


class Index extends Component<any> {

    constructor(props:any) {
        super(props);

    }

    render() {


        return (
            <Container surface={true}>
                <View style={[styles.center,styles.middle,styles.h_100]}>
                    <View style={[styles.absolute,styles.w_100,styles.center,styles.middle,{top: '25%'}]}>
                        <NoResultFound/>
                        <Paragraph style={[styles.paragraph,]}>No Workspace Found</Paragraph>
                    </View>
                </View>
            </Container>
        );
    }
}





const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(Index));


