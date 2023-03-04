import React, {Component, memo} from "react";
import {Container} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";
import FlatListItems from "../../components/FlatList/FlatListItems";
import {Linking} from "react-native";
import SupportItem from "./SupportItem";
import LeftIcon from "./LeftIcon";
import {log} from "../../lib/functions";

class SupportRequest extends Component<any, any> {

    constructor(props: any) {
        super(props);
        const {support_category} = this.props;

        this.state = {
            data: Object.keys(support_category)
                .filter((key: any) => key !== "development")
                .map((key: any) => {
                    let data = support_category[key];
                    let title = data.name;
                    let param = {title};
                    let keyName = "";
                    if (key === "technical_support") {
                        keyName = "other_technical";
                        param = {...param, ...data.categorys[keyName], key: keyName};
                    } else if (key === "billing_account") {
                        keyName = "other_billing";
                        param = {...param, ...data.categorys[keyName], key: keyName};
                    } else if (key === "info") {
                        keyName = "general";
                        param = {...param, ...data.categorys[keyName], key: keyName};
                    }

                    return {
                        key,
                        ...data,
                        param,
                        title,
                        description: data.info,
                        color: data.colour
                    }
                })
        }
    }

    _navigate = (params?: any) => {
        const {navigation} = this.props;
        if (params?.key === "bug_report" || params?.key === "feature_request") {
            Linking.openURL(params.link).catch((err) => console.error('An error occurred', err))
        } else {
            let header = "";
            if (params.param?.name) {
                header = params.param?.name;
            }
            if (params?.key == "technical_support") {
                navigation.navigate("ProductList", {...params.param, header})
            } else {
                navigation.navigate("SupportTicketForm", {...params.param, header})
            }
        }
    }

    render() {
        const {navigation,theme:{colors}} = this.props;
        const {data} = this.state;
        setNavigationOptions(navigation, "Support Request",colors)

        return (
            <Container surface={true}>
                <FlatListItems
                    data={data}
                    isLoading={true}
                    renderItem={(props: any) => <SupportItem
                        {...props}
                        onPress={(item: any) => this._navigate(item)}
                        /*left={(leftProps: any) => <LeftIcon {...leftProps} {...props}/>}*/
                    />}
                    disableSearchbar={true}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({
    support_category: state.rootAppData.static.support_category,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(SupportRequest)));

