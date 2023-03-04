import React, {Component, memo} from "react";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";
import {log} from "../../lib/functions";
import {setNavigationOptions} from "../../lib/navigation_options";
import FlatListItems from "../../components/FlatList/FlatListItems";
import {Container} from "../../components";
import SupportItem from "./SupportItem";
import LeftIcon from "./LeftIcon";

class ProductList extends Component<any, any> {

    constructor(props: any) {
        super(props);
        const {products, staticProducts} = this.props;
        this.state = {
            products: products?.map((p: any) => {
                let description = "";
                if (p.prodcut) {
                    description += p.prodcut
                }
                if (p.item_id) {
                    description += ` - ${p.item_id}`
                }
                let icon, color;
                if (staticProducts[p?.prodcut]) {
                    icon = staticProducts[p?.prodcut]?.icon;
                    color = staticProducts[p?.prodcut]?.colour;
                }

                return {
                    ...p,
                    title: p.domain,
                    description,
                    icon,
                    color
                }
            }) || []
        };
    }

    _navigate = (params?: any) => {
        const {navigation, route} = this.props;
        let header = "", subheader = "";
        if (route?.params?.name) {
            header = route?.params?.name;
        }
        if (params?.prodcut) {
            subheader += params?.prodcut;
        }
        if (params?.domain) {
            subheader += ` - ${params?.domain}`;
        }
        navigation.navigate("SupportTicketForm", {...params, ...route?.params, header, subheader})
    }

    render() {

        const {products} = this.state;

        const {navigation,theme:{colors}} = this.props;
        setNavigationOptions(navigation, "Select Product",colors)

        return (
            <Container surface={true}>
                <FlatListItems
                    data={products}
                    isLoading={true}
                    renderItem={(props: any) => <SupportItem
                        {...props}
                        onPress={() => this._navigate(props.item)}
                        left={(leftProps: any) => <LeftIcon {...leftProps} {...props}/>}
                    />}
                    disableSearchbar={true}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({
    products: state.rootAppData?.products,
    staticProducts: state.rootAppData.static?.products
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(ProductList)));

